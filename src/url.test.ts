import { assertEquals } from 'https://deno.land/std@0.167.0/testing/asserts.ts';
import { getBaseUrlFromIndentifier } from './url.ts';

Deno.test(function usesDefaultHost() {
  const url = getBaseUrlFromIndentifier('zipper-client-test').toString();
  assertEquals(url, 'https://zipper-client-test.zipper.run/');
});

Deno.test(function respectsHostStrings() {
  const url = getBaseUrlFromIndentifier(
    'zipper-client-test.localdev.me:3000',
  ).toString();
  assertEquals(url, 'https://zipper-client-test.localdev.me:3000/');
});

Deno.test(function respectsWholeUrl() {
  const url = getBaseUrlFromIndentifier(
    'https://applet.zipper.host/more/paths',
  ).toString();
  assertEquals(url, 'https://applet.zipper.host/');
});

Deno.test(function overridesWork() {
  const url = getBaseUrlFromIndentifier(
    'zipper-client-test.zipper.run',
    'zct.zpr.run',
  ).toString();
  assertEquals(url, 'https://zct.zpr.run/');
});
