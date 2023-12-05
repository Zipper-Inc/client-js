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

Deno.test(function respectUrlWithPort() {
  const url = getBaseUrlFromIndentifier(
    'https://hello-world.localdev.me:3002',
  ).toString();
  assertEquals(url, 'https://hello-world.localdev.me:3002/');
});

Deno.test(function overrideZipperRunUrl() {
  const url = getBaseUrlFromIndentifier(
    'zipper-client-test',
    'https://localdev.me:3002'
  ).toString();
  assertEquals(url, 'https://zipper-client-test.localdev.me:3002/');
});

Deno.test(function overrideWithoutPort() {
  const url = getBaseUrlFromIndentifier(
    'zipper-client-test',
    'http://localdev.me'
  ).toString();
  assertEquals(url, 'http://zipper-client-test.localdev.me/');
});


Deno.test(function overrideFullUrl() {
  const url = getBaseUrlFromIndentifier(
    'https://zipper-client-test.zipper.run:3000/',
    'http://localdev.me:8080'
  ).toString();
  assertEquals(url, 'http://zipper-client-test.localdev.me:8080/');
});
