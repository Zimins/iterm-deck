# iTerm Deck

A Stream Deck plugin for controlling iTerm2. Switch to existing tabs or create new ones with a single button press.

## Features

- **Switch to existing tabs** by name with one press
- **Create new tabs** automatically if they don't exist
- **Run commands** on new tab creation (e.g., `npm run dev`, `docker-compose up`)
- **Use iTerm2 profiles** when creating tabs
- **Persistent tab names** that survive across shell sessions

## Prerequisites

- macOS 10.15+
- [iTerm2](https://iterm2.com/)
- Stream Deck with Stream Deck software v6.5+
- Python 3 via Homebrew (`/opt/homebrew/bin/python3`)
- iterm2 Python package:
  ```bash
  pip3 install iterm2
  ```

## Installation

1. Build the plugin (see [Development](#development)) or download the release
2. Double-click the `.streamDeckPlugin` file to install, or copy the `dev.lightsoft.iterm-deck.sdPlugin` folder to:
   ```
   ~/Library/Application Support/com.elgato.StreamDeck/Plugins/
   ```
3. Restart Stream Deck software if needed

## Stream Deck Setup

1. In the Stream Deck app, find **iTerm Deck** in the actions list on the right panel
2. Drag the **"Open or Use iTerm Tab"** action onto a button
3. Configure the button settings in the Property Inspector (bottom panel):

### Settings

| Setting | Required | Description |
|---------|----------|-------------|
| **Tab Name** | Yes* | Name of the iTerm2 tab to switch to or create. Case-insensitive. |
| **Profile Name** | No | iTerm2 profile to use when creating a new tab. Uses default profile if omitted. |
| **Command** | No | Shell command to run when a new tab is created. Only runs on creation, not when switching. |

> \* If Tab Name is empty, the Stream Deck button title is used as the tab name.

### How It Works

```
Button Press
    ↓
Search for tab with matching name
    ├─ Found → Switch to that tab, bring iTerm2 to front
    └─ Not found → Create new tab
                        ├─ Apply profile (if set)
                        ├─ Run command (if set)
                        ├─ Set tab name
                        └─ Bring iTerm2 to front
```

### Example Configurations

**Dev Server Button:**
- Tab Name: `dev`
- Command: `npm run dev`

**Docker Button:**
- Tab Name: `docker`
- Command: `docker-compose up`

**SSH Button:**
- Tab Name: `prod-server`
- Profile Name: `SSH`
- Command: `ssh user@production.example.com`

**Logs Button:**
- Tab Name: `logs`
- Command: `tail -f /var/log/app.log`

## Development

### Project Structure

```
iterm-deck/
├── plugin/
│   ├── src/                              # TypeScript source
│   │   ├── plugin.ts                     # Entry point
│   │   └── actions/
│   │       └── switch-or-create-tab.ts   # Main action handler
│   ├── dev.lightsoft.iterm-deck.sdPlugin/
│   │   ├── manifest.json                 # Plugin metadata
│   │   ├── bin/plugin.js                 # Compiled output
│   │   ├── ui/switch-tab.html            # Property Inspector UI
│   │   └── scripts/iterm_switch_tab.py   # iTerm2 automation script
│   ├── package.json
│   ├── tsconfig.json
│   └── rollup.config.mjs
```

### Build

```bash
cd plugin

# Install dependencies
npm install

# Build
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Tech Stack

- **Plugin runtime:** Node.js 20 + TypeScript
- **Build:** Rollup
- **iTerm2 integration:** Python 3 + [iterm2 Python API](https://iterm2.com/python-api/)
- **Stream Deck SDK:** [@elgato/streamdeck](https://docs.elgato.com/sdk/)

## License

MIT
