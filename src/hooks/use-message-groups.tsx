import { useDataActor } from "./use-data-actor-logic";

export const useMessageGroups = () => {
  const { context, actor } = useDataActor();
  const selectedMessageGroup = context?.selectedGroupId
    ? context.messageGroups[context.selectedGroupId]
    : null;
  const messages =
    context?.selectedGroupId !== null
      ? context.messages[context.selectedGroupId]
      : {};
  const selectedGroupMessages = Object.values(messages ?? {});
  return {
    messageGroups: Object.values(context.messageGroups).sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
    selectedMessageGroup,
    selectedGroupMessages,
    createGroup: (groupName: string) =>
      actor.send({
        type: "create_message_group",
        groupName,
      }),
    sendMessage: (content: string) =>
      actor.send({
        type: "send_message",
        content,
      }),
  };
};
