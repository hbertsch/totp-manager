# TOTP Manager

`TOTP Manager` is a tool that let you manage your one time codes based on a `json` configuration file .

**The main features are:**

- **Loading** a collection of TOTP settings from file (`json`: see [example](#Example-Configuration-File))
- **Order** them by label (ascending / descending)
- **Search** for arbitrary string 
- Code is **copied to clipboard** on `left click` so you can paste it using `crtl+v` or `cmd+v`

## Latest Release

> Releases for **Linux** and **Windows** are **missing** and will be added later one (once I have time for that)

Check the [release section](https://github.com/hbertsch/totp-manager/releases) to download the latest release.

## Quick Demo

![quick_demo](resources/quick_demo.gif)

## Build

### Prerequisites

```bash
# Install Rust (if not present)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli --version "^2"
```

### Development (hot-reload)

```bash
cargo tauri dev
```

### Production build

```bash
cargo tauri build
# Output: src-tauri/target/release/bundle/macos/TOTP Manager.app
```

> **Note for macOS (unsigned build):** On first launch you may need to right-click → Open
> to bypass Gatekeeper, as the binary is not code-signed.

### Migration from the previous Electron version

The app stores its config under a different origin (`tauri://localhost` vs the old Electron origin).
After upgrading, click **Load JSON** once to re-import your secrets file — this is a one-time step.



## Example Configuration File

Use the codes provided by the TOTP setup dialogs (or extract them from the QR-Codes by scanning them) and save them in a `json`by using the following format (**example file** can be found in this repository under `resources/example-secrets.json`):

```json
[
    {
      "key": "ATDFYYP2NN6FYH3L",
      "label": "Microsoft.com"
    },
    {
      "key": "ATDFYYP2NN6FYH4L",
      "label": "GitHub.com"
    },
    {
      "key": "ATDFYYP2NN6FYH5L",
      "label": "Google.com"
    }
]
```

## Fundamentals

If you are interested in the fundamentals of how TOTP generation is working, check out [my other TOTP repository](https://github.com/hbertsch/simple-totp).
