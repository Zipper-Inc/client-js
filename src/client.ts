// deno-lint-ignore-file no-explicit-any
import type {
  ApiResponse,
  AppletOptions,
  Inputs,
  Output,
  ZipperRunClient,
} from './types.ts';
import { __VERSION__, LOG_PREFIX } from './constants.ts';
import { getBaseUrlFromIndentifier } from './url.ts';

class Applet implements ZipperRunClient {
  private baseUrl: URL;
  private isDebugMode: boolean;
  private token: string | undefined;

  constructor(indentifier: string, options?: AppletOptions) {
    this.baseUrl = getBaseUrlFromIndentifier(
      indentifier,
      options?.overrideHost,
    );
    this.isDebugMode = !!options?.debug;
    if (options?.token) this.token = options.token;

    this.debug('Applet.constructor', {
      indentifier,
      baseUrl: this.baseUrl,
      options: { ...options, token: options?.token ? '*****' : undefined },
    });
  }

  private debug(...args: any) {
    if (this.isDebugMode) console.log(`${LOG_PREFIX} DEBUG`, ...args);
  }

  get url() {
    return this.baseUrl.toString();
  }

  /**
   * Runs the applet at a given path with given inputs
   */
  async run<I extends Inputs = Inputs, O extends Output = any>(
    pathOrInputs?: string | I,
    maybeInputs?: I,
  ) {
    const firstArgIsPath = !!(pathOrInputs && typeof pathOrInputs === 'string');
    const path = firstArgIsPath ? pathOrInputs : 'main.ts';
    const inputs = maybeInputs ? maybeInputs : (pathOrInputs as I);

    this.debug('Applet.run', {
      path,
      inputs,
    });

    const runUrl = new URL(this.url);
    runUrl.pathname = [path, 'api'].join('/');

    let body = '{}';
    if (inputs) {
      try {
        body = JSON.stringify(inputs);
      } catch (_e) {
        throw new Error(`${LOG_PREFIX} Applet inputs could not be serialized`);
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Zipper-Client-Version': __VERSION__,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    this.debug('Applet.run fetch', {
      runUrl,
      headers: {
        ...headers,
        Authorization: headers.Authorization ? '******' : undefined,
      },
      body,
    });

    const response = await fetch(runUrl, {
      method: 'POST',
      headers,
      body,
    })
      .then((r) => r.json())
      .catch((e) => ({
        ok: false,
        error: [
          'Applet could not complete fetch',
          e?.toString() || 'Unknown error',
        ].join(' -- '),
      }));

    const { ok, data, error } = response as ApiResponse<O>;

    if (!ok) {
      this.debug('Applet.run not ok', {
        data,
        error,
        path,
        inputs,
        body,
      });

      throw new Error(
        `${LOG_PREFIX} Response was not ok | ${error || 'Unknown error'}`,
      );
    }

    this.debug('Applet.run ok', { ok, data });
    return data;
  }

  /**
   * Chain syntax to run the applet a given path
   */
  path<I extends Inputs = Inputs, O extends Output = any>(
    path: string,
  ): ZipperRunClient<I, O> {
    this.debug('Applet.path', { path });
    return {
      url: [this.baseUrl + path].join('/'),
      run: (inputs: unknown) => this.run(path, inputs as I),
    };
  }
}

/**
 * Create an Applet instance with the Zipper Client
 * @param identifier - The applet's *.zipper.run name or the entire zipper.run url
 * @param options - Options of how to interact with this applet
 */
export const initApplet = (identifier: string, options?: AppletOptions) =>
  new Applet(identifier, options);
