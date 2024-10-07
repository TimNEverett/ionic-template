import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/database.types";
import { fromCallback, fromPromise } from "xstate";
import {
  MessageGroupSelectedEvent,
  NewMessageEvent,
  NoMessageGroupEvent,
} from "./events";
import { RealtimeChannel } from "@supabase/supabase-js";

export const loadMessageGroups = fromPromise(async () => {
  const { data, error } = await supabase.from("message_group").select("*");
  if (error) throw error;
  return data || [];
});

export const loadMessageGroup = fromPromise<
  {
    messageGroup: Tables<"message_group">;
    groupMembers: Tables<"group_member">[];
    messages: Tables<"message">[];
    invites: Tables<"group_invite">[];
  },
  { messageGroupId: string }
>(async ({ input: { messageGroupId } }) => {
  const { data, error } = await supabase
    .from("message_group")
    .select("*, message(*), group_member(*), group_invite(*)")
    .eq("id", messageGroupId)
    .single();
  if (error) throw error;
  return {
    messageGroup: {
      id: data.id,
      name: data.name,
      created_at: data.created_at,
      creator_id: data.creator_id,
    },
    groupMembers: data.group_member,
    messages: data.message,
    invites: data.group_invite,
  };
});

export const createMessageGroup = fromPromise<
  {
    messageGroup: Tables<"message_group">;
  },
  { groupName: string }
>(async ({ input: { groupName } }) => {
  const { data, error } = await supabase
    .from("message_group")
    .insert({ name: groupName })
    .select("*")
    .single();
  if (error) throw error;
  return {
    messageGroup: data,
  };
});

export const messageGroupListener = fromCallback<
  MessageGroupSelectedEvent | NoMessageGroupEvent,
  void,
  NewMessageEvent
>(({ sendBack, receive }) => {
  var channel: RealtimeChannel | undefined;
  receive((event) => {
    if (event.type == "message_group_selected") {
      channel = supabase
        .channel("schema-db-changes")
        .on<Tables<"message">>(
          "postgres_changes",
          {
            event: "INSERT", // Listen only to INSERTs
            schema: "public",
            table: "message",
            filter: "group_id=eq." + event.messageGroupId,
          },
          (payload) => sendBack({ type: "new_message", message: payload.new })
        )
        .subscribe();
    } else {
      channel?.unsubscribe();
    }
  });
  return () => {
    channel?.unsubscribe();
  };
});

export const sendMessage = fromPromise<
  void,
  { content: string; group_id: string }
>(async ({ input: { content, group_id } }) => {
  const { data, error } = await supabase.from("message").insert({
    content,
    group_id,
  });
  if (error) throw error;
});

export const updateMemberNickname = fromPromise<
  Tables<"group_member">,
  { groupMemberId: string; nickname: string }
>(async ({ input: { groupMemberId, nickname } }) => {
  const { data, error } = await supabase
    .from("group_member")
    .update({ nickname })
    .match({ id: groupMemberId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
});

export const cancelInvite = fromPromise<void, { inviteId: string }>(
  async ({ input: { inviteId } }) => {
    const { data, error } = await supabase
      .from("group_invite")
      .delete()
      .match({ id: inviteId })
      .select("*")
      .single();
    if (error) throw error;
  }
);

export const resendInvite = fromPromise<void, { inviteId: string }>(
  async ({ input: { inviteId } }) => {
    const { data, error } = await supabase
      .from("group_invite")
      .update({
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .match({ id: inviteId })
      .select("*")
      .single();
    if (error) throw error;
  }
);

export const sendInvite = fromPromise<
  Tables<"group_invite">,
  { email: string; expirationDays: number; groupId: string }
>(async ({ input: { email, expirationDays, groupId } }) => {
  const { data, error } = await supabase
    .from("group_invite")
    .insert({
      email,
      expires_at: new Date(
        Date.now() + expirationDays * 24 * 60 * 60 * 1000
      ).toISOString(),
      group_id: groupId,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
});

export const invokeTestFn = fromPromise<{ message: string }>(async () => {
  const { data, error } = await supabase.functions.invoke("test-fn");
  console.log({ data, error });
  if (error) throw error;
  return data;
});
