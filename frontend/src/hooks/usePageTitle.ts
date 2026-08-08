import { useEffect } from "react";

const SITE_NAME = "Tripime";
const DEFAULT_DESCRIPTION =
  "Tripime helps you search and book domestic flights and curated holiday packages, with transparent pricing and real human support by call or WhatsApp.";

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Sets a per-page `<title>` and meta description, restoring the previous
 * values on unmount so navigating between pages doesn't leak stale titles.
 */
export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;

    document.title = `${title} | ${SITE_NAME}`;
    setMetaDescription(description ?? DEFAULT_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== undefined) {
        setMetaDescription(previousDescription);
      }
    };
  }, [title, description]);
}
