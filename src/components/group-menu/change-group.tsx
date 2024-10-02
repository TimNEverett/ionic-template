import React from "react";
import { IonPage, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import { useMessageGroups } from "@/hooks/use-message-groups";

export const ChangeGroup: React.FC = () => {
  const router = useIonRouter();
  const { messageGroups, selectedMessageGroup, selectMessageGroup } =
    useMessageGroups();

  const handleGroupSelection = (groupId: string) => {
    selectMessageGroup(groupId);
    router.push("/home/chat");
  };

  return (
    <IonPage>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => router.goBack()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">Change Group</h1>
        </div>

        {/* Group List */}
        <div className="flex-1 p-4">
          {messageGroups.map((group) => (
            <Button
              key={group.id}
              className="w-full justify-between text-left mb-2"
              variant="ghost"
              onClick={() => handleGroupSelection(group.id)}
            >
              <span>{group.name}</span>
              {selectedMessageGroup?.id === group.id && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </IonPage>
  );
};
