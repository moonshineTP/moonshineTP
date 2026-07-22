import { blogTemplates } from "@/lib/blog";

export type SearchEntry = {
  description: string;
  href: string;
  publishedAt: string;
  tags: readonly string[];
  title: string;
};

const searchEntries: readonly SearchEntry[] = blogTemplates.map((entry) => ({
  description: entry.description,
  href: `/blog/${entry.slug}`,
  publishedAt: entry.publishedAt,
  tags: entry.tags,
  title: entry.title,
}));

function normalizeMetadata(value: string) {
  return value.normalize("NFC").toLocaleLowerCase("vi-VN").trim();
}

export function searchMetadata(query: string) {
  const normalizedQuery = normalizeMetadata(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchEntries.filter((entry) =>
    [entry.title, entry.description, entry.publishedAt, ...entry.tags]
      .map(normalizeMetadata)
      .includes(normalizedQuery),
  );
}
