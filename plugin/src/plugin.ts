import streamDeck from "@elgato/streamdeck";
import { SwitchOrCreateTabAction } from "./actions/switch-or-create-tab";

streamDeck.actions.registerAction(new SwitchOrCreateTabAction());
streamDeck.connect();
