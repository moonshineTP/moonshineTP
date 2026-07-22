[CmdletBinding()]
param(
    [string]$RepositoryRoot
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) {
    $RepositoryRoot = Split-Path -Parent $PSScriptRoot
}

$repository = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$documentRoots = @(
    (Join-Path $repository "docs"),
    (Join-Path $repository "specs")
)
$manifestPath = Join-Path $repository "docs\manifest.md"
$issues = [System.Collections.Generic.List[string]]::new()
$mojibakeSequences = @(
    (-join @([char]0x00E2, [char]0x20AC, [char]0x2122)),
    (-join @([char]0x00E2, [char]0x20AC, [char]0x201C)),
    (-join @([char]0x00E2, [char]0x20AC, [char]0x201D)),
    (-join @('T', 'i', [char]0x00E1, [char]0x00BA, [char]0x00BF, 'n', 'g'))
)

function Get-RelativePath {
    param([string]$Path)

    $rootUri = [System.Uri]::new($repository.TrimEnd('\') + '\')
    $pathUri = [System.Uri]::new($Path)
    return [System.Uri]::UnescapeDataString(
        $rootUri.MakeRelativeUri($pathUri).ToString()
    )
}

function Test-RegisteredLocalReference {
    param([string]$Path)

    $fullPath = [System.IO.Path]::GetFullPath($Path)
    $relativePath = Get-RelativePath $fullPath
    $isLocalReference =
        $relativePath -match '(^|/)sample/' -or
        $relativePath -match '^docs/feature/dynamic-readme/assets/'
    if (-not $isLocalReference) {
        return $false
    }

    $sourceRecord = Join-Path ([System.IO.Path]::GetDirectoryName($fullPath)) "SOURCES.md"
    if (-not (Test-Path -LiteralPath $sourceRecord)) {
        return $false
    }

    $fileName = [System.IO.Path]::GetFileName($fullPath)
    $sourceContent = Get-Content -Raw -Encoding UTF8 -LiteralPath $sourceRecord
    return $sourceContent.Contains("``$fileName``")
}

$optionalReferenceLinks = 0

$markdownFiles = @(
    Get-ChildItem -LiteralPath $documentRoots -Recurse -File -Filter "*.md" |
        Sort-Object FullName
)

foreach ($file in $markdownFiles) {
    $relativePath = Get-RelativePath $file.FullName
    $content = Get-Content -Raw -Encoding UTF8 -LiteralPath $file.FullName

    if ([string]::IsNullOrWhiteSpace($content)) {
        $issues.Add("empty document: $relativePath")
        continue
    }

    $firstLine = @(
        $content -split "`r?`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    )[0]
    if ($firstLine -notmatch '^# [^#]') {
        $issues.Add("first content line is not an H1: $relativePath")
    }

    $h1Count = [regex]::Matches($content, '(?m)^# [^#]').Count
    if ($h1Count -ne 1) {
        $issues.Add("expected one H1, found ${h1Count}: $relativePath")
    }

    if ($content.Contains([char]0x2014)) {
        $issues.Add("em dash found: $relativePath")
    }
    if ($content.Contains([char]0xFFFD)) {
        $issues.Add("Unicode replacement character found: $relativePath")
    }
    foreach ($sequence in $mojibakeSequences) {
        if ($content.Contains($sequence)) {
            $issues.Add("possible mojibake '$sequence': $relativePath")
        }
    }

    foreach ($marker in @("TODO", "FIXME", "[UNVERIFIED]", "[To be written]", "[Content here]")) {
        if ($content.Contains($marker)) {
            $issues.Add("editorial residue '$marker': $relativePath")
        }
    }

    $emptyImageAlts = [regex]::Matches($content, '!\[\s*\]\(')
    if ($emptyImageAlts.Count -gt 0) {
        $issues.Add("image without alt text: $relativePath")
    }

    $links = [regex]::Matches($content, '!{0,1}\[[^\]]*\]\((?<target>[^)]+)\)')
    foreach ($link in $links) {
        $target = $link.Groups['target'].Value.Trim()
        if ($target.StartsWith('<') -and $target.EndsWith('>')) {
            $target = $target.Substring(1, $target.Length - 2)
        }
        if ($target -match '^(https?:|mailto:|#)') {
            continue
        }

        $pathOnly = ($target -split '[#?]', 2)[0]
        if ([string]::IsNullOrWhiteSpace($pathOnly)) {
            continue
        }

        $decodedPath = [System.Uri]::UnescapeDataString($pathOnly).Replace('/', '\')
        $resolvedTarget = Join-Path $file.DirectoryName $decodedPath
        if (-not (Test-Path -LiteralPath $resolvedTarget)) {
            if (Test-RegisteredLocalReference $resolvedTarget) {
                $optionalReferenceLinks++
            } else {
                $issues.Add("broken local link in ${relativePath}: $target")
            }
        }
    }
}

$referenceDirectories = @(
    Get-ChildItem -LiteralPath (Join-Path $repository "docs") -Recurse -Directory |
        Where-Object { $_.Name -in @("sample", "assets") }
)
foreach ($directory in $referenceDirectories) {
    $media = @(
        Get-ChildItem -LiteralPath $directory.FullName -File |
            Where-Object { $_.Extension -match '^\.(png|jpe?g|webp|avif)$' }
    )
    if ($media.Count -gt 0 -and -not (Test-Path -LiteralPath (Join-Path $directory.FullName "SOURCES.md"))) {
        $issues.Add("reference directory lacks SOURCES.md: $(Get-RelativePath $directory.FullName)")
    }
}

$questionPath = Join-Path $repository "docs\backlog\open-qa.md"
$questionContent = Get-Content -Raw -Encoding UTF8 -LiteralPath $questionPath
$questionBlocks = [regex]::Matches(
    $questionContent,
    '(?ms)^### (?<id>[^:\r\n]+):.*?(?=^### |^## |\z)'
)
$questionIds = [System.Collections.Generic.HashSet[string]]::new()
foreach ($block in $questionBlocks) {
    $id = $block.Groups['id'].Value
    if ($id -notmatch '^[A-Z]+-\d{2}$') {
        $issues.Add("invalid permanent question code: $id")
    }
    if (-not $questionIds.Add($id)) {
        $issues.Add("duplicate question id: $id")
    }
    foreach ($field in @("Question", "Status", "Answer", "Source")) {
        if ($block.Value -notmatch "(?m)^\*\*$field\*\*:") {
            $issues.Add("question $id lacks $field")
        }
    }
}

$backlogPath = Join-Path $repository "docs\backlog\backlog.md"
$backlogContent = Get-Content -Raw -Encoding UTF8 -LiteralPath $backlogPath
$knownBacklogIds = [System.Collections.Generic.HashSet[string]]::new()
$backlogIds = [System.Collections.Generic.HashSet[string]]::new()
foreach ($match in [regex]::Matches($backlogContent, '(?m)^### (?<id>[^:\r\n]+):')) {
    $id = $match.Groups['id'].Value
    if ($id -notmatch '^[A-Z]+-\d{2}$') {
        $issues.Add("invalid permanent backlog code: $id")
    }
    if (-not $backlogIds.Add($id)) {
        $issues.Add("duplicate backlog id: $id")
    }
    [void]$knownBacklogIds.Add($id)
}
foreach ($id in $questionIds) {
    [void]$knownBacklogIds.Add($id)
}

$betaOnePath = Join-Path $repository "docs\backlog\release\beta\beta-1\overview.md"
$betaOneContent = Get-Content -Raw -Encoding UTF8 -LiteralPath $betaOnePath
$releaseTaskIds = [System.Collections.Generic.HashSet[string]]::new()
foreach ($match in [regex]::Matches($betaOneContent, '(?m)^- `(?<id>[^`]+)`:')) {
    $id = $match.Groups['id'].Value
    if ($id -notmatch '^B1-[A-Z]+-\d{2}$') {
        $issues.Add("invalid Beta 1 release task code: $id")
    }
    if (-not $releaseTaskIds.Add($id)) {
        $issues.Add("duplicate Beta 1 release task code: $id")
    }
}
$coverageBlocks = [regex]::Matches(
    $betaOneContent,
    '(?ms)^\*\*Backlog coverage\*\*: (?<body>.*?)(?=\r?\n\r?\n)'
)
foreach ($coverageBlock in $coverageBlocks) {
    foreach ($match in [regex]::Matches($coverageBlock.Groups['body'].Value, '[A-Z]+-\d+')) {
        $id = $match.Value
        if (-not $knownBacklogIds.Contains($id)) {
            $issues.Add("Beta 1 coverage references unknown backlog id: $id")
        }
    }
}

$freshnessPaths = @(
    "docs/backlog/backlog.md",
    "docs/backlog/open-qa.md",
    "docs/backlog/release/version.md",
    "docs/backlog/release/beta/beta-0/overview.md",
    "docs/backlog/release/beta/beta-1/overview.md"
)
foreach ($relativePath in $freshnessPaths) {
    $fullPath = Join-Path $repository $relativePath.Replace('/', '\')
    $content = Get-Content -Raw -Encoding UTF8 -LiteralPath $fullPath
    if ($content -notmatch '(?m)^Last reconciled: `\d{4}-\d{2}-\d{2}`\.$') {
        $issues.Add("missing or invalid reconciliation date: $relativePath")
    }
}

if (-not (Test-Path -LiteralPath $manifestPath)) {
    $issues.Add("missing docs/manifest.md")
} else {
    $manifest = Get-Content -Raw -Encoding UTF8 -LiteralPath $manifestPath
    foreach ($file in $markdownFiles) {
        $relativePath = Get-RelativePath $file.FullName
        if (-not $manifest.Contains("``$relativePath``")) {
            $issues.Add("manifest omits: $relativePath")
        }
    }
}

$assetCount = @(
    Get-ChildItem -LiteralPath (Join-Path $repository "docs") -Recurse -File |
        Where-Object { $_.Extension -match '^\.(png|jpe?g|webp|avif)$' }
).Count
$externalLinkCount = 0
foreach ($file in $markdownFiles) {
    $content = Get-Content -Raw -Encoding UTF8 -LiteralPath $file.FullName
    $externalLinkCount += [regex]::Matches($content, '\]\(https?://').Count
}

Write-Output "docs-validation"
Write-Output "markdown_files=$($markdownFiles.Count)"
Write-Output "binary_assets=$assetCount"
Write-Output "question_records=$($questionBlocks.Count)"
Write-Output "permanent_backlog_codes=$($knownBacklogIds.Count)"
Write-Output "release_task_codes=$($releaseTaskIds.Count)"
Write-Output "external_links=$externalLinkCount"
Write-Output "optional_reference_links=$optionalReferenceLinks"
Write-Output "issues=$($issues.Count)"

foreach ($issue in $issues) {
    Write-Output "FAIL $issue"
}

if ($issues.Count -gt 0) {
    exit 1
}

Write-Output "PASS documentation gate checks"
