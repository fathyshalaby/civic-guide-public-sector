# Contributing to CIVIC / GUIDE

## Local setup

```bash
npm install
npm run dev
```

Keep citizen-facing answers source-backed. Add or update workflows in
`functions/_lib/knowledge.js` and add a test for every new matching rule.

## Before opening a pull request

```bash
npm run check
npm test
```

Do not commit `.dev.vars`, API keys, citizen text, or real service credentials.
