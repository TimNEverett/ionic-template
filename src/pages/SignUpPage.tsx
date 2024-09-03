import { AuthForm } from "@/components/auth/AuthForm";
import { IonContent, IonPage } from "@ionic/react";
import { NavLink } from "react-router-dom";

export const SignUpPage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <AuthForm type="signUp" />
          <div> already have an account? </div>
          <NavLink to="/auth/sign-in">sign in</NavLink>
        </div>
      </IonContent>
    </IonPage>
  );
};
