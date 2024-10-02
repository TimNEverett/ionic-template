import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Users,
  UserPlus,
  Edit,
  LogOut,
  ArrowRightLeft,
} from "lucide-react";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { IonPage, useIonRouter } from "@ionic/react";
import { useUser } from "@/hooks/use-user";

export const MainGroupMenu = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const user = useUser();
  const groupName = selectedMessageGroup?.name || "Group Settings";
  const router = useIonRouter();

  return (
    <IonPage>
      <div className="flex flex-col h-full ">
        {/* Header */}
        <div className="flex items-center p-4  shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => router.goBack()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">{groupName}</h1>
        </div>

        {/* Menu Options */}
        <div className="flex-1 p-4">
          <Button
            className="w-full justify-start text-left mb-2"
            variant="ghost"
            onClick={() => router.push("/group-menu/switch-group")}
          >
            <ArrowRightLeft className="mr-2 h-5 w-5" />
            Switch Group
          </Button>
          <Separator className="my-4" />
          <Button
            className="w-full justify-start text-left mb-2"
            variant="ghost"
            onClick={() => router.push("/group-menu/edit-members")}
          >
            <Users className="mr-2 h-5 w-5" />
            Edit Members
          </Button>
          <Separator className="my-4" />
          <Button
            className="w-full justify-start text-left mb-2"
            variant="ghost"
            onClick={() => router.push("/group-menu/invite-members")}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Invite Members
          </Button>
          <Separator className="my-4" />
          <Button
            className="w-full justify-start text-left mb-2"
            variant="ghost"
            onClick={() => router.push("/create-group")}
          >
            <Edit className="mr-2 h-5 w-5" />
            Create New Group
          </Button>

          <Separator className="my-4" />
          {selectedMessageGroup?.creator_id === user?.id ? (
            <Button
              className="w-full justify-start text-left text-red-500"
              variant="ghost"
              onClick={() => {
                /* Add logout logic here */
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Delete Group
            </Button>
          ) : (
            <Button
              className="w-full justify-start text-left text-red-500"
              variant="ghost"
              onClick={() => {
                /* Add logout logic here */
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Leave Group
            </Button>
          )}
        </div>
      </div>
    </IonPage>
  );
};
