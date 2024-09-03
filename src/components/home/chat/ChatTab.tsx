import { IonContent, IonPage } from "@ionic/react";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { Header } from "../Header";
import { useMessageGroups } from "@/hooks/use-message-groups";
import { createRef, useEffect } from "react";
export const ChatTab = () => {
  const contentRef = createRef<HTMLIonContentElement>();
  const { selectedGroupMessages } = useMessageGroups();
  useEffect(() => {
    contentRef.current?.scrollToBottom(500);
  }, [selectedGroupMessages]);
  return (
    <IonPage>
      <Header />
      <IonContent fullscreen class="ion-padding" ref={contentRef}>
        <div className="flex flex-col-reverse justify-start flex-1 pb-12">
          <ChatMessageList />
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white">
          <ChatInput />
        </div>
      </IonContent>
    </IonPage>
  );
};
