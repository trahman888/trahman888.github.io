import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "scrollPositions";

/** Scroll position per history entry (location.key), persisted for the browser session. */
const positions: Map<string, number> = (() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, number>;
    return new Map(Object.entries(saved));
  } catch {
    return new Map();
  }
})();

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(positions)));
  } catch {
    // storage unavailable (private mode etc.): positions still work in memory
  }
}

/**
 * Scroll handling for a page:
 *  - new navigation (link click, Previous/Next) → start at the top;
 *  - Back / Forward / reload ("POP") → restore where the visitor was on that entry.
 * Runs as a layout effect with `behavior: "instant"` so it happens before paint and
 * isn't animated by the global `scroll-behavior: smooth`.
 */
export function useScrollMemory() {
  const { key } = useLocation();
  const navigationType = useNavigationType();

  // We restore manually, so stop the browser's own (SPA-unaware) restoration while mounted.
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    // "default" is the key of a freshly loaded document with no history state —
    // it is shared by unrelated visits, so never restore for it.
    const saved = navigationType === "POP" && key !== "default" ? positions.get(key) : undefined;
    window.scrollTo({ top: saved ?? 0, left: 0, behavior: "instant" });

    // Record on every scroll (not on cleanup: by then the next page's DOM is in place).
    const onScroll = () => positions.set(key, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", persist);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", persist);
      persist();
    };
  }, [key, navigationType]);
}
