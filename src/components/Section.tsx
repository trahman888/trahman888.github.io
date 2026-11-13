import { motion } from "framer-motion";
import type { Publication, PublicationSection } from "../lib/types";
import { RichText } from "./ui/RichText";
import { PublicationThumb } from "./PublicationThumb";

export default function Section({ publication, section, visible }: { publication: Publication; section: PublicationSection; visible: boolean }) {
  const { id, pill, title, blocks = [] } = section;

  return (
    <section id={id} className={`publication-card bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 ${visible ? 'block' : 'hidden'}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        {pill && (
          <span className="inline-block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {pill}
          </span>
        )}

        {title && <h2 className="mt-0 mb-2 text-xl tracking-tight text-slate-900">{title}</h2>}

        {blocks.map((block, idx) => {
          switch (block.type) {
            case "text":
              return (
                <p key={idx}>
                  <RichText>{block.text}</RichText>
                </p>
              );

            case "list":
              return (
                <ul key={idx}>
                  {(block.items || []).map((item, i) => (
                    <li key={i}><RichText>{item}</RichText></li>
                  ))}
                </ul>
              );

            case "hero-grid":
              return (
                <div key={idx} className="grid grid-cols-1 gap-[18px] items-center
          md:grid-cols-[1.1fr_1fr]">
                  <div>
                    {(block.left || []).map((txt, i) => (
                      <p key={i}><RichText>{txt}</RichText></p>
                    ))}
                  </div>
                  <div className="rounded-md border border-dashed border-pageBorder
          bg-[#f3f6ff] dark:bg-slate-50 p-2.5 text-[0.85rem] text-pageMuted">
                    <PublicationThumb pub={publication} idx={0} shape="landscape" />
                    {block.rightPlaceholder ||
                      "Hero illustration placeholder"}
                  </div>
                </div>
              );

            case "gallery":
              return (
                <div key={idx} className="grid gap-[10px] mt-3
          grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
                  {(block.items || []).map((it, i) => (
                    <div key={i} className="rounded-md border border-dashed border-pageBorder
            bg-[#fafafa] dark:bg-slate-50 p-2 text-[0.8rem] text-pageMuted">
                      <strong>{it.title}</strong>
                      <br />
                      <span><RichText>{it.description}</RichText></span>
                    </div>
                  ))}
                </div>
              );

            case "comparison":
              return (
                <div key={idx} className="grid gap-4 mt-3
          grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                  {(block.columns || []).map((col, i) => (
                    <div key={i} className="p-[10px] rounded-md border border-pageBorder bg-[#fafafa] dark:bg-slate-50 text-[0.9rem]">
                      <strong>{col.title}</strong>
                      <ul>
                        {(col.items || []).map((item, j) => (
                          <li key={j}><RichText>{item}</RichText></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}
      </motion.div>
    </section>
  );
}