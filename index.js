require("dotenv").config();

const express = require("express");
const { Mailer } = require("@elara-services/mailer");
for (const a of [
    "ACCESS_TOKEN",
    "REFRESH_TOKEN",
    "GMAIL",
]) {
    if (!process.env[a]) {
        console.error(`You didn't provide "${a}" in the .env file!`);
        process.exit(1);
    }
}
const mail = new Mailer(process.env.GMAIL, {
    username: process.env.USERNAME,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
});
const app = express()
.use(express.json())
.use(express.urlencoded({ extended: false }))
.set("port", process.env.PORT || "3030");

app.post("/verify", async (req, res) => {
    const { phone, codeLength } = req.body;
    if (!phone) {
        return res.json({ status: false, message: `You didn't provide the 'phone' number` })
    }
    const code = generate(typeof codeLength === "number" ? codeLength : 15, {
        lowerLetters: true,
        upperLetters: true,
        numbers: true,
        symbols: false,
    });
    if (!code) {
        return res.json({ status: false, message: `Unable to generate the code.` });
    }
    const r = await mail.phone(phone, `Verification Code: ${code}`).catch((err) => {
        console.error(err);
        return null;
    });
    if (!r) {
        return res.json({ status: false, message: `Unable to send the SMS verification message.` })
    }
    return res.json({ status: true, code });
});


app.listen(() => {
    console.log(`[SMS Verification]: Started`);
});

/**
 * @param {number} length 
 * @param {object} options 
 * @param {boolean} [options.upperLetters]
 * @param {boolean} [options.lowerLetters]
 * @param {boolean} [options.numbers]
 * @param {boolean} [options.symbols]
 * @returns {string | null}
 */
function generate(length = 10, options = {}) {
    const upperLetters = options?.upperLetters ?? true;
    const lowerLetters = options?.lowerLetters ?? true;
    const numbers = options?.numbers ?? true;
    const symbols = options?.symbols ?? false;

    if (!length || length <= 0) {
        return null;
    }
    if (!upperLetters && !lowerLetters && !numbers && !symbols) {
        return null;
    }

    let charatters = "";

    if (upperLetters) {
        charatters += "ABCDEFGHIJKLMNOPQRSTUWXYZ";
    }
    if (lowerLetters) {
        charatters += "abcdefghijklmnpqrstuwxyz";
    }
    if (numbers) {
        charatters += "1234567890";
    }
    if (symbols) {
        charatters += "!@#$%^&*.()";
    }

    let code = "";

    for (let i = 0; i < length; i++) {
        code += charatters.charAt(Math.floor(Math.random() * charatters.length));
    }

    return code;
}