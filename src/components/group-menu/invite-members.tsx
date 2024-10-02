import React, { useState } from "react";
import { IonPage, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  Mail,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useGroupInvites } from "@/hooks/use-group-invites";
import { dateToDateString } from "@/lib/utils";
// import { useGroupInvites } from "@/hooks/use-group-invites"; // You'll need to create this hook

export const InviteMembers: React.FC = () => {
  const router = useIonRouter();
  const { groupInvites, sendInvite, resendInvite, cancelInvite } =
    useGroupInvites();
  const [isInviteSheetOpen, setIsInviteSheetOpen] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [expirationDays, setExpirationDays] = useState(7);

  const handleSendInvite = () => {
    if (newInviteEmail) {
      sendInvite(newInviteEmail, expirationDays);
      setIsInviteSheetOpen(false);
      setNewInviteEmail("");
      setExpirationDays(7);
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
          <h1 className="text-xl font-semibold ml-4">Invite Members</h1>
        </div>

        {/* Invite List */}
        <div className="flex-1 p-4 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Pending Invites</h2>
          {groupInvites.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending invites</p>
          ) : (
            groupInvites.map((invite) => (
              <div
                key={invite.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
              >
                <div className="flex-grow space-y-1">
                  <div className="flex items-center text-gray-800">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="font-medium">{invite.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Sent on {dateToDateString(new Date(invite.created_at))}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resendInvite(invite.id)}
                    className="flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelInvite(invite.id)}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Invite New Member Button */}
        <div className="p-4">
          <Button className="w-full" onClick={() => setIsInviteSheetOpen(true)}>
            Invite New Member
          </Button>
        </div>
      </div>

      {/* Invite Sheet */}
      <Sheet
        open={isInviteSheetOpen}
        onOpenChange={(open) => setIsInviteSheetOpen(open)}
      >
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Invite New Member</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <Input
              value={newInviteEmail}
              onChange={(e) => setNewInviteEmail(e.target.value)}
              placeholder="Enter email address"
              type="email"
            />
            <Input
              className="mt-2"
              value={expirationDays}
              onChange={(e) => setExpirationDays(parseInt(e.target.value))}
              placeholder="Expiration days"
              type="number"
              min={1}
            />
            <Button className="mt-4 w-full" onClick={handleSendInvite}>
              Send Invite
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </IonPage>
  );
};
