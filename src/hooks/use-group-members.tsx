import { useDataActor } from "./use-data-actor-logic";

export const useGroupMembers = () => {
  const { context } = useDataActor();
  const selectedGroupMembers =
    context.selectedGroupId && context.groupMembers[context.selectedGroupId]
      ? context.groupMembers[context.selectedGroupId]
      : {};
  return {
    selectedGroupMembers: Object.values(selectedGroupMembers),
  };
};
