import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme-context";
import { LS_SITE_THEME_KEY } from "../lib/constants";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(LS_SITE_THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * Theme = the visitor's explicit choice (localStorage) or, until they choose,
 * their OS preference. The inline script in index.html applies the same logic
 * before first paint to avoid a light→dark flash.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Follow OS changes only while the visitor hasn't picked a theme themselves.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => {
      if (!getStoredTheme()) setTheme(getSystemTheme());
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(LS_SITE_THEME_KEY, next);
      } catch {
        // ignore storage errors (private mode etc.)
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
