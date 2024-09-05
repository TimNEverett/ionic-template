import { useMessageGroups } from "@/hooks/use-message-groups";
import { ChatMessage } from "@/components/home/chat/ChatMessage";
import { useUser } from "@/hooks/use-user";

export const ChatMessageList = () => {
  const { selectedGroupMessages } = useMessageGroups();
  const user = useUser();
  console.log({ user });
  return (
    <div className="flex flex-col space-y-2">
      {selectedGroupMessages.map((message) => (
        <ChatMessage key={message.id} message={message} currentUser={user} />
      ))}
    </div>
  );
};
