import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import NoticeBar from "../components/NoticeBar";
import Hero from "../components/Hero";
import About from "../components/About";
import Impact from "../components/Impact";
import Publications from "../components/Publications";
import News from "../components/News";
import Footer from "../components/Footer";
import type { PersonSchema } from "../lib/types";
import { generateSchema } from "../data";
import { getFirstAuthorPublications } from "../lib/utils";

export default function Home() {
  const schemaData = generateSchema() as PersonSchema;
  const publications = getFirstAuthorPublications();

  return (
    <>
      <Helmet>
        <link rel="canonical" href={schemaData?.url || "https://trahman888.github.io/"} />
        <meta name="description" content="Official portfolio of Tanzila Rahman, Senior Research Scientist at Huawei Canada. Expert in Computer Vision, Generative AI, and Multimodal Vision-Language Models." />
        <meta name="keywords" content={
          `${schemaData?.name || "Tanzila Rahman"}, 
          ${schemaData?.jobTitle || "Senior Research Scientist"}, 
          ${schemaData?.worksFor?.name || "Huawei Canada"}, 
          ${schemaData?.knowsAbout?.join(', ') || "Computer Vision Researcher, Generative AI, Multimodal Learning, Vision-Language Models, Vector Institute, UBC AI"}, 
          ${publications.length ? publications.map((pub) => pub.title).join(', ') : 'TriBERT, Make-A-Story'}, 
          ${schemaData?.alumniOf?.map((school) => school.name).join(', ')}`
        } />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={schemaData?.url || "https://trahman888.github.io/"} />
        <meta property="og:title" content={schemaData ? `${schemaData.name} — ${schemaData.jobTitle}` : "Tanzila Rahman — Senior Research Scientist | Generative AI"} />
        <meta property="og:description" content="Explore peer-reviewed research, ECCV/CVPR/ICLR publications, and computer vision projects by Tanzila Rahman." />
        <meta property="og:image" content={schemaData?.image || "https://trahman888.github.io/images/TanzilaRahman.webp"} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={schemaData?.url || "https://trahman888.github.io/"} />
        <meta property="twitter:title" content={schemaData ? `${schemaData.name} — ${schemaData.jobTitle}` : "Tanzila Rahman — Senior Research Scientist | Generative AI"} />
        <meta property="twitter:description" content="Senior Research Scientist researching computer vision, generative AI, and multimodal learning across vision, text, and audio." />
        <meta property="twitter:image" content={schemaData?.image || "https://trahman888.github.io/images/TanzilaRahman.webp"} />
        <title>{`${schemaData?.name || "Tanzila Rahman"} — ${schemaData?.jobTitle || "Senior Research Scientist"} | ${schemaData?.knowsAbout?.join(', ') || "Computer Vision, Generative AI"}`}</title>
        {schemaData && (
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        )}
      </Helmet>
      <div className="App min-h-screen bg-white text-slate-900 antialiased">
        <NoticeBar />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Impact />
          <Publications />
          <News />
          <Footer />
        </main>
      </div>
    </>
  );
}