#!/usr/bin/env bash
set -euo pipefail

source "$HOME/.cargo/env" 2>/dev/null || true

APP_NAME="TOTP Manager"
BUNDLE_PATH="src-tauri/target/release/bundle/macos/${APP_NAME}.app"
INSTALL_PATH="/Applications/${APP_NAME}.app"

echo "Building ${APP_NAME}..."
cargo tauri build

echo "Closing running instance..."
pkill -x "${APP_NAME}" 2>/dev/null || true
sleep 1

echo "Installing to /Applications..."
rm -rf "${INSTALL_PATH}"
cp -R "${BUNDLE_PATH}" "${INSTALL_PATH}"

echo "Done. ${APP_NAME} installed to ${INSTALL_PATH}"
