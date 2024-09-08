import { IonHeader, IonToolbar, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { GroupMenu } from "./group-menu/index";
import { useMessageGroups } from "@/hooks/use-message-groups";

export const Header = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const router = useIonRouter();
  return (
    <IonHeader>
      <IonToolbar>
        <div className="w-full flex justify-center relative items-center">
          <Button onClick={() => router.push("/group-menu")}>
            {selectedMessageGroup?.name}
          </Button>
          <div className="absolute right-2">
            <Button onClick={async () => await supabase.auth.signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};
