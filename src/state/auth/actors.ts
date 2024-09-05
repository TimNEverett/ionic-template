import { supabase } from "@/lib/supabase/client";
import { AnyEventObject, fromCallback, fromPromise } from "xstate";
import { AuthenticatedEvent, UnauthenticatedEvent } from "./events";

export const authListener = fromCallback<
  AnyEventObject,
  void,
  AuthenticatedEvent | UnauthenticatedEvent
>(({ sendBack }) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log({ event, session });
    switch (event) {
      case "INITIAL_SESSION":
        if (session) {
          sendBack({
            type: "authenticated",
            user: session.user,
          });
        } else {
          sendBack({
            type: "unauthenticated",
          });
        }
        break;
      case "SIGNED_IN":
        sendBack({
          type: "authenticated",
          user: session!.user,
        });
        break;
      case "SIGNED_OUT":
        sendBack({
          type: "unauthenticated",
        });
        break;
    }
  });

  return () => {
    subscription.unsubscribe();
  };
});
