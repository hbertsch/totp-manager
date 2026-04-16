# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in TOTP Manager, please report it
responsibly by emailing **mail@henningbertsch.com**. Do not open a public
GitHub issue for security vulnerabilities.

You can expect an initial response within 7 days. Once the issue is confirmed,
a fix will be prioritized and released as soon as possible.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | Yes       |
| < 2.0   | No (legacy Electron version) |

## Security Model

TOTP Manager is a local-only desktop application. It does **not** communicate
with any remote server.

### Secret storage

Secret keys are stored in the Tauri webview's `localStorage` as **plain text**.
There is no encryption at rest. This is a deliberate trade-off for simplicity
and is comparable to how browser-based authenticator extensions work.

### Content Security Policy

The app enforces a strict CSP that only allows scripts and styles loaded from
the app bundle (`'self'`). No inline scripts or styles are permitted, and no
external resources are loaded.

### Recommendations

- Keep your secrets JSON file in a secure location and do not commit it to
  version control.
- If you require encryption at rest or hardware-backed key storage, consider a
  dedicated authenticator app or hardware token.
