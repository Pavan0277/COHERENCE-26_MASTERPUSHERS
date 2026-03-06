/**
 * Telegram User API (MTProto via gramjs)
 * Sends messages to leads by phone number using a pre-authenticated user session.
 *
 * One-time setup: run `node scripts/gen-telegram-session.js` to get your Session String,
 * then paste it into Settings → Telegram.
 */
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { Api } from "telegram";

/**
 * Send a Telegram message to a lead using their phone number.
 *
 * @param {string} sessionString  - Saved StringSession from gen-telegram-session.js
 * @param {number|string} apiId   - From https://my.telegram.org/apps
 * @param {string} apiHash        - From https://my.telegram.org/apps
 * @param {string} phone          - Lead phone in international format (+91XXXXXXXXXX)
 * @param {string} message        - Message text
 */
export async function sendTelegramByPhone(sessionString, apiId, apiHash, phone, message) {
    if (!sessionString || !apiId || !apiHash) {
        throw new Error(
            "Telegram User API credentials are missing. " +
            "Run scripts/gen-telegram-session.js once, then paste the Session String into Settings → Telegram."
        );
    }

    const client = new TelegramClient(
        new StringSession(sessionString),
        Number(apiId),
        String(apiHash),
        { connectionRetries: 3, requestRetries: 2 }
    );

    await client.connect();

    try {
        // Resolve phone → Telegram user by importing as a contact
        const importResult = await client.invoke(
            new Api.contacts.ImportContacts({
                contacts: [
                    new Api.InputPhoneContact({
                        clientId: BigInt(Date.now()),
                        phone: phone.trim(),
                        firstName: "Lead",
                        lastName: "",
                    }),
                ],
            })
        );

        const user = importResult.users?.[0];
        if (!user) {
            throw new Error(
                `No Telegram account found for ${phone}. ` +
                "The lead must have a Telegram account registered to that phone number."
            );
        }

        await client.sendMessage(user, { message });
        return { provider: "telegram_user", userId: user.id?.toString() };
    } finally {
        await client.disconnect();
    }
}
