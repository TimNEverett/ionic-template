import { useAppActor } from "@/hooks/use-app-actor-logic";
import { useNav } from "@/hooks/use-nav";
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
    switch (location.pathname) {
      case "/auth/sign-in":
        trackNav({ type: "go_to_sign_in_page" });
        break;
      case "/auth/sign-up":
        trackNav({ type: "go_to_sign_up_page" });
        break;
      case "/auth/forgot-password":
        trackNav({ type: "go_to_forgot_password_page" });
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
  }, [location]);
  return null;
};
