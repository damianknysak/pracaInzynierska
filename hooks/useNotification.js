import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { getInfoAboutUser } from "../utils/firebaseUtils";
import { subscribeToNotifications } from "../utils/notifyUtils";

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notificationsList, setNotificationsList] = useState([]);

  const getInfoAboutUserAsync = async (creatorId) => {
    return await getInfoAboutUser(creatorId);
  };

  useEffect(() => {
    const unsubscribeNotifications = subscribeToNotifications(
      async (requests) => {
        const promises = requests.map(async (request) => {
          const senderInfo = await getInfoAboutUserAsync(request.creatorId);
          return {
            ...request,
            senderInfo: senderInfo,
          };
        });

        const modifiedRequests = await Promise.all(promises);

        setNotificationsList(modifiedRequests);
      }
    );

    // Dodaj return w useEffect, aby odsubskrybować subskrypcję
    return () => {
      unsubscribeNotifications();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificationsList,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default function useNotification() {
  return useContext(NotificationContext);
}
