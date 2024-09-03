import { appLogicActor } from "@/state";
import { useSelector } from "@xstate/react";

export const useAppActor = () => {
  const appContext = useSelector(appLogicActor, (state) => state.context);
  const appState = useSelector(appLogicActor, (state) => state);
  return {
    actor: appLogicActor,
    context: appContext,
    state: appState,
  };
};
