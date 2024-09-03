import { appLogic } from "@/state/app/logic";
import { createActor } from "xstate";
import { createBrowserInspector } from "@statelyai/inspect";

const { inspect } = createBrowserInspector();

export const appLogicActor = createActor(appLogic, {
  inspect: inspect,
});
