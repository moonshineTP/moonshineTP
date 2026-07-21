export type SearchEntry = {
  description: string;
  href: string;
  tags: readonly string[];
  title: string;
};

// Content loading will populate this index when publishable entries are added.
const searchEntries: readonly SearchEntry[] = [];

function normalizeMetadata(value: string) {
  return value.normalize("NFC").toLocaleLowerCase("vi-VN").trim();
}

export function searchMetadata(query: string) {
  const normalizedQuery = normalizeMetadata(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchEntries.filter((entry) => {
    const metadata = [entry.title, entry.description, ...entry.tags]
      .map(normalizeMetadata)
      .join(" ");

    return metadata.includes(normalizedQuery);
  });
}
