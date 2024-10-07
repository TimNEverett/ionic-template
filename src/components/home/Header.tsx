import { IonHeader, IonToolbar, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { useDataActor } from "@/hooks/use-data-actor-logic";

export const Header = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const router = useIonRouter();
  const { actor: dataActor } = useDataActor();
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
