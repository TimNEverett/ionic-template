import { assign, emit, setup } from "xstate";
import { authLogic } from "../auth/logic";
import {
  AuthenticatedEvent,
  CloseGroupMenuEvent,
  ConfirmingAuthEvent,
  GoToChatTabEvent,
  GoToCreateMessageGroupEvent,
  GoToOtherTabEvent,
  GoToSignInPageEvent,
  OpenGroupMenuEvent,
  OpenSelectGroupEvent,
  SetRouterEvent,
  UnauthenticatedEvent,
} from "./events";
import { dataLogic } from "../data/logic";
import {
  MessageGroupCreatedEvent,
  MessageGroupSelectedEvent,
} from "../data/events";
import { UseIonRouterResult } from "@ionic/react";

export const appLogic = setup({
  types: {
    context: {} as {
      router: UseIonRouterResult | null;
    },
    events: {} as
      | AuthenticatedEvent
      | UnauthenticatedEvent
      | GoToSignInPageEvent
      | ConfirmingAuthEvent
      | GoToChatTabEvent
      | GoToOtherTabEvent
      | OpenGroupMenuEvent
      | CloseGroupMenuEvent
      | GoToCreateMessageGroupEvent
      | MessageGroupSelectedEvent
      | MessageGroupCreatedEvent
      | SetRouterEvent
      | OpenSelectGroupEvent,
    emitted: {} as AuthenticatedEvent | UnauthenticatedEvent,
  },
  actors: {
    auth: authLogic,
    data: dataLogic,
  },
}).createMachine({
  id: "APP",
  context: {
    router: null,
  },
  invoke: {
    id: "auth",
    src: "auth",
  },
  on: {
    set_router: {
      actions: assign({
        router: ({ event }) => event.router,
      }),
    },
  },
  initial: "LOADING",
  states: {
    LOADING: {
      on: {
        authenticated: {
          target: "AUTHENTICATED",
        },
        unauthenticated: {
          target: "UNAUTHENTICATED",
        },
      },
    },
    UNAUTHENTICATED: {
      entry: emit({ type: "unauthenticated" }),
      initial: "SIGN_IN",
      on: {
        go_to_sign_in_page: {
          target: ".SIGN_IN",
        },
        confirming_auth: {
          target: ".CONFIRMING_AUTH",
        },
        authenticated: {
          target: "#APP.AUTHENTICATED",
        },
      },
      states: {
        SIGN_IN: {},
        CONFIRMING_AUTH: {},
      },
    },
    AUTHENTICATED: {
      invoke: {
        systemId: "data",
        id: "data",
        src: "data",
      },
      on: {
        unauthenticated: {
          target: "UNAUTHENTICATED",
        },
        go_to_create_message_group_page: {
          target: ".CREATE_GROUP",
        },
      },
      initial: "LOADING",
      states: {
        LOADING: {
          always: [
            {
              target: "CREATE_GROUP",
              guard: ({ context }) =>
                context.router?.routeInfo.pathname === "/create-group",
            },
          ],
          on: {
            message_group_selected: {
              target: "HOME",
            },
          },
        },
        RESET_PASSWORD: {},
        MENU: {},
        HOME: {
          type: "parallel",
          states: {
            GROUP_MENU: {
              initial: "CLOSED",
              states: {
                CLOSED: {
                  on: {
                    open_group_menu: {
                      target: "OPEN",
                    },
                  },
                },
                OPEN: {
                  on: {
                    close_group_menu: {
                      target: "CLOSED",
                    },
                  },
                  initial: "MAIN",
                  states: {
                    MAIN: {
                      on: {
                        open_select_group: {
                          target: "SELECTING_GROUP",
                        },
                      },
                    },
                    SELECTING_GROUP: {
                      on: {
                        message_group_selected: {
                          target: "MAIN",
                        },
                      },
                    },
                  },
                },
              },
            },
            TABS: {
              on: {
                go_to_chat_tab: {
                  target: ".CHAT",
                },
                go_to_other_tab: {
                  target: ".OTHER",
                },
              },
              initial: "CHAT",
              states: {
                CHAT: {},
                OTHER: {},
              },
            },
          },
        },
        CREATE_GROUP: {
          on: {
            message_group_created: {
              actions: ({ context }) => {
                context.router?.push("/home/chat");
              },
            },
            go_to_chat_tab: {
              target: "#APP.AUTHENTICATED.HOME.TABS.CHAT",
            },
          },
        },
      },
    },
  },
});
