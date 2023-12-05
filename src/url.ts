import { DEFAULT_ZIPPER_DOT_RUN_HOST } from './constants.ts';

export function getBaseUrlFromIndentifier(
  identifier: string,
  overrideHost?: string,
  zipperRunUrl = DEFAULT_ZIPPER_DOT_RUN_HOST,
  preferHtps = true,
) {
  let url;

  // If the identifier is a URL, we have what we need
  // Note: If the URL is not a zipper.run applet, it will def fail
  try {
    // Remove anything that looks like a port temporarily since it confuses the URL parser
    url = new URL(identifier.replace(/:[0-9]+$/, ``));
  } catch (_e) {
    const protocol = preferHtps ? "https" : 'http';
    // If it looks like a host, add a protocol, other let's assume it's a slug
    url = /\.|:/.test(identifier)
      ? new URL(`${protocol}://${identifier}`)
      : new URL(`${protocol}://${identifier}.${zipperRunUrl}`);
  }

  if (overrideHost) url.host = overrideHost;

  return new URL(url.origin);
}
