import { Route } from "react-router-dom";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { IonPage, IonRouterOutlet, useIonRouter } from "@ionic/react";
import { useUser } from "@/hooks/use-user";
import { ChangeGroup } from "./change-group";
import { MainGroupMenu } from "./main-group-menu";
import { EditMembers } from "./edit-members";
import { InviteMembers } from "./invite-members";

export const GroupMenu = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const user = useUser();
  const groupName = selectedMessageGroup?.name || "Group Settings";
  const router = useIonRouter();

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path="/group-menu">
          <MainGroupMenu />
        </Route>
        <Route exact path="/group-menu/switch-group">
          <ChangeGroup />
        </Route>
        <Route exact path="/group-menu/edit-members">
          <EditMembers />
        </Route>
        <Route exact path="/group-menu/invite-members">
          <InviteMembers />
        </Route>
      </IonRouterOutlet>
    </IonPage>
  );
};
