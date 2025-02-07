import React, { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axios from "axios";

const App = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    checkToken();
    onMessageListener();
  }, []);

  const checkToken = async () => {
    const storedToken = localStorage.getItem("fcm_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      requestPermission();
    }
  };

  const requestPermission = async () => {
    try {
      const newToken = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
      if (newToken) {
        setToken(newToken);
        localStorage.setItem("fcm_token", newToken);
        await axios.post("http://localhost:5000/save-token", { token: newToken });
      }
    } catch (err) {
      console.error("Error fetching token", err);
    }
  };

  const onMessageListener = () => {
    onMessage(messaging, (payload) => {
      alert(`Notification: ${payload.notification.title}`);
    });
  };

  const sendNotification = async () => {
    await axios.post("http://localhost:5000/send-notification", {
      title: "Hello User!",
      body: "This is a test notification",
      token,
    });
  };

  return (
    <div>
      <h1>Firebase Push Notifications</h1>
      <p>Device Token: {token}</p>
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default App;