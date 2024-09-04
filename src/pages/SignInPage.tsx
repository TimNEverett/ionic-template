import { AuthForm } from "@/components/auth/AuthForm";
import { IonContent, IonPage } from "@ionic/react";
import { NavLink } from "react-router-dom";

export const SignInPage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <AuthForm />
        </div>
      </IonContent>
    </IonPage>
  );
};
