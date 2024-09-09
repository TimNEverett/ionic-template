import { useDataActor } from "./use-data-actor-logic";

export const useGroupInvites = () => {
  const { context, actor } = useDataActor();
  const invites =
    context.selectedGroupId !== null
      ? context.groupInvites[context.selectedGroupId]
      : {};

  const sendInvite = async (email: string, expirationDays: number) => {
    actor.send({
      type: "send_invite",
      email,
      expirationDays,
    });
  };

  const resendInvite = async (inviteId: string) => {};

  const cancelInvite = async (inviteId: string) => {};

  return {
    groupInvites: Object.values(invites || {}),
    sendInvite,
    resendInvite,
    cancelInvite,
  };
};
