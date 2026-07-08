import { createIsomorphicFn } from "@tanstack/react-start";

const configuredSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const embedImagePath = "/embed.jpg";

function fromConfiguredSiteUrl(path: string): string | undefined {
  if (!configuredSiteUrl) return undefined;
  return new URL(path, configuredSiteUrl).href;
}

export const resolveAbsoluteUrl = createIsomorphicFn()
  .server(async (path: string) => {
    const configured = fromConfiguredSiteUrl(path);
    if (configured) return configured;

    const { getRequestUrl } = await import("@tanstack/react-start/server");
    const origin = getRequestUrl({
      xForwardedHost: true,
      xForwardedProto: true,
    }).origin;
    return new URL(path, origin).href;
  })
  .client(async (path: string) => {
    const configured = fromConfiguredSiteUrl(path);
    if (configured) return configured;

    if (typeof window !== "undefined") {
      return new URL(path, window.location.origin).href;
    }

    return path;
  });
