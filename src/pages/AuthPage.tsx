import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, Redirect } from "react-router";
import { SignInPage } from "./SignInPage";
import { ConfirmAuthPage } from "./ConfirmAuthPage";

export const AuthPage = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path="/auth/sign-in">
          <SignInPage />
        </Route>
        <Route exact path="/auth/confirm">
          <ConfirmAuthPage />
        </Route>
        <Route exact path="/auth">
          <Redirect to="/auth/sign-in" />
        </Route>
        <Route render={() => <Redirect to="/auth/sign-in" />} />
      </IonRouterOutlet>
    </IonPage>
  );
};
