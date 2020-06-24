# nahan-cookies

Cookies middleware for nahan

[![Build Status][travis-ci-image]][travis-ci-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[travis-ci-image]: https://travis-ci.org/LabMemNo003/nahan-cookies.svg?branch=master
[travis-ci-url]: https://travis-ci.org/LabMemNo003/nahan-cookies
[coveralls-image]: https://coveralls.io/repos/github/LabMemNo003/nahan-cookies/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/LabMemNo003/nahan-cookies?branch=master

## Reference

https://tools.ietf.org/html/rfc6265
https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-05

## Other

Due to the following code in `node-v12.18.0/lib/_http_outgoing.js`, when setting multiple `Set-cookie` headers for http response, the available type of `value` parameter of `response.setHeader(name, value)` is restricted to `Array`. Passing an `iterable` or `generator` typed `value` parameter will give a unexpected header.

``` javascript
function processHeader(self, state, key, value, validate) {
  if (validate)
    validateHeaderName(key);
  if (ArrayIsArray(value)) {
    if (value.length < 2 || !isCookieField(key)) {
      // Retain for(;;) loop for performance reasons
      // Refs: https://github.com/nodejs/node/pull/30958
      for (let i = 0; i < value.length; i++)
        storeHeader(self, state, key, value[i], validate);
      return;
    }
    value = value.join('; ');
  }
  storeHeader(self, state, key, value, validate);
}
```
