import { HomePage } from "@/pages/HomePage";
import { IonRouterOutlet } from "@ionic/react";
import { Route, Redirect } from "react-router";
import { useNav } from "@/hooks/use-nav";
import { AuthPage } from "@/pages/AuthPage";
import { LoadingView } from "./LoadingView";
import { CreateGroupPage } from "./CreateGroupPage";
import { useAppActor } from "@/hooks/use-app-actor-logic";
import { GroupMenu } from "@/components/home/group-menu";

export const Routes = () => {
  const { state } = useAppActor();
  const { isAuthenticated, isLoading } = useNav();
  return (
    <IonRouterOutlet>
      <Route
        path="/auth"
        render={() => {
          if (isLoading) return <LoadingView />;
          if (isAuthenticated) return <Redirect to="/home" />;
          return <AuthPage />;
        }}
      />
      <Route
        exact
        path="/create-group"
        render={() => {
          if (isLoading) return <LoadingView />;
          if (!isAuthenticated) return <Redirect to="/auth" />;
          return <CreateGroupPage />;
        }}
      />
      <Route
        exact
        path="/group-menu"
        render={() => {
          if (isLoading) return <LoadingView />;
          if (!isAuthenticated) return <Redirect to="/auth" />;
          return <GroupMenu />;
        }}
      />

      <Route
        path="/home"
        render={() => {
          if (isLoading) return <LoadingView />;
          if (!isAuthenticated) return <Redirect to="/auth" />;
          if (state.matches({ AUTHENTICATED: "CREATE_GROUP" })) {
            return <Redirect to="/create-group" />;
          }
          return <HomePage />;
        }}
      />
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route component={() => <Redirect to="/home" />} />
    </IonRouterOutlet>
  );
};
