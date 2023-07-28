import { DEFAULT_ZIPPER_DOT_RUN_HOST } from './constants.ts';

export function getBaseUrlFromIndentifier(
  identifier: string,
  overrideHost?: string,
) {
  let url;

  // If the identifier is a URL, we have what we need
  // Note: If the URL is not a zipper.run applet, it will def fail
  try {
    // Remove anything that looks like a port temporarily since it confuses the URL parser
    url = new URL(identifier.replace(/:[0-9]+$/, ``));
  } catch (_e) {
    // If it looks like a host, add a protocol, other let's assume it's a slug
    url = /\.|:/.test(identifier)
      ? new URL(`https://${identifier}`)
      : new URL(`https://${identifier}.${DEFAULT_ZIPPER_DOT_RUN_HOST}`);
  }

  if (overrideHost) url.host = overrideHost;

  return new URL(url.origin);
}
