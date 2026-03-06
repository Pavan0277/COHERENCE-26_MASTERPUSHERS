/**
 * One-time Telegram Session String Generator
 * -------------------------------------------
 * Run this script ONCE from the backend folder:
 *
 *   node scripts/gen-telegram-session.js
 *
 * You will be prompted for:
 *   1. API ID   (from https://my.telegram.org/apps)
 *   2. API Hash (from https://my.telegram.org/apps)
 *   3. Your Telegram phone number (+91XXXXXXXXXX)
 *   4. The OTP code Telegram sends to your account
 *   5. Your 2FA password (if enabled)
 *
 * At the end it prints a Session String — copy it into
 * Settings → Telegram → Session String in the web app.
 * You only need to do this once; the session stays valid.
 */

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

(async () => {
    console.log("\n=== Telegram Session String Generator ===\n");
    console.log("Get your API ID and API Hash from https://my.telegram.org/apps\n");

    const apiId   = Number(await ask("API ID   : "));
    const apiHash =        await ask("API Hash : ");
    const phone   =        await ask("Phone (international format, e.g. +91XXXXXXXXXX) : ");

    const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber:   async () => phone,
        phoneCode:     async () => ask("Enter the OTP code Telegram sent you: "),
        password:      async () => ask("Enter your 2FA password (press Enter if none): "),
        onError:       (err) => console.error("Error:", err.message),
    });

    const sessionString = client.session.save();

    console.log("\n✅ Authentication successful!\n");
    console.log("Your Session String (copy this into Settings → Telegram → Session String):");
    console.log("─".repeat(80));
    console.log(sessionString);
    console.log("─".repeat(80));
    console.log("\nKeep this string secret — it grants full access to your Telegram account.\n");

    await client.disconnect();
    rl.close();
    process.exit(0);
})();
