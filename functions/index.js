
require('dotenv').config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const openai = require("openai");

admin.initializeApp();

// Configure the OpenAI API client
const openaiClient = new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // It's recommended to use environment variables for API keys
});

exports.chat = functions.https.onCall(async (data, context) => {
    const { message } = data;

    if (!message) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with one argument \"message\" containing the message to be sent.");
    }

    try {
        // Call the OpenAI API to get a chat completion
        const completion = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo", // Or another model of your choice
            messages: [{ role: "user", content: message }],
        });

        const response = completion.choices[0].message.content;
        return { response };

    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new functions.https.HttpsError("internal", "Unable to complete the request.");
    }
});
