import { IonHeader, IonToolbar } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { GroupMenu } from "./GroupMenu";

export const Header = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <div className="w-full flex justify-center relative items-center">
          <GroupMenu />
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
