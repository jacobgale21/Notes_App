import type { Section } from "../../../data/placeholder";
export default function Inspector({ section }: { section: Section }) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-line bg-card">
      <header className="border-b border-line px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Section
        </p>
        <h2 className="mt-1 font-sans text-2xl leading-tight text-ink">
          {section.heading}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {section.subsections.map((subsection) => (
          <section key={subsection.heading} className="mb-6 last:mb-0">
            <h3 className="mb-2 text-sm font-medium text-accent">
              {subsection.heading}
            </h3>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-ink">
              {subsection.bullets.map((bullet) => (
                <li key={bullet.text}>
                  {bullet.text}
                  {bullet.relatedSectionIds?.length ? (
                    <span className="mt-1 flex flex-wrap gap-1">
                      {bullet.relatedSectionIds.map((id) => (
                        <span
                          key={id}
                          className="rounded-full bg-paper px-2 py-0.5 text-xs text-muted"
                        >
                          {id}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
