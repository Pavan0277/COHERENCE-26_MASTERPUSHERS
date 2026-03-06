# VAPI Call Errors - Troubleshooting Guide

## Errors from Your Call Logs

### 1. "Callstart error get tra..." → `call.start.error-get-transport`

**Meaning:** VAPI cannot retrieve transport (Twilio) configuration when starting the call.

**Fixes:**
1. **Re-import Twilio credentials** in VAPI:
   - Go to Phone Numbers → Your Twilio number (+91 87664 32949)
   - Click Edit / Re-configure
   - Re-enter your Twilio **Account SID** and **Auth Token**
   - Save

2. **Verify Twilio Console:**
   - Log in to [console.twilio.com](https://console.twilio.com)
   - Check the number is **Active** and has **Voice** capability
   - Ensure you have **account balance**
   - For India: Enable **international calling** if needed

3. **Check Twilio number type:** Some Twilio numbers (e.g. trial) have restrictions. Upgrade if needed.

---

### 2. "Callstart error vapi nu..." → `call.start.error-vapi-number-international` or `-outbound-daily-limit`

**Meaning:** You're using a **free VAPI number** which:
- Does NOT support international calls (India to India may count as international depending on setup)
- Has a daily outbound call limit

**Fix:** Use ONLY the **imported Twilio number** for outbound calls.

**Verify Phone Number ID:**
- In VAPI Dashboard → Phone Numbers → Click your **Twilio** number (+91 87664 32949 "pavan")
- Copy the **ID** from the URL or the details panel (e.g. `4fefadff-17af-4310-9812-246190821432`)
- Update `VAPI_PHONE_NUMBER_ID` in `.env` to match this exact ID
- **Do NOT use** the ID for `sip:...@sip.vapi.ai` or any free VAPI number

---

### 3. Server URL (Optional but Recommended)

If your Server URL points to ngrok:
- **ngrok must be running** when you make calls
- URL must be: `https://your-ngrok-url.ngrok-free.app/api/v1/voice/webhook/vapi`
- If ngrok is down, some call flows may fail

---

## Quick Checklist

| Item | Action |
|------|--------|
| Phone Number ID | Use Twilio number ID only (not SIP/free VAPI) |
| Twilio credentials | Re-enter in VAPI Phone Number config |
| Twilio balance | Ensure account has credits |
| Twilio number | Active, Voice-enabled |
| ngrok | Running if Server URL is set |

---

## Get Full Error in VAPI

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai) → **Call Logs**
2. Click on a failed call
3. Check the full **Ended Reason** (not truncated)
4. Share the exact error code for precise help
