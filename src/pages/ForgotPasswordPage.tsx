import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { IonContent, IonPage } from "@ionic/react";
import { NavLink } from "react-router-dom";

export const ForgotPasswordPage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <div>forgot password</div>
          <ForgotPasswordForm />
          <NavLink to="/auth/sign-in">sign in</NavLink>
        </div>
      </IonContent>
    </IonPage>
  );
};
