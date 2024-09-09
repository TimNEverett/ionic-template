import React, { useState } from "react";
import { IonPage, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
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
        <div className="flex-1 p-4">
          {selectedGroupMembers.map((member) => (
            <button
              key={member.id}
              className="w-full text-left mb-2 p-2 border rounded flex justify-between items-center hover:bg-gray-100 transition-colors"
              onClick={() => handleEditNickname(member)}
            >
              <span>{member.nickname || member.id}</span>
              <Edit className="h-5 w-5" />
            </button>
          ))}
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
