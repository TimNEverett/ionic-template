import { IonHeader, IonToolbar, useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { GroupMenu } from "../group-menu/index";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { useDataActor } from "@/hooks/use-data-actor-logic";

export const Header = () => {
  const { selectedMessageGroup } = useMessageGroups();
  const router = useIonRouter();
  const { actor: dataActor } = useDataActor();
  const testFN = async () => {
    await dataActor.send({ type: "invoke_test_fn" });
  };
  return (
    <IonHeader>
      <IonToolbar>
        <div className="w-full flex justify-center relative items-center">
          <Button onClick={() => router.push("/group-menu")}>
            {selectedMessageGroup?.name}
          </Button>
          <Button onClick={testFN}>TEST</Button>
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
