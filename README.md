# @zipper-inc/client-js

[![portfolio](https://img.shields.io/badge/Get_started_with_Zipper-zipper.dev-000?style=for-the-badge&color=9B2FB4&labelColor=3D1353&)](https://zipper.dev/)

An easy way to interact with Zipper Applets from anywhere that supports ESM,
CommonJS, or TypeScript.

## Installation

To install into your project, use your favorite package manager to add it to
your dependencies. (You don't have to do this step if you're importing from
URL.)

```bash
$ yarn add @zipper-inc/client-js

# or

$ npm i @zipper-inc/client-js
```

And add it to your TypeScript or JavaScript files.

```typescript
// ESM
import { initApplet } from '@zipper-inc/client-js';

// CommonJS
var initApplet = require('@zipper-inc/client-js').initApplet;
```

### For Zipper, Deno, etc

Just import from URL.

```typescript
import { initApplet } from 'https://deno.land/x/zipper-client-js/mod.ts';
```

## Usage

Easily use an Applet's built-in API to interact with it as if it was a part of
your project. Inputs work just like any function on Zipper.

Use the [Crontab AI Generator](https://crontab-ai-generator.zipper.run) in an
admin panel.

```typescript
await initApplet('crontab-ai-generator').run({ text: 'once a day' });

// 0 0 * * *
```

Fork an example applet like the
[Feature Flags Example](https://feature-flags-example.zipper.run), put it behind
auth to protect your team's data, and use it your own repo.

```typescript
const ff = initApplet('acme-org-feature-flags', {
  token: ACCESS_TOKEN,
});

// get a feature flag value
const liveOnProd = await ff.path('get').run({
  name: 'flag_new_drops',
  context: 'prod',
});

// flip a value programatically
await ff.path('set').run({
  name: 'flag_new_prototype',
  context: 'dev',
  value: true,
});
```

Anything an applet can do, your app can do.

## Documentation

For more about Zipper, check out the
[official documentation here](https://zipper.dev/docs).

## Issues

Zipper is under active development, so issues are expected! It might be helpful to use the debug mode to console log verbosely so you can see whats going on. 

Just pass the `debug` option when initializing your applet to turn this one.

```
const myApp = initApplet('my-applet', { debug: true });
```

Let us know what your console output looks like when submitting an issue. PRs are also always welcome, see the next section.

## Contributing

Zipper is under active development, so contributions are always welcome.

Since this repo is written in [Deno](https://deno.land/), you must have Deno
installed.

```
curl -fsSL https://deno.land/install.sh | sh
```

Check out other ways to
[install Deno here](https://github.com/denoland/deno_install).

Once that's installed check out this repo locally, make some changes, and make sure it
passes tests and builds by running the following command.

```
deno task build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Links

Curious about Zipper? Check us out at
[https://zipper.dev](https://zipper.dev/home).

[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ZipperDev)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/zipperinc)
