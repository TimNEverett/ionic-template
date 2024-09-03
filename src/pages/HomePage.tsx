import { ChatTab } from "@/components/home/chat/ChatTab";
import { Header } from "@/components/home/Header";
import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router";
import { useAppActor } from "@/hooks/use-app-actor-logic";
import { OtherTab } from "@/components/home/other/OtherTab";

export const HomePage: React.FC = () => {
  const { state } = useAppActor();
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route
          exact
          path="/home"
          render={() => {
            if (state.matches({ AUTHENTICATED: "LOADING" })) {
              return null;
            }
            return <Redirect exact to="/home/chat" />;
          }}
        />
        <Route exact path="/home/chat">
          <ChatTab />
        </Route>
        <Route exact path="/home/other">
          <OtherTab />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="chat" href="/home/chat">
          <IonLabel>chat</IonLabel>
        </IonTabButton>
        <IonTabButton tab="other" href="/home/other">
          <IonLabel>other</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
