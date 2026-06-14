const PLACEHOLDER_HOSTS = new Set(["placehold.co", "placeholder.com", "via.placeholder.com", "dummyimage.com"]);

export function isUsableProductImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return false;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    if (PLACEHOLDER_HOSTS.has(hostname)) {
      return false;
    }

    if (hostname.endsWith("dummyjson.com") && pathname.startsWith("/image/") && parsedUrl.searchParams.has("text")) {
      return false;
    }

    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    const normalizedUrl = imageUrl.toLowerCase();
    return !(normalizedUrl.includes("dummyjson.com/image/") && normalizedUrl.includes("text="));
  }
}
