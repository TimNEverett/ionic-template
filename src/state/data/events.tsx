import { Tables } from "@/lib/supabase/database.types";

export type CreateMessageGroupEvent = {
  type: "create_message_group";
  groupName: string;
};

export type MessageGroupSelectedEvent = {
  type: "message_group_selected";
  messageGroupId: string;
};

export type MessageGroupCreatedEvent = {
  type: "message_group_created";
};

export type NewMessageEvent = {
  type: "new_message";
  message: Tables<"message">;
  groupId: string;
};

export type NoMessageGroupEvent = {
  type: "no_message_group";
};
export type SendMessageEvent = {
  type: "send_message";
  content: string;
};

export type UpdateMemberNicknameEvent = {
  type: "update_member_nickname";
  groupMemberId: string;
  nickname: string;
};

export type SendInviteEvent = {
  type: "send_invite";
  email: string;
  expirationDays: number;
};

export type InvokeTestFnEvent = {
  type: "invoke_test_fn";
};
