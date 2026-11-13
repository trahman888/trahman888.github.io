import type { PropsWithChildren } from "react";
import { renderRichText } from "../../lib/richTextUtils";

/** Renders a content string with the site's mini-markup (see lib/richTextUtils). */
export function RichText({ children }: PropsWithChildren<object>) {
  if (children === null || children === undefined) return null;
  return <>{renderRichText(String(children))}</>;
}
