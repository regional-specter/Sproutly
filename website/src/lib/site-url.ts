const configuredSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const embedImagePath = "/embed.jpg";

export async function resolveAbsoluteUrl(path: string): Promise<string> {
  if (configuredSiteUrl) {
    return new URL(path, configuredSiteUrl).href;
  }

  if (import.meta.env.SSR) {
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    const origin = getRequestUrl({
      xForwardedHost: true,
      xForwardedProto: true,
    }).origin;
    return new URL(path, origin).href;
  }

  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).href;
  }

  return path;
}
