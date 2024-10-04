import { Loader2 } from "lucide-react";

export const LoadingView: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Loader2 className="w-16 h-16 animate-spin text-primary" />
    </div>
  );
};
