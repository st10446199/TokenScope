# Verification

Checked on 21 October 2026 in Linux.

All 12 core tests passed with Node.js. JavaScript files also passed syntax checks. Browser rendering and end-to-end interactions were not verified because the environment blocks browser startup.

Browser startup was blocked by the execution environment. Visual layout, keyboard interactions and downloads need manual checks locally.

## Local acceptance

1. Extract the entire ZIP.
2. Follow README.md to run the sample.
3. Confirm: Click Load example. The synthetic token declares alg none, has no signature and is expired. The display must say that the signature is not verified. Edit the input and check that stale results disappear.
4. Run the automated checks using `npm test`.
5. Inspect the report or page at a narrow browser width.
6. Enter malformed input and verify a readable error.
7. Restore the sample before taking screenshots.
