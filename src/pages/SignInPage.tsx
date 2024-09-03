import { AuthForm } from "@/components/auth/AuthForm";
import { IonContent, IonPage } from "@ionic/react";
import { NavLink } from "react-router-dom";

export const SignInPage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
          <AuthForm type="signIn" />

          <NavLink to="/auth/forgot-password">forgot password?</NavLink>

          <div className="text-xs"> don't have an account? </div>

          <NavLink to="/auth/sign-up">sign up</NavLink>
        </div>
      </IonContent>
    </IonPage>
  );
};
