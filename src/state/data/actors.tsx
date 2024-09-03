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
  },
  { messageGroupId: string }
>(async ({ input: { messageGroupId } }) => {
  const { data, error } = await supabase
    .from("message_group")
    .select("*, message(*), group_member(*)")
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
