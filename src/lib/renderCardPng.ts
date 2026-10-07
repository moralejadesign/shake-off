import { toBlob } from "html-to-image";

export const EXPORT_SIZE = { width: 1080, height: 1920 } as const;

function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));
  return Promise.all(
    images.map((image) =>
      image.complete
        ? image.decode().catch(() => undefined)
        : new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  );
}

// Renders the 1080x1920 export copy of the card to a PNG.
export async function renderCardPng(node: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  await waitForImages(node);

  const options = {
    ...EXPORT_SIZE,
    pixelRatio: 1,
    // next/image URLs differ only by query string, so they must not share a cache entry.
    includeQueryParams: true,
  };
  // WebKit often draws images blank on the first pass, so render once to warm it up.
  const isWebKit = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isWebKit) await toBlob(node, options);

  const blob = await toBlob(node, options);
  if (!blob) throw new Error("The card could not be rendered");
  return blob;
}
