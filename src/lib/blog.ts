export type BlogTemplate = {
  description: string;
  paragraphs: readonly string[];
  publishedAt: string;
  sectionTitle: string;
  slug: string;
  tags: readonly string[];
  title: string;
};

export const blogTemplates: readonly BlogTemplate[] = [];

export function getBlogTemplate(slug: string) {
  return blogTemplates.find((entry) => entry.slug === slug);
}
