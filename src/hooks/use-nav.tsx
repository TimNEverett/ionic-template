import {
  GoToChatTabEvent,
  GoToCreateMessageGroupEvent,
  GoToForgotPasswordPageEvent,
  GoToOtherTabEvent,
  GoToSignInPageEvent,
  GoToSignUpPageEvent,
} from "@/state/app/events";
import { useAppActor } from "./use-app-actor-logic";

export type TrackNavEvent =
  | GoToSignInPageEvent
  | GoToSignUpPageEvent
  | GoToForgotPasswordPageEvent
  | GoToChatTabEvent
  | GoToOtherTabEvent
  | GoToCreateMessageGroupEvent;

export const useNav = () => {
  const { state, actor } = useAppActor();
  const trackNav = (event: TrackNavEvent) => {
    actor.send(event);
  };
  return {
    trackNav,
    isLoading: state.matches("LOADING"),
    isAuthenticated: state.matches("AUTHENTICATED"),
  };
};
