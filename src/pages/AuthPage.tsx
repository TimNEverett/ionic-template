import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, Redirect } from "react-router";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { SignInPage } from "./SignInPage";
import { SignUpPage } from "./SignUpPage";

export const AuthPage = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path="/auth/sign-in">
          <SignInPage />
        </Route>
        <Route exact path="/auth/sign-up">
          <SignUpPage />
        </Route>
        <Route exact path="/auth/forgot-password">
          <ForgotPasswordPage />
        </Route>
        <Route exact path="/auth">
          <Redirect to="/auth/sign-in" />
        </Route>
        <Route render={() => <Redirect to="/auth/sign-in" />} />
      </IonRouterOutlet>
    </IonPage>
  );
};
