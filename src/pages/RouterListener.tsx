import { useAppActor } from "@/hooks/use-app-actor-logic";
import { useNav } from "@/hooks/use-nav";
import { supabase } from "@/lib/supabase/client";
import { useIonRouter } from "@ionic/react";
import { useEffect } from "react";
import { useLocation } from "react-router";

export const RouterListener = () => {
  const location = useLocation();
  const { trackNav } = useNav();
  const router = useIonRouter();
  const { actor: appActor } = useAppActor();

  useEffect(() => {
    appActor.send({ type: "set_router", router });
  }, []);

  useEffect(() => {
    const effect = async (pathname: string) => {
      switch (pathname) {
        case "/auth/sign-in":
          trackNav({ type: "go_to_sign_in_page" });
          break;
        case "/auth/confirm":
          trackNav({ type: "confirming_auth" });
          const token = router.routeInfo.params?.token_hash;
          if (!token || typeof token != "string")
            appActor.send({ type: "unauthenticated" });
          else {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: "magiclink",
            });
            if (error) appActor.send({ type: "unauthenticated" });
          }
          break;
        case "/":
        case "/home":
        case "/home/chat":
          trackNav({ type: "go_to_chat_tab" });
          break;
        case "/home/other":
          trackNav({ type: "go_to_other_tab" });
          break;
        case "/create-group":
          trackNav({ type: "go_to_create_message_group_page" });
          break;
      }
    };
    effect(location.pathname);
  }, [location]);
  return null;
};
