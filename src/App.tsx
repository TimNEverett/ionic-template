import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "@/theme/variables.css";
import "@/theme/global.css";

import { Toaster } from "@/components/ui/sonner";
import { appLogicActor } from "@/state";
import { ThemeProvider } from "@/theme/theme-provider";
import { RouterListener } from "./pages/RouterListener";
import { Routes } from "./pages/Routes";

setupIonicReact();
appLogicActor.start();
const App: React.FC = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <IonApp>
      <IonReactRouter>
        <RouterListener />
        <Routes />
        <Toaster richColors />
      </IonReactRouter>
    </IonApp>
  </ThemeProvider>
);

export default App;
