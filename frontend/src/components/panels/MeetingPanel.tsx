import { useState } from "react";
import { Calendar } from "lucide-react";

const PLATFORMS = ["Calendly", "Cal.com", "Tidycal", "Savvycal", "Other"];
const CHANNELS  = [
  { value: "email",     label: "Email" },
  { value: "sms",       label: "SMS" },
  { value: "whatsapp",  label: "WhatsApp" },
];

interface MeetingConfig {
  platform: string;
  url: string;
  message: string;
  channel: string;
}

interface Props {
  config: Partial<MeetingConfig>;
  onChange: (config: MeetingConfig) => void;
  onClose: () => void;
}

export default function MeetingPanel({ config, onChange, onClose }: Props) {
  const [platform, setPlatform] = useState(config.platform || "Calendly");
  const [url,      setUrl]      = useState(config.url      || "");
  const [message,  setMessage]  = useState(
    config.message || "Hi {name}, I'd love to connect! Book a time that works for you: {bookingUrl}"
  );
  const [channel, setChannel] = useState(config.channel || "email");

  const save = () => {
    onChange({ platform, url: url.trim(), message: message.trim(), channel });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2.5">
        <p className="text-xs text-teal-700 font-medium">Meeting Scheduler</p>
        <p className="text-[11px] text-teal-600 mt-0.5">
          Sends your booking link to the lead. Use{" "}
          <code className="bg-teal-100 px-1 rounded">&#123;bookingUrl&#125;</code> in the message
          to insert the link automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Send Via</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Booking URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://calendly.com/yourname/30min"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          {"{name}"}, {"{company}"}, {"{bookingUrl}"} all interpolated at send time.
        </p>
      </div>

      <button
        onClick={save}
        disabled={!url.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-40 transition"
      >
        <Calendar className="h-4 w-4" />
        Save Meeting Node
      </button>
    </div>
  );
}
