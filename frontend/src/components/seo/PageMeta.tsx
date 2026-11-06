import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  robots: string;
  canonical: string | null;
};

function metaForPath(pathname: string): PageMeta {
  if (pathname === "/") {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      robots: "index, follow",
      canonical: `${SITE_URL}/`,
    };
  }

  if (pathname === "/login") {
    return {
      title: "Sign in — CrewPilot",
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, nofollow",
      canonical: null,
    };
  }

  if (pathname === "/forgot-password") {
    return {
      title: "Reset your password — CrewPilot",
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, nofollow",
      canonical: null,
    };
  }

  if (pathname === "/history") {
    return {
      title: "Plan history — CrewPilot",
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, nofollow",
      canonical: null,
    };
  }

  if (pathname === "/processing") {
    return {
      title: "Building your plan — CrewPilot",
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, nofollow",
      canonical: null,
    };
  }

  if (pathname.startsWith("/results/")) {
    return {
      title: "Your plan — CrewPilot",
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, nofollow",
      canonical: null,
    };
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    robots: "noindex, nofollow",
    canonical: null,
  };
}

function setMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(href: string | null) {
  const element = document.querySelector('link[rel="canonical"]');
  if (!href) {
    element?.remove();
    return;
  }

  const link = element ?? document.createElement("link");
  link.setAttribute("rel", "canonical");
  link.setAttribute("href", href);
  if (!element) {
    document.head.appendChild(link);
  }
}

export function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaForPath(pathname);
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("robots", meta.robots);
    setCanonical(meta.canonical);
  }, [pathname]);

  return null;
}
