# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## 2.0.0

Complete rewrite from Electron + Angular to Tauri 2 + Vanilla JavaScript.

### Changed
- Runtime migrated from Electron to Tauri 2
- Frontend rewritten from Angular to vanilla JavaScript (no frameworks, no npm dependencies)
- TOTP generation now uses the Web Crypto API directly in the browser
- Strict Content Security Policy — no inline scripts or styles

### Removed
- All Node.js/npm runtime dependencies
- Angular framework and build toolchain
