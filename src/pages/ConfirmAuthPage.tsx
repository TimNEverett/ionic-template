import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingView } from "./LoadingView";
import { IonPage } from "@ionic/react";

export const ConfirmAuthPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const error_description = params.get("error_description");
    if (error_description) {
      setErrorMessage(error_description);
      setIsLoading(false);
    }
  }, [location]);

  if (isLoading) {
    return (
      <IonPage>
        <LoadingView />
      </IonPage>
    );
  }

  if (errorMessage) {
    return (
      <IonPage>
        <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
          <div className="text-center mb-4">
            <p className="text-foreground">{errorMessage}</p>
          </div>
          <Button asChild>
            <Link to="/auth/sign-in">Back to Sign In</Link>
          </Button>
        </div>
      </IonPage>
    );
  }
};
