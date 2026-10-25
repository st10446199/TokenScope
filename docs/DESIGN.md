# TokenScope: design notes

## Concepts demonstrated

JSON, UTF-8 and base64url decoding, authentication concepts, date boundaries, DOM manipulation and defensive input handling.

## Decisions

A compact token is split into three segments. Header and payload segments are decoded from base64url, decoded as UTF-8, parsed as JSON and required to be objects. NumericDate values represent seconds since the Unix epoch (Jones, Bradley and Sakimura, 2015). At the exact expiry time the claim is expired. At the exact nbf time its start time has been reached.

This is an inspection tool, not a validator or an authentication system. It never verifies signatures, issuer, audience, keys, permissions or revocation. Encrypted five-part tokens are unsupported. Expiry checks refresh only when Analyze is clicked and depend on the device clock, with no clock skew allowance. Duplicate JSON keys follow JSON.parse behaviour, where the last occurrence wins. The signature segment receives basic format checks only. Maximum input length is 65536 characters.

User data is rendered through textContent, not inserted as HTML. No browser storage, network calls, external dependencies or analytics are used. Export deliberately includes decoded claims, so review the output before sharing.

## Understand before presenting

Explain why decoding a token does not authenticate its owner. What is the difference between exp and nbf? Why do we use TextDecoder instead of treating decoded bytes as ASCII? Where should signature and audience validation actually happen?

Trace the sample from input through the engine to the report. Identify one test for an invalid input and one boundary test. Explain the stated limitations and one extension you would build next.

## References

Jones, M., Bradley, J. and Sakimura, N. (2015) JSON Web Token (JWT). RFC 7519. Available at: https://www.rfc-editor.org/rfc/rfc7519 (Accessed: 21 October 2026).
