import { authorsLinks, profile, publications } from "../data";
import { makeBoldText, makeLinkText } from "./richTextUtils";
import type { Publication } from "./types";

const VITE_SHOW_PUBLICATION_PAGE = import.meta.env.VITE_SHOW_PUBLICATION_PAGE || 'false';

const heroName = profile.name;

export function setHeroName(str: string) {
  const re = new RegExp(`(${heroName})`, "gi");
  return str.replace(re, makeBoldText("$1"));
}

export function setAuthorLinks(str: string) {
  const parts = [];
  let lastIndex = 0;
  const LINK_RE = new RegExp(
    `(${Object.keys(authorsLinks).join("|")})`,
    "gi"
  );
  let match;
  while ((match = LINK_RE.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index));
    }
    const [name] = match;
    const url = authorsLinks[name];
    if (url) {
      parts.push(makeLinkText(name, url));
    } else {
      parts.push(name);
    }

    lastIndex = match.index + name.length;
  }
  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }
  return parts.join("");
}

// make bold heroname in authors string, if present
export function formatAuthors(authors: string) {
  return setHeroName(setAuthorLinks(authors));
}

export const getPublicationById = (publicationId: string): Publication | null => {
  const publication = publications.find((pub) => pub.id === publicationId) || null;
  return publication;
};

export const getFirstAuthor = (publication: Publication | null) => {
  return publication?.authors.split(",")[0].trim() || "";
};

export const isFirstAuthor = (publication: Publication | null) => {
  const firstAuthor = getFirstAuthor(publication);
  return firstAuthor.toLowerCase() === profile.name.toLowerCase();
};

export const isAllowPublicationPage = () => VITE_SHOW_PUBLICATION_PAGE === 'true';

export const getPublicationContent = (publicationId: string) => {
  const publication = getPublicationById(publicationId);
  const hasFirstAuthor = isFirstAuthor(publication);
  if (!hasFirstAuthor) {
    console.warn(`Warning: You are not the first author of this publication (first author is "${getFirstAuthor(publication)}"). Publication page content will only be shown for publications where you are the first author.`);
    return null;
  }
  return publication?.pageContent && isAllowPublicationPage() ? publication : null;
};

/** True when `publication` has a detail page (same rules as getPublicationContent, without the warning). */
export const hasPublicationPage = (publication: Publication | null) =>
  !!publication?.pageContent && isAllowPublicationPage() && isFirstAuthor(publication);

/**
 * Previous / next publications that have a detail page, in list order
 * (publications.ts is newest-first, so "previous" is newer and "next" is older).
 */
export const getAdjacentPublicationPages = (publicationId: string) => {
  const pages = publications.filter(hasPublicationPage);
  const index = pages.findIndex((pub) => pub.id === publicationId);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: pages[index - 1] ?? null,
    next: pages[index + 1] ?? null,
  };
};

//get publications where has first author is heroname, and return their page content
export const getFirstAuthorPublications = () => {
  return publications.filter((pub) => isFirstAuthor(pub));
};