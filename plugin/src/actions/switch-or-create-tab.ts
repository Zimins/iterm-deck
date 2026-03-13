import streamDeck, {
  action,
  SingletonAction,
  type DidReceiveSettingsEvent,
  type KeyDownEvent,
  type WillAppearEvent,
} from "@elgato/streamdeck";
import { exec, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type SwitchOrCreateTabSettings = {
  tabName?: string;
  profileName?: string;
  command?: string;
};

@action({ UUID: "dev.lightsoft.iterm-deck.open-or-use" })
export class SwitchOrCreateTabAction extends SingletonAction<SwitchOrCreateTabSettings> {
  override async onWillAppear(ev: WillAppearEvent<SwitchOrCreateTabSettings>): Promise<void> {
    await this.updateDisplay(ev.action, ev.payload.settings);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<SwitchOrCreateTabSettings>): Promise<void> {
    await this.updateDisplay(ev.action, ev.payload.settings);
  }

  private async updateDisplay(
    action: WillAppearEvent<SwitchOrCreateTabSettings>["action"],
    settings: SwitchOrCreateTabSettings,
  ): Promise<void> {
    const { tabName } = settings;
    if (!tabName) {
      await action.setTitle("Set Tab\nName");
      return;
    }
    await action.setTitle(tabName);
  }

  override onKeyDown(ev: KeyDownEvent<SwitchOrCreateTabSettings>): void {
    const { tabName, profileName, command } = ev.payload.settings;

    if (!tabName) {
      ev.action.showAlert();
      streamDeck.logger.warn("No tab name configured");
      return;
    }

    const python3 = "/opt/homebrew/bin/python3";
    exec(`${python3} -c 'import iterm2'`, async (error: Error | null) => {
      if (error) {
        await ev.action.showAlert();
        await ev.action.setTitle("brew install\niterm2");
        streamDeck.logger.error("iterm2 Python package not installed");
        return;
      }

      const scriptPath = path.join(__dirname, "../scripts/iterm_switch_tab.py");
      const args = [scriptPath, tabName];
      if (profileName) args.push(profileName);
      else args.push("");
      if (command) args.push(command);

      const child = spawn(python3, args);

      child.stderr.on("data", (data: Buffer) => {
        streamDeck.logger.error(`iterm script error: ${data.toString()}`);
      });

      child.on("close", async (code: number) => {
        if (code !== 0) {
          await ev.action.showAlert();
          streamDeck.logger.error(`iterm script exited with code ${code}`);
        }
      });
    });
  }
}
