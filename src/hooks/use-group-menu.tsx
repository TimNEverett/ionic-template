import { appLogicActor } from "@/state";
import { useSelector } from "@xstate/react";
import { useDataActor } from "./use-data-actor-logic";

export const useGroupMenu = () => {
  const appState = useSelector(appLogicActor, (state) => state);
  const { state: dataState, actor: dataActor } = useDataActor();
  return {
    isGroupMenuOpen: appState.matches({
      AUTHENTICATED: { HOME: { GROUP_MENU: "OPEN" } },
    }),

    openGroupMenu: () => {
      appLogicActor.send({ type: "open_group_menu" });
    },
    closeGroupMenu: () => {
      appLogicActor.send({ type: "close_group_menu" });
    },
    isSelectingGroupOpen: appState.matches({
      AUTHENTICATED: { HOME: { GROUP_MENU: { OPEN: "SELECTING_GROUP" } } },
    }),
    openSelectGroup: () => {
      appLogicActor.send({ type: "open_select_group" });
    },
    selectGroup: (groupId: string) => {
      dataActor.send({
        type: "message_group_selected",
        messageGroupId: groupId,
      });
    },
  };
};
