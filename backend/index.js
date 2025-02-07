import express from "express";
import cors from "cors";
import admin from "firebase-admin";


const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert("./firebase-adminsdk.json"),
});

const db = admin.firestore();

// Save Token to Firestore
app.post("/save-token", async (req, res) => {
  try {
    const { token } = req.body;
    const doc = await db.collection("tokens").doc(token).get();
    if (!doc.exists) {
      await db.collection("tokens").doc(token).set({ token });
    }
    res.status(200).send("Token processed.");
  } catch (error) {
    res.status(500).send("Error saving token.");
  }
});

// Send Push Notification
app.post("/send-notification", async (req, res) => {
  try {
    const { title, body, token } = req.body;
    await admin.messaging().send({ notification: { title, body }, token });
    res.status(200).send("Notification sent.");
  } catch (error) {
    res.status(500).send("Error sending notification.");
  }
});

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));