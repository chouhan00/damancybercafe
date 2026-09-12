import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Check, Copy, ExternalLink, Globe, Lock, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteStatus, type SiteStatus } from "@/lib/analytics";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Service Status & API | Daman Cyber Cafe" },
      { name: "description", content: "Real-time service status and integration API for Daman Cyber Cafe." },
    ],
  }),
  component: StatusPage,
});

function StatusPage() {
  const [siteStatus, setSiteStatusState] = useState<SiteStatus>(() => getSiteStatus());
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedApi, setCopiedApi] = useState(false);
  const [origin, setOrigin] = useState("http://localhost:8080");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    const handleSync = () => {
      setSiteStatusState(getSiteStatus());
    };
    window.addEventListener("daman_status_change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("daman_status_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const embedCode = `<script src="${origin}/daman-status-embed.js"></script>`;
  const apiUrl = `${origin}/status?format=json`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyApi = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-cyan selection:text-slate-950 p-4 sm:p-8">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-primary text-slate-950 font-black">
              DC
            </div>
            <div>
              <h1 className="text-lg font-black text-white">DAMAN CYBER CAFE</h1>
              <p className="text-xs text-slate-400">Live Status & Remote Integration API</p>
            </div>
          </div>
          <a
            href="/"
            className="text-xs text-brand-cyan hover:underline font-semibold"
          >
            ← Back to Website
          </a>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl border ${
                  siteStatus.isOnline
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
              >
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Operational Status
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-white">
                    {siteStatus.isOnline ? "🟢 ONLINE (Open / ਖੁੱਲ੍ਹਾ ਹੈ)" : "🔴 OFFLINE (Closed / ਬੰਦ ਹੈ)"}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      siteStatus.isOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 border border-slate-700/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time Sync Active</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-1">
            <p className="text-slate-400 font-semibold">Active Status Notice:</p>
            <p className="text-slate-200 text-sm italic font-medium">"{siteStatus.notice}"</p>
            <p className="text-[10px] text-slate-500 pt-1">
              Last updated: {new Date(siteStatus.lastUpdated).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Connect Other Website Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-cyan" />
              ਦੂਜੀ ਵੈੱਬਸਾਈਟ ਕੰਟਰੋਲ ਕੋਡ (Connect Your Other Website)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add this 1-line script to your other website. Whenever you toggle Online/Offline in this admin panel, your other website will automatically turn ON or OFF too!
            </p>
          </div>

          {/* 1-Line Embed Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Step 1: Copy this Embed Script (HTML / React / WordPress):</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-brand-cyan hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto selection:bg-emerald-950">
              {embedCode}
            </pre>
          </div>

          {/* JSON API Endpoint */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Option 2: Direct JSON Status API URL (For developers / fetch):</span>
              <button
                type="button"
                onClick={handleCopyApi}
                className="text-brand-cyan hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedApi ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between gap-3 text-xs font-mono text-cyan-300">
              <span className="truncate">{apiUrl}</span>
              <a
                href={apiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white shrink-0 inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 pt-8">
        © 2026 Daman Cyber Cafe · Rajpura, Punjab
      </footer>
    </div>
  );
}
