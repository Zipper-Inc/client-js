import { DEFAULT_ZIPPER_DOT_RUN_HOST } from './constants.ts';
import { AppletOptions } from './index.ts';

export function getBaseUrlFromIndentifier(
  identifier: string,
  overrideZipperRunUrl?: AppletOptions['overrideZipperRunUrl'],
) {
  let url: URL | undefined;
  let port;

  // If the identifier is a URL, we have what we need
  // Note: If the URL is not a zipper.run applet, it will def fail
  try {
    // Remove anything that looks like a port temporarily since it confuses the URL parser
    // We'll add it back later
    const portMatch = identifier.match(/:[0-9]+$/);
    if (portMatch) {
      port = portMatch[0];
      identifier = identifier.replace(port, '');
    }

    url = new URL(identifier);
    
    // In this case, identifier is a full URL
    if (overrideZipperRunUrl) {
      const override = new URL(overrideZipperRunUrl);
      const subdomain = url.host.split('.')[0];
      const newUrl = new URL(`${override.protocol}//${subdomain}.${override.host}`);
      // Here, we gonna use the port from the override
      return newUrl
    }
    
    return new URL(`${url.origin}${port || ''}`);
  } catch (_e) {
    // Identifier is not a URL, but if it looks like a host, we can add a protocol, other let's assume it's a slug
    url = /\.|:/.test(identifier)
    ? new URL(`https://${identifier}`)
    : new URL(`https://${identifier}.${DEFAULT_ZIPPER_DOT_RUN_HOST}`);
  }

  // If we have an override, we need to use it, the identifier itself is our subdomain
  if (overrideZipperRunUrl) {
    const override = new URL(overrideZipperRunUrl);
    url = new URL(`${override.protocol}//${identifier}.${override.host}`);
    // Here, we gonna use the port from the override
    return new URL(url.origin);
  }

  return new URL(`${url.origin}${port || ''}`);
}