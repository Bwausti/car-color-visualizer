"use client";

import { useState } from "react";

const EMBED_BASE = "https://customcarapp.com";

export default function SetupPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const embedUrl = logoUrl
    ? `${EMBED_BASE}/embed?logo=${encodeURIComponent(logoUrl)}`
    : `${EMBED_BASE}/embed`;

  const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="700"
  style="border:none; border-radius:12px; max-width:500px;"
  allow="clipboard-read; clipboard-write"
></iframe>`;

  const popupCode = `<!-- ColorShift Popup Button -->
<button
  onclick="document.getElementById('colorshift-modal').style.display='flex'"
  style="background:#000;color:#fff;padding:12px 24px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;"
>
  🎨 Visualize Your Car Color
</button>

<div id="colorshift-modal" style="display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.8);align-items:center;justify-content:center;" onclick="if(event.target===this)this.style.display='none'">
  <div style="position:relative;width:95%;max-width:500px;height:90vh;max-height:750px;border-radius:16px;overflow:hidden;">
    <iframe src="${embedUrl}" width="100%" height="100%" style="border:none;"></iframe>
    <button onclick="this.parentElement.parentElement.style.display='none'" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:#fff;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;">×</button>
  </div>
</div>`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-1.5 h-5 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
          <span className="text-sm font-semibold text-zinc-200 tracking-wide">ColorShift</span>
          <span className="text-zinc-700 text-sm ml-2">Setup Guide</span>
        </div>

        {/* Intro */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Add ColorShift to your website
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Let your customers preview paint colors on their own vehicle. Takes about 2 minutes to install.
          </p>
        </div>

        {/* Step 1: Subscribe */}
        <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-white text-zinc-900 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <h2 className="text-lg font-semibold text-white">Subscribe</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            <strong className="text-zinc-200">$50/month</strong> base + <strong className="text-zinc-200">$0.75</strong> per visualization.
            The base fee covers hosting and AI infrastructure. You only pay per-visualization when customers actually use it.
          </p>
          <a
            href="https://buy.stripe.com/bJe6oHc2y3x0cbS2Xe3oA00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-zinc-900 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            Subscribe Now →
          </a>
        </div>

        {/* Step 2: Optional logo */}
        <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-white text-zinc-900 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <h2 className="text-lg font-semibold text-white">Customize <span className="text-zinc-600 font-normal text-sm">(optional)</span></h2>
          </div>
          <p className="text-zinc-400 text-sm mb-3">Add your logo URL to brand the tool with your shop name.</p>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://yoursite.com/logo.png"
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Step 3: Embed */}
        <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-white text-zinc-900 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <h2 className="text-lg font-semibold text-white">Add to your site</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-4">Pick an option and paste the code into your website HTML.</p>

          {/* Option A: Inline */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-300">Option A: Inline embed</h3>
              <button
                onClick={() => copyToClipboard(iframeCode, "iframe")}
                className="text-[11px] text-zinc-500 hover:text-white border border-zinc-700 px-3 py-1 rounded-md hover:border-zinc-500 transition-colors"
              >
                {copied === "iframe" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-zinc-600 text-xs mb-2">Embeds directly on a page. Good for a dedicated &ldquo;Color Visualizer&rdquo; page.</p>
            <pre className="bg-zinc-800/60 border border-zinc-700/30 rounded-lg p-4 text-[11px] text-zinc-400 overflow-x-auto whitespace-pre-wrap font-mono">
              {iframeCode}
            </pre>
          </div>

          {/* Option B: Popup */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-300">Option B: Popup button</h3>
              <button
                onClick={() => copyToClipboard(popupCode, "popup")}
                className="text-[11px] text-zinc-500 hover:text-white border border-zinc-700 px-3 py-1 rounded-md hover:border-zinc-500 transition-colors"
              >
                {copied === "popup" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-zinc-600 text-xs mb-2">Adds a button that opens the visualizer in a fullscreen modal. Drop it anywhere on your site.</p>
            <pre className="bg-zinc-800/60 border border-zinc-700/30 rounded-lg p-4 text-[11px] text-zinc-400 overflow-x-auto whitespace-pre-wrap font-mono">
              {popupCode}
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800/60 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs font-bold flex-shrink-0">👁</div>
            <h2 className="text-lg font-semibold text-white">Live Preview</h2>
          </div>
          <div className="rounded-xl overflow-hidden border border-zinc-800" style={{ maxWidth: "500px" }}>
            <iframe
              src={embedUrl}
              width="100%"
              height="650"
              style={{ border: "none" }}
            />
          </div>
        </div>

        {/* Support */}
        <div className="text-center py-8 border-t border-zinc-800/40">
          <p className="text-zinc-600 text-xs">
            Questions? Reply to the email you received or contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
}
