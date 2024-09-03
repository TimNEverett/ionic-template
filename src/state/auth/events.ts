import { User } from "@supabase/supabase-js";

export type AuthenticatedEvent = {
  type: "authenticated";
  user: User;
};
export type UnauthenticatedEvent = {
  type: "unauthenticated";
};
