import { Tables } from "@/lib/supabase/database.types";
import { assign, enqueueActions, sendParent, sendTo, setup } from "xstate";
import { GoToCreateMessageGroupEvent } from "../app/events";
import {
  CreateMessageGroupEvent,
  MessageGroupCreatedEvent,
  MessageGroupSelectedEvent,
  NewMessageEvent,
  SendMessageEvent,
  UpdateMemberNicknameEvent,
} from "./events";
import {
  loadMessageGroups,
  loadMessageGroup,
  createMessageGroup,
  messageGroupListener,
  sendMessage,
  updateMemberNickname,
} from "./actors";

type DataContext = {
  messageGroups: { [groupId: string]: Tables<"message_group"> };
  selectedGroupId: string | null;
  groupMembers: {
    [groupId: string]: { [userId: string]: Tables<"group_member"> };
  };
  messages: {
    [groupId: string]: { [messageId: string]: Tables<"message"> };
  };
  groupInvites: {
    [groupId: string]: { [inviteId: string]: Tables<"group_invite"> };
  };
};

export const dataLogic = setup({
  types: {
    context: {} as DataContext,
    events: {} as
      | CreateMessageGroupEvent
      | MessageGroupSelectedEvent
      | SendMessageEvent
      | NewMessageEvent
      | UpdateMemberNicknameEvent,
    emitted: {} as
      | GoToCreateMessageGroupEvent
      | MessageGroupSelectedEvent
      | MessageGroupCreatedEvent,
  },
  actors: {
    loadMessageGroups,
    loadMessageGroup,
    createMessageGroup,
    sendMessage,
    messageGroupListener,
    updateMemberNickname,
  },
  guards: {
    hasSelectedGroup: ({ context }) =>
      context.selectedGroupId !== null &&
      context.messageGroups[context.selectedGroupId] !== undefined,
  },
}).createMachine({
  context: {
    messageGroups: {},
    selectedGroupId: null,
    messages: {},
    groupMembers: {},
    groupInvites: {},
  },
  id: "DATA",
  initial: "INITIAL",
  invoke: {
    id: "messageGroupListener",
    systemId: "messageGroupListener",
    src: "messageGroupListener",
  },
  on: {
    new_message: {
      actions: assign(({ context, event }) => {
        const message = event.message;
        if (!context.messages[message.group_id]) {
          return {
            messages: {
              ...context.messages,
              [message.group_id]: {
                [message.id]: message,
              },
            },
          };
        }
        return {
          messages: {
            ...context.messages,
            [message.group_id]: {
              ...context.messages[message.group_id],
              [message.id]: message,
            },
          },
        };
      }),
    },
  },
  states: {
    INITIAL: {
      always: [
        {
          target: "LOADING_MESSAGE_GROUPS",
        },
      ],
    },
    LOADING_MESSAGE_GROUPS: {
      invoke: {
        id: "loadMessageGroups",
        src: "loadMessageGroups",
        onDone: [
          {
            target: "LOADING_SELECTED_GROUP",
            guard: ({ event }) => event.output.length > 0,
            actions: enqueueActions(({ enqueue, context }) => {
              enqueue.assign({
                messageGroups: ({ context, event }) =>
                  event.output.reduce((acc, group) => {
                    acc[group.id] = group;
                    return acc;
                  }, context.messageGroups),
              });
              if (
                !context.selectedGroupId ||
                context.messageGroups[context.selectedGroupId] == undefined
              ) {
                enqueue.assign({
                  selectedGroupId: ({ event }) => event.output[0].id,
                });
              }
            }),
          },
          {
            target: "NO_MESSAGE_GROUPS",
          },
        ],
      },
    },
    LOADING_SELECTED_GROUP: {
      invoke: {
        id: "loadMessageGroup",
        src: "loadMessageGroup",
        input: ({ context }) => ({
          messageGroupId: context.selectedGroupId!,
        }),
        onDone: {
          target: "GROUP_SELECTED",
          actions: assign(({ context, event }) => {
            const { messageGroup, groupMembers, messages, invites } =
              event.output;
            return {
              messageGroups: {
                ...context.messageGroups,
                [messageGroup.id]: messageGroup,
              },
              groupMembers: groupMembers.reduce((acc, groupMember) => {
                acc[groupMember.group_id] = {
                  [groupMember.id]: groupMember,
                };
                return acc;
              }, context.groupMembers),
              messages: messages.reduce((acc, message) => {
                if (!acc[messageGroup.id]) acc[messageGroup.id] = {};
                acc[messageGroup.id][message.id] = message;
                return acc;
              }, context.messages),
              groupInvites: invites.reduce((acc, groupInvite) => {
                if (!acc[messageGroup.id]) acc[messageGroup.id] = {};
                acc[messageGroup.id][groupInvite.id] = groupInvite;
                return acc;
              }, context.groupInvites),
            };
          }),
        },
      },
    },
    GROUP_SELECTED: {
      entry: [
        sendParent({
          type: "message_group_selected",
        }),
        sendTo(
          ({ system }) => system.get("messageGroupListener"),
          ({ context }) => ({
            type: "message_group_selected",
            messageGroupId: context.selectedGroupId,
          })
        ),
      ],
      on: {
        create_message_group: {
          target: "CREATING_MESSAGE_GROUP",
        },
        message_group_selected: {
          target: "LOADING_SELECTED_GROUP",
          actions: assign(({ event }) => {
            return {
              selectedGroupId: event.messageGroupId,
            };
          }),
        },
      },
      initial: "READY",
      states: {
        READY: {
          on: {
            send_message: {
              target: "SENDING_MESSAGE",
            },
            update_member_nickname: {
              target: "UPDATE_MEMBER_NICKNAME",
            },
          },
        },
        SENDING_MESSAGE: {
          invoke: {
            id: "sendMessage",
            src: "sendMessage",
            input: ({ event, context }) => {
              return {
                content: event.type === "send_message" ? event.content : "",
                group_id: context.selectedGroupId!,
              };
            },
            onDone: {
              target: "READY",
            },
          },
        },
        UPDATE_MEMBER_NICKNAME: {
          invoke: {
            id: "updateMemberNickname",
            src: "updateMemberNickname",
            input: ({ event, context }) => {
              if (event.type !== "update_member_nickname")
                return {
                  groupMemberId: "",
                  nickname: "",
                };
              return {
                groupMemberId: event.groupMemberId,
                nickname: event.nickname,
              };
            },
            onDone: {
              target: "READY",
              actions: assign(({ context, event }) => {
                const { groupMembers } = context;
                const newGroupMember = event.output;
                const group = groupMembers[newGroupMember.group_id];
                return {
                  groupMembers: {
                    ...groupMembers,
                    [newGroupMember.group_id]: {
                      ...group,
                      [newGroupMember.id]: newGroupMember,
                    },
                  },
                };
              }),
            },
          },
        },
      },
    },
    NO_MESSAGE_GROUPS: {
      entry: [
        sendParent({
          type: "go_to_create_message_group_page",
        }),
        sendTo(({ system }) => system.get("messageGroupListener"), {
          type: "no_message_group",
        }),
      ],
      on: {
        create_message_group: {
          target: "CREATING_MESSAGE_GROUP",
        },
      },
    },
    CREATING_MESSAGE_GROUP: {
      invoke: {
        id: "createMessageGroup",
        src: "createMessageGroup",
        input: ({ event }) => {
          if (event.type !== "create_message_group")
            throw new Error("invalid event type");
          return {
            groupName: event.groupName,
          };
        },
        onDone: {
          target: "LOADING_SELECTED_GROUP",
          actions: [
            assign(({ context, event }) => {
              const { messageGroup } = event.output;
              return {
                messageGroups: {
                  ...context.messageGroups,
                  [messageGroup.id]: messageGroup,
                },
                selectedGroupId: messageGroup.id,
              };
            }),
            sendParent({ type: "message_group_created" }),
          ],
        },
      },
    },
  },
});
