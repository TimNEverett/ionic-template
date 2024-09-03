import { UseIonRouterResult } from "@ionic/react";

export type SetRouterEvent = {
  type: "set_router";
  router: UseIonRouterResult;
};
export type GoToSignInPageEvent = {
  type: "go_to_sign_in_page";
};
export type GoToSignUpPageEvent = {
  type: "go_to_sign_up_page";
};
export type GoToForgotPasswordPageEvent = {
  type: "go_to_forgot_password_page";
};
export type GoToChatTabEvent = {
  type: "go_to_chat_tab";
};
export type GoToOtherTabEvent = {
  type: "go_to_other_tab";
};
export type AuthenticatedEvent = {
  type: "authenticated";
};
export type UnauthenticatedEvent = {
  type: "unauthenticated";
};
export type OpenGroupMenuEvent = {
  type: "open_group_menu";
};
export type CloseGroupMenuEvent = {
  type: "close_group_menu";
};
export type GoToCreateMessageGroupEvent = {
  type: "go_to_create_message_group_page";
};
export type OpenSelectGroupEvent = {
  type: "open_select_group";
};
