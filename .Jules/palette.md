## 2024-06-10 - [Adding Playwright for static UI verification]
**Learning:** This repository has no package.json, linting, or tests. Verification requires manually scaffolding Playwright to test `file://` URLs since there is no local server, and requires adding `node_modules` to `.gitignore`.
**Action:** Before running tests, initialize playwright via pnpm and ensure package artifacts are removed before submitting.
