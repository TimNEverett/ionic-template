import { useDataActor } from "./use-data-actor-logic";

export const useGroupMembers = () => {
  const { context, actor } = useDataActor();
  const selectedGroupMembers =
    context.selectedGroupId && context.groupMembers[context.selectedGroupId]
      ? context.groupMembers[context.selectedGroupId]
      : {};
  const updateMemberNickname = (groupMemberId: string, nickname: string) =>
    actor.send({
      type: "update_member_nickname",
      groupMemberId,
      nickname,
    });
  return {
    selectedGroupMembers: Object.values(selectedGroupMembers),
    updateMemberNickname,
  };
};
