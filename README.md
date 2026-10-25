# TokenScope

A local JWT inspector that decodes headers and claims, explains token time claims and exports inspection results without uploads.

**Stack:** JavaScript / HTML / CSS

## Why this project

A focused portfolio project demonstrating JSON, UTF-8 and base64url decoding, authentication concepts, date boundaries, DOM manipulation and defensive input handling.

## Features

* Local decoding of three-segment compact tokens.
* UTF-8 payload support and readable JSON output.
* iat, nbf and exp interpretation against the device clock.
* Clear unverified signature status and unsecured token warnings.
* Export of decoded inspection results.

## Quick start

Extract the whole ZIP and double click `index.html` in Edge, Chrome or Firefox. There is no server or build step. Click **Load example**, then try your own input.

Click Load example. The synthetic token declares alg none, has no signature and is expired. The display must say that the signature is not verified. Edit the input and check that stale results disappear.

## Automated tests

```text
npm test
```

Expected: 12 passing checks. Node.js 18.17 or newer is needed only for tests. No npm install is needed. You can also run node --test tests/core.test.cjs.

## Design and scope

A compact token is split into three segments. Header and payload segments are decoded from base64url, decoded as UTF-8, parsed as JSON and required to be objects. NumericDate values represent seconds since the Unix epoch (Jones, Bradley and Sakimura, 2015). At the exact expiry time the claim is expired. At the exact nbf time its start time has been reached.

This is an inspection tool, not a validator or an authentication system. It never verifies signatures, issuer, audience, keys, permissions or revocation. Encrypted five-part tokens are unsupported. Expiry checks refresh only when Analyze is clicked and depend on the device clock, with no clock skew allowance. Duplicate JSON keys follow JSON.parse behaviour, where the last occurrence wins. The signature segment receives basic format checks only. Maximum input length is 65536 characters.

User data is rendered through textContent, not inserted as HTML. No browser storage, network calls, external dependencies or analytics are used. Export deliberately includes decoded claims, so review the output before sharing.

## Source guide

`src/core.js` contains the pure computation engine, usable in Node or the browser. `src/app.js` handles DOM events and results. `src/style.css` styles the responsive interface. `tests/core.test.cjs` contains regression checks.

See `docs/DESIGN.md` for discussion questions and `docs/VERIFICATION.md` for the exact checks performed.

## Data and outputs

All example data is synthetic. No account, paid service or network access is required by the app. Outputs can contain user supplied values, so inspect them before sharing. Inputs are not saved. Export downloads a JSON file through the browser.

## References

Jones, M., Bradley, J. and Sakimura, N. (2015) JSON Web Token (JWT). RFC 7519. Available at: https://www.rfc-editor.org/rfc/rfc7519 (Accessed: 21 October 2026).

## Licence

MIT. See LICENSE.
