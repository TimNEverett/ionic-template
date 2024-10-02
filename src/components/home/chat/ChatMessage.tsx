import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

export const ChatMessage: React.FC<{
  message: Tables<"message">;
  currentUser: User | null;
}> = ({ message, currentUser }) => {
  const isCurrentUser = message.sender_id === currentUser?.id;
  return (
    <div
      className={cn(
        "flex flex-col",
        isCurrentUser ? "items-end" : "items-start"
      )}
    >
      <div className="max-w-[75%] bg-slate-700 p-2 rounded-xl">
        {message.content}
      </div>
      <div className={cn("max-w-[75%]", isCurrentUser && "text-end")}>
        {isCurrentUser ? "You" : message.sender_id}
        <div className="text-xs text-slate-500">
          {new Date(message.sent_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
