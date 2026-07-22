import Link from "next/link";

import { blogTemplates } from "@/lib/blog";

import styles from "./blog.module.css";

export default function BlogPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Blog</p>
        <h1 className={styles.title}>Notes.</h1>
        <p className={styles.lede}>
          Writing on systems, study, and the work between them.
        </p>
      </header>

      {blogTemplates.length > 0 ? (
        <section className={styles.archive} aria-label="Blog entries">
          <ol className={styles.archiveList}>
            {blogTemplates.map((entry) => (
              <li className={styles.archiveItem} key={entry.slug}>
                <Link className={styles.archiveLink} href={`/blog/${entry.slug}`}>
                  <div>
                    <h2 className={styles.entryTitle}>{entry.title}</h2>
                    <p className={styles.entryDescription}>{entry.description}</p>
                  </div>
                  <div className={styles.archiveMeta}>
                    <p className={styles.metadata}>{entry.publishedAt}</p>
                    <ul className={styles.tags} aria-label="Tags">
                      {entry.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </main>
  );
}
