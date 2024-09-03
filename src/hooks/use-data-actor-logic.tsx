import { appLogicActor } from "@/state";
import { dataLogic } from "@/state/data/logic";
import { useSelector } from "@xstate/react";
import { ActorRefFromLogic } from "xstate";

export const useDataActor = () => {
  const dataActor: ActorRefFromLogic<typeof dataLogic> =
    appLogicActor.system.get("data");
  if (!dataActor) throw new Error("dataActor not found");
  const dataContext = useSelector(dataActor, (state) => state.context);
  const dataState = useSelector(dataActor, (state) => state);
  return {
    actor: dataActor,
    context: dataContext,
    state: dataState,
  };
};
