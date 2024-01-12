require("dotenv").config();
const { Server } = require("@elara-services/mailer");

for (const v of [
    "GMAIL", "CLIENT_ID",
    "CLIENT_SECRET", "REFRESH_TOKEN",
    "API_KEY",
]) {
    if (!process.env[v]) {
        console.error(`You didn't provide (${v}) in .env`);
        process.exit(1);
    }
}
const server = new Server({
    email: process.env.GMAIL,
    options: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        username: process.env.USERNAME || "SMS Verification"
    }
}, process.env.API_KEY, parseInt(process.env.PORT));

server.start();