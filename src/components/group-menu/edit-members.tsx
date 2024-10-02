import React, { useState } from "react";
import { IonPage, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, User } from "lucide-react";
import { useGroupMembers } from "@/hooks/use-group-members";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tables } from "@/lib/supabase/database.types";

export const EditMembers: React.FC = () => {
  const router = useIonRouter();
  const { selectedGroupMembers, updateMemberNickname } = useGroupMembers();
  const [editingUser, setEditingUser] = useState<Tables<"group_member"> | null>(
    null
  );
  const [newNickname, setNewNickname] = useState("");

  const handleEditNickname = (user: Tables<"group_member"> | null) => {
    setEditingUser(user);
    setNewNickname(user?.nickname || "");
  };

  const handleSaveNickname = () => {
    if (editingUser) {
      updateMemberNickname(editingUser.id, newNickname);
      setEditingUser(null);
    }
  };

  return (
    <IonPage>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => router.goBack()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">Edit Members</h1>
        </div>

        {/* Member List */}
        <div className="flex-1 p-4 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Group Members</h2>
          {selectedGroupMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No members in this group
            </p>
          ) : (
            selectedGroupMembers.map((member) => (
              <div
                key={member.id}
                className="bg-secondary rounded-lg shadow-md p-4 flex justify-between items-center transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className=" rounded-full p-2">
                    <User className="h-5 w-5 " />
                  </div>
                  <span className="font-medium ">
                    {member.nickname || member.id}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditNickname(member)}
                  className="flex items-center "
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      <Sheet
        open={!!editingUser}
        onOpenChange={(open) => handleEditNickname(null)}
      >
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Edit Nickname</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <Input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="Enter new nickname"
            />
            <Button className="mt-4 w-full" onClick={handleSaveNickname}>
              Save Nickname
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </IonPage>
  );
};
