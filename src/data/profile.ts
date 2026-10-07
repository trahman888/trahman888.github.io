// Update this file to change personal info shown on the site.
// All other content lives in /src/data/publications.js and /src/data/news.js.

import { GOOGLE_SCHOLAR_AUTHOR_ID } from "../lib/constants";
import { PublicationCategory, type Profile } from "../lib/types";

export const profile: Profile = {
  name: "Tanzila Rahman",
  title: "Senior Research Scientist",
  url: "https://trahman888.github.io/",
  institution: "Huawei Canada",
  affiliations: [
    { role: "Senior Research Scientist", org: "Huawei Canada", current: true },
    { role: "Postdoctoral Researcher", org: "Vector Institute for AI" },
    { role: "Ph.D., Computer Science", org: "University of British Columbia" },
    { role: "M.Sc., Computer Science", org: "University of Manitoba" },
    { role: "B.Sc., Computer Science & Engineering", org: "Jahangirnagar University" },
  ],
  // Replace with a hosted photo URL when ready (e.g. /profile.jpg in /public).
  photo: "images/TanzilaRahman.webp",
  initials: "TR",
  about: [
    "I am a Senior Research Scientist at [Huawei Canada](https://www.huawei.com/ca/). Previously, I was a postdoctoral researcher at the [Vector Institute for AI](https://vectorinstitute.ai/), working with Professor [Leonid Sigal](https://www.cs.ubc.ca/~lsigal/) and Professor [Renjie Liao](https://lrjconan.github.io/).",
    "I completed my Ph.D. in Computer Science at the [University of British Columbia](https://www.cs.ubc.ca/) under the supervision of Professor [Leonid Sigal](https://www.cs.ubc.ca/~lsigal/). Before that, I obtained my M.Sc. in Computer Science from the [University of Manitoba](https://www.cs.umanitoba.ca/), advised by Professor [Yang Wang](https://www.concordia.ca/faculty/yang-wang.html). I received my B.Sc. in Computer Science and Engineering from [Jahangirnagar University](https://juniv.edu/), Bangladesh.",
    "During my Ph.D., my research focused on multimodal learning in the visual–text–audio domain with limited data (weak / self-supervision). I have also explored generative models in the multimodal space.",
  ],
  researchInterests: [
    PublicationCategory.ComputerVision,
    PublicationCategory.GenerativeAI,
    PublicationCategory.MachineLearning,
    PublicationCategory.MultimodalLearning,
    PublicationCategory.VisionLanguage,
  ],
  emails: [
    "tanzila.himu@gmail.com",
    "trahman8@cs.ubc.ca",
  ],
  links: {
    googleScholar: `https://scholar.google.com/citations?user=${GOOGLE_SCHOLAR_AUTHOR_ID}&hl=en`,
    linkedin: "https://www.linkedin.com/in/tanzila-rahman-91414a22/",
    oldSite: "https://sites.google.com/view/tanzila-rahman/home",
    cv: "tanzila_rahman_resume.pdf", // add a hosted CV PDF URL when available
  },
};
