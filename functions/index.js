const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const axios = require("axios");
const { onSchedule } = require("firebase-functions/v2/scheduler");

admin.initializeApp();
const db = admin.firestore();

exports.scheduledRun = onSchedule(
    { interval: "every 24 hours", timeoutSeconds: 540 }, 
    async () => {
        try {
            console.log("Scheduled function started.");

            const params = {
                access_key: process.env.API_KEY,
                query: "New York",
            };

            const response = await axios.get('http://api.weatherstack.com/current', { params });

            const docRef = db.collection("weather").doc("current");
            await docRef.set({ current: response.data });

            console.log("Data saved successfully!");
        } catch (error) {
            console.error("Error fetching data:", error);
            logger.error(error, { structuredData: true });
        } finally {
            console.log("Scheduled function completed.");
            return null; 
        }
    }
);