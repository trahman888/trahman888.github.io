import { Fragment, type ReactNode } from "react";

/*
 * Tiny markup used across the site's content strings:
 *   ![alt](url)   image
 *   [label](url)  link (external URLs open in a new tab)
 *   *text*        bold
 * The same patterns drive rendering (…ify), generating (make…Text) and stripping (clear…).
 */
const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const BOLD_RE = /\*([^*]+)\*/g;

export const LINK_CLASS =
  "text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors";
export const IMAGE_CLASS = "my-4 max-h-96 object-contain";
export const BOLD_CLASS = "font-bold text-slate-900";

export function isExternal(url: string) {
  return (
    /^https?:\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:")
  );
}

/**
 * Splits `text` on every match of `pattern`: matches are rendered with `render`,
 * the text between them is kept as plain strings so later passes can process it.
 * `matchAll` iterates a copy of the regex, so the shared global patterns never
 * carry `lastIndex` state between calls.
 */
function tokenize(
  text: string,
  pattern: RegExp,
  render: (groups: string[], key: number) => ReactNode
): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    parts.push(render(match.slice(1), start));
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function imageify(text: string) {
  return tokenize(text, IMAGE_RE, ([alt, url], key) => (
    <img key={key} src={url} alt={alt} className={IMAGE_CLASS} />
  ));
}

export function linkify(text: string) {
  return tokenize(text, LINK_RE, ([label, url], key) => (
    <a
      key={key}
      href={url}
      className={LINK_CLASS}
      {...(isExternal(url) ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {label}
    </a>
  ));
}

export function boldify(text: string) {
  return tokenize(text, BOLD_RE, ([label], key) => (
    <strong key={key} className={BOLD_CLASS}>
      {label}
    </strong>
  ));
}

/** Order matters: images before links (a link pattern would match inside `![alt](url)`). */
const RENDER_PASSES = [imageify, linkify, boldify];

/**
 * Full pipeline used by <RichText>. Each pass only touches the plain-string parts
 * left by the previous one. The result is re-keyed by position, because keys from
 * separate pass calls can collide (e.g. two bold segments separated by a link).
 */
export function renderRichText(text: string): ReactNode[] {
  let parts: ReactNode[] = [text];
  for (const pass of RENDER_PASSES) {
    parts = parts.flatMap((part) => (typeof part === "string" ? pass(part) : part));
  }
  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

export function makeBoldText(str: string) {
  return `*${str}*`;
}

export function makeLinkText(label: string, url: string) {
  return `[${label}](${url})`;
}

export function makeImageText(alt: string, url: string) {
  return `![${alt}](${url})`;
}

/** Strip link markup, keeping the label. */
export function clearTextLinks(str: string) {
  return str.replace(LINK_RE, "$1");
}

/** Strip bold markup, keeping the text. */
export function clearTextBold(str: string) {
  return str.replace(BOLD_RE, "$1");
}

/** Strip image markup, keeping the alt text. */
export function clearTextImages(str: string) {
  return str.replace(IMAGE_RE, "$1");
}

/** Strip all markup → plain text (e.g. for alt/title attributes). Images go first, as in rendering. */
export function clearRich(str: string) {
  return clearTextLinks(clearTextBold(clearTextImages(str)));
}
