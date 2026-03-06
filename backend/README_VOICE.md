# AI Voice Automation Module (VAPI)

This module integrates VAPI (Voice AI Platform) for AI-controlled outbound phone calls. VAPI provides a **free tier** with built-in speech recognition, AI conversation, and text-to-speech.

## Why VAPI?

- **Free tier available** – no credit card required to get started
- **Built-in AI** – configure assistants in the dashboard; no custom workflow code needed
- **Free phone numbers** – VAPI provides numbers for outbound calls (limited daily on free tier)
- **All-in-one** – speech recognition, LLM, and TTS handled by VAPI

## Setup

### 1. VAPI Account

1. Sign up at [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Create an **Assistant** (configure system prompt, model, voice)
3. Get a **Phone Number** (free VAPI number or import from Twilio/Vonage/Telnyx)
4. Copy your **API Key** from Settings

### 2. Configure Server URL (Webhook)

In the VAPI dashboard:

1. Go to **Phone Numbers** → select your number
2. Set **Server URL** to: `https://your-domain.com/api/v1/voice/webhook/vapi`
3. For local dev, use ngrok: `ngrok http 3000` → set Server URL to `https://abc123.ngrok.io/api/v1/voice/webhook/vapi`

### 3. Environment Variables

Add to `backend/.env`:

```env
VAPI_API_KEY=your-api-key
VAPI_ASSISTANT_ID=your-assistant-id
VAPI_PHONE_NUMBER_ID=your-phone-number-id
WEBHOOK_BASE_URL=https://your-public-url.com
```

- **VAPI_API_KEY**: From dashboard.vapi.ai → Settings
- **VAPI_ASSISTANT_ID**: From Assistants → your assistant → ID
- **VAPI_PHONE_NUMBER_ID**: From Phone Numbers → your number → ID

### 4. Local Development with ngrok

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Expose webhooks
ngrok http 3000
```

Set `WEBHOOK_BASE_URL` to the ngrok URL. Configure the Server URL in VAPI dashboard to point to `https://YOUR_NGROK_URL/api/v1/voice/webhook/vapi`.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/voice/call` | Yes | Initiate outbound call |
| GET | `/api/v1/voice/transcripts` | Yes | List call transcripts |
| GET | `/api/v1/voice/transcripts/:callId` | Yes | Get single transcript |
| POST | `/api/v1/voice/webhook/vapi` | No | VAPI Server URL (all events) |

## Conversation Flow

1. **Initiate**: User enters phone number in dashboard → Backend calls VAPI API
2. **VAPI handles**: Call setup, speech recognition, AI conversation, TTS
3. **Webhooks**: VAPI sends `status-update`, `end-of-call-report`, `conversation-update` to your Server URL
4. **Transcript storage**: Backend stores full transcript from `end-of-call-report`

## Assistant Configuration

Configure your assistant in the VAPI dashboard to control:

- **System prompt** – e.g. "You are a sales assistant. If interested, explain the product. If not interested, politely end the call."
- **Model** – e.g. GPT-4o-mini
- **Voice** – e.g. eleven_turbo
- **Tools** – optional function calling

## Dashboard

- **Dashboard** (`/dashboard`): Overview with Voice Automation card
- **Voice Automation** (`/voice`): Initiate calls, view transcripts
