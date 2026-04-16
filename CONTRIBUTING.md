# Contributing to TOTP Manager

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Install [Rust](https://rustup.rs/)
2. Install the Tauri CLI: `cargo install tauri-cli --version "^2"`
3. Clone this repository
4. Run `cargo tauri dev` to start the app in development mode

## Submitting Changes

1. Fork the repository and create a feature branch
2. Make your changes
3. Ensure your code passes linting:
   ```bash
   cargo fmt --manifest-path src-tauri/Cargo.toml
   cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
   ```
4. Open a pull request with a clear description of the change
