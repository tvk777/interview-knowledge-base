import Link from "next/link";

import { tagChipLinkClassName } from "@/components/common/TagChip";
import LandingHeader from "@/components/landing/LandingHeader";
import { getTags, getTechnologies } from "@/services/knowledge-base";

export default async function Home() {
  const technologies = await getTechnologies();
  const sections = await Promise.all(
    technologies.map(async (technology) => ({
      technology,
      tags: await getTags(technology.slug),
    })),
  );

  return (
    <div className="flex h-full flex-col">
      <LandingHeader technologies={technologies} />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map(({ technology, tags }) => (
            <section key={technology.slug}>
              <h2 className="mb-2 text-lg font-semibold">
                <Link
                  href={`/${technology.slug}`}
                  className="hover:underline"
                >
                  {technology.name}
                </Link>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[...tags]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/${technology.slug}?tag=${encodeURIComponent(tag.name)}`}
                      className={tagChipLinkClassName()}
                    >
                      {tag.name}
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
