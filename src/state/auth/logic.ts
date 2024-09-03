import { assign, sendParent, setup } from "xstate";
import { authListener } from "./actors";
import { User } from "@supabase/supabase-js";
import { AuthenticatedEvent, UnauthenticatedEvent } from "./events";

export const authLogic = setup({
  types: {
    context: {} as {
      user: User | null;
    },
    events: {} as AuthenticatedEvent | UnauthenticatedEvent,
    emitted: {} as AuthenticatedEvent | UnauthenticatedEvent,
  },
  actors: {
    authListener,
  },
}).createMachine({
  context: {
    user: null,
  },
  invoke: [
    {
      id: "authListener",
      src: "authListener",
    },
  ],
  initial: "LOADING",
  states: {
    LOADING: {
      on: {
        authenticated: {
          target: "AUTHENTICATED",
          actions: assign({
            user: ({ event }) => event.user,
          }),
        },
        unauthenticated: {
          target: "UNAUTHENTICATED",
        },
      },
    },
    UNAUTHENTICATED: {
      entry: sendParent({ type: "unauthenticated" }),
      on: {
        authenticated: {
          target: "AUTHENTICATED",
          actions: assign({
            user: ({ event }) => event.user,
          }),
        },
      },
    },
    AUTHENTICATED: {
      entry: sendParent(({ context }) => ({
        type: "authenticated",
        user: context.user,
      })),
      on: {
        unauthenticated: "UNAUTHENTICATED",
      },
    },
  },
});
