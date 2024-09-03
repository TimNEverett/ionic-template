import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { Send } from "lucide-react";
import { useState } from "react";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessageGroups();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    sendMessage(message);
    setMessage("");
  };
  return (
    <form onSubmit={onSubmit} className="flex space-x-2 p-2">
      <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button type="submit">
        <Send />
      </Button>
    </form>
  );
};
