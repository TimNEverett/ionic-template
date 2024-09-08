import { Button } from "@/components/ui/button";

import { dateToDateString } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MoreVertical, Plus, PlusSquare } from "lucide-react";
import { useGroupMenu } from "@/hooks/use-group-menu";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { useGroupMembers } from "@/hooks/use-group-members";
import { IonPage, useIonRouter } from "@ionic/react";

export const GroupMenu = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const { selectedGroupMembers } = useGroupMembers();
  const groupName = selectedMessageGroup?.name || "Select Group";
  const { isGroupMenuOpen, openGroupMenu, closeGroupMenu } = useGroupMenu();
  const router = useIonRouter();
  return (
    <IonPage>
      <div className="mb-4">
        <div className="relative flex justify-center items-center space-x-2 w-full">
          <Button
            className="absolute left-2"
            variant={"outline"}
            size="lg"
            onClick={() => {
              closeGroupMenu();
              router.push("/create-group");
            }}
          >
            <Plus />
          </Button>
          {groupName}
        </div>
      </div>

      <div className="text-lg">members</div>
      <Separator />
      {selectedGroupMembers.map((member) => (
        <div
          key={member.user_id}
          className="flex w-full justify-between items-center space-x-2"
        >
          <div className="truncate flex-1">
            {member.nickname || member.user_id}
          </div>
          <div className="flex w-50 space-x-1 items-center justify-end text-nowrap">
            <div>joined on</div>
            <div>{dateToDateString(new Date(member.joined_at))}</div>
            <Button variant={"ghost"} size="sm">
              <MoreVertical size="1rem" />
            </Button>
          </div>
        </div>
      ))}
    </IonPage>
  );
};
