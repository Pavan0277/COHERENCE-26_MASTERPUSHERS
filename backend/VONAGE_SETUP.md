# Vonage Voice API Setup

This project uses **Vonage (Nexmo) Voice API** for outbound calls and transcripts.

## 1. Create a Vonage Account

1. Sign up at [Vonage Dashboard](https://dashboard.nexmo.com)
2. Get your **API Key** and **API Secret** (Account section)

## 2. Create a Voice Application

1. Go to **Applications** → **Create a new application**
2. Name it (e.g. "Voice Outreach")
3. Enable **Voice** capability
4. Generate a **Public/Private key pair** (or upload your own)
5. Download the **private.key** file
6. Copy the **Application ID**

## 3. Get a Phone Number

1. Go to **Numbers** → **Buy Numbers**
2. Buy a number with **Voice** capability
3. Link it to your Voice Application
4. Note the number (e.g. `12345678901` for US)

## 4. Configure `.env`

```env
VONAGE_APPLICATION_ID=your-application-id-here
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFA...
-----END PRIVATE KEY-----"
VONAGE_FROM_NUMBER=12345678901

WEBHOOK_BASE_URL=https://your-ngrok-url.ngrok.io
```

- **VONAGE_APPLICATION_ID**: From step 2
- **VONAGE_PRIVATE_KEY**: Paste the full private key (including BEGIN/END lines). Use `\n` for newlines if in one line.
- **VONAGE_FROM_NUMBER**: Your Vonage number (digits only, no + or spaces)
- **WEBHOOK_BASE_URL**: Public URL for webhooks (use [ngrok](https://ngrok.com) for local dev)

## 5. Expose Webhooks (Local Development)

```bash
ngrok http 3000
```

Set `WEBHOOK_BASE_URL` to the ngrok URL (e.g. `https://abc123.ngrok.io`).

## Call Flow

1. **Initiate call**: POST `/api/v1/voice/call` with `{ "phoneNumber": "918767328451" }`
2. **NCCO**: Talk (greeting) → Record (captures conversation)
3. **Webhooks**: Vonage sends events to `WEBHOOK_BASE_URL/api/v1/voice/webhook/vonage/events`
   - Call status: started, ringing, answered, completed, hangup
   - Recording: `recording_url` when recording completes
4. **Transcripts**: Stored in MongoDB. View via GET `/api/v1/voice/transcripts`

## Phone Number Format

- India: `918767328451` or `8767328451` (auto-prefixed with 91)
- US: `15551234567`
- Include country code, no `+` or spaces
