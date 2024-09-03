import { CreateGroupForm } from "@/components/create-group/CreateGroupForm";
import { IonContent, IonPage } from "@ionic/react";

export const CreateGroupPage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <CreateGroupForm />
        </div>
      </IonContent>
    </IonPage>
  );
};
