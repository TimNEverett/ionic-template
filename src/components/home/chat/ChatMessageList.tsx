import { useMessageGroups } from "@/hooks/use-message-groups";
import { useEffect } from "react";

export const ChatMessageList = () => {
  const { selectedGroupMessages } = useMessageGroups();
  return (
    <div className="flex flex-col">
      {selectedGroupMessages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  );
};
