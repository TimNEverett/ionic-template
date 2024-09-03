import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { dateToDateString } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { MoreVertical, Plus, PlusSquare } from "lucide-react";
import { useGroupMenu } from "@/hooks/use-group-menu";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { useGroupMembers } from "@/hooks/use-group-members";
import { useIonRouter } from "@ionic/react";

export const GroupMenu = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const { selectedGroupMembers } = useGroupMembers();
  const groupName = selectedMessageGroup?.name || "Select Group";
  const { isGroupMenuOpen, openGroupMenu, closeGroupMenu } = useGroupMenu();
  const router = useIonRouter();
  return (
    <Sheet
      open={isGroupMenuOpen}
      onOpenChange={(open) => (open ? openGroupMenu() : closeGroupMenu())}
    >
      <SheetTrigger asChild>
        <Button>{groupName}</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="min-h-[50vh]">
        <SheetHeader className="mb-4">
          <SheetTitle>
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
          </SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
};
