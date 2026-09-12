import { useEffect, useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Globe,
  HelpCircle,
  Key,
  Laptop,
  Lock,
  LogOut,
  MessageCircle,
  MessageSquare,
  MessageSquarePlus,
  Monitor,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getAnalyticsSummary,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
  exportDataAsCsv,
  exportDataAsJson,
  clearAnalyticsData,
  resetToDemoData,
  type AnalyticsSummary,
  type TimeRange,
  type UserInquiry,
} from "@/lib/analytics";
import {
  isAuthenticated,
  login,
  logout,
  getCurrentUser,
  updateCredentials,
  checkLockout,
  getAdminPrivateSlug,
  DEFAULT_PRIVATE_ADMIN_SLUG,
} from "@/lib/auth";

export function AdminPortal({ isFromAdminRoute = false }: { isFromAdminRoute?: boolean }) {
  const [authed, setAuthed] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [lockoutSecs, setLockoutSecs] = useState<number>(0);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [activeTab, setActiveTab] = useState<
    "overview" | "whatsapp" | "calls" | "faq_questions" | "traffic" | "settings"
  >("overview");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [currentUser, setCurrentUser] = useState("Admin");

  // Settings state
  const [settingsCurrentPass, setSettingsCurrentPass] = useState("");
  const [settingsNewUser, setSettingsNewUser] = useState("");
  const [settingsNewPass, setSettingsNewPass] = useState("");
  const [settingsConfirmPass, setSettingsConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Private link copy feedback
  const [copiedPrivateUrl, setCopiedPrivateUrl] = useState(false);
  const [privateSlug, setPrivateSlug] = useState(DEFAULT_PRIVATE_ADMIN_SLUG);

  // Search and filter in tables
  const [waSearch, setWaSearch] = useState("");
  const [waSourceFilter, setWaSourceFilter] = useState("all");
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<"all" | "new" | "in_progress" | "resolved">("all");

  // Clear Data Modal & Toast
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearSuccessToast, setClearSuccessToast] = useState(false);

  // Load slug & auth on mount
  useEffect(() => {
    setPrivateSlug(getAdminPrivateSlug());
    const isAuth = isAuthenticated();
    setAuthed(isAuth);
    if (isAuth) {
      setCurrentUser(getCurrentUser());
      loadData(timeRange);
    }
  }, []);

  // Check lockout
  useEffect(() => {
    const lock = checkLockout();
    if (!lock.isLocked) return;
    setLockoutSecs(lock.remainingSeconds);
    const timer = setInterval(() => {
      setLockoutSecs((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reload data
  const loadData = (range: TimeRange) => {
    const data = getAnalyticsSummary(range);
    setSummary(data);
    setInquiries(getAllInquiries());
    setLastRefreshed(new Date());
  };

  // Change time range
  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    loadData(range);
  };

  // Auto refresh timer
  useEffect(() => {
    if (!authed || !autoRefresh) return;
    const interval = setInterval(() => {
      loadData(timeRange);
    }, 12000);
    return () => clearInterval(interval);
  }, [authed, autoRefresh, timeRange]);

  // Listen to custom analytics updates from site
  useEffect(() => {
    if (!authed) return;
    const handleUpdate = () => {
      loadData(timeRange);
    };
    window.addEventListener("daman_analytics_update", handleUpdate);
    window.addEventListener("daman_inquiries_update", handleUpdate);
    return () => {
      window.removeEventListener("daman_analytics_update", handleUpdate);
      window.removeEventListener("daman_inquiries_update", handleUpdate);
    };
  }, [authed, timeRange]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    setTimeout(() => {
      const res = login(usernameInput, passwordInput, rememberMe);
      if (res.success) {
        setAuthed(true);
        setCurrentUser(getCurrentUser());
        loadData(timeRange);
      } else {
        setLoginError(res.error || "Login failed");
        const lock = checkLockout();
        if (lock.isLocked) setLockoutSecs(lock.remainingSeconds);
      }
      setLoginLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  // Update inquiry status
  const handleStatusChange = (id: string, newStatus: UserInquiry["status"]) => {
    updateInquiryStatus(id, newStatus);
    setInquiries(getAllInquiries());
  };

  // Delete inquiry
  const handleDeleteInquiry = (id: string) => {
    if (confirm("Are you sure you want to delete this question record?")) {
      deleteInquiry(id);
      setInquiries(getAllInquiries());
    }
  };

  // Clear all data handler
  const handleClearAllData = () => {
    clearAnalyticsData();
    loadData(timeRange);
    setClearModalOpen(false);
    setClearSuccessToast(true);
    setTimeout(() => {
      setClearSuccessToast(false);
    }, 6000);
  };

  // Update credentials
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);

    const cleanCurrent = settingsCurrentPass.trim();
    const cleanNew = settingsNewPass.trim();
    const cleanConfirm = settingsConfirmPass.trim();

    if (!cleanCurrent) {
      setSettingsMsg({
        type: "error",
        text: "ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਭਰਨਾ ਲਾਜ਼ਮੀ ਹੈ (Current password is required).",
      });
      return;
    }

    if (cleanNew) {
      if (cleanNew.length < 8) {
        setSettingsMsg({
          type: "error",
          text: "ਨਵਾਂ ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (New password must be at least 8 characters).",
        });
        return;
      }
      if (cleanNew !== cleanConfirm) {
        setSettingsMsg({
          type: "error",
          text: "ਦੋਵੇਂ ਨਵੇਂ ਪਾਸਵਰਡ ਆਪਸ ਵਿੱਚ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ (New password and Confirm password do not match)!",
        });
        return;
      }
      if (cleanNew === cleanCurrent) {
        setSettingsMsg({
          type: "error",
          text: "ਨਵਾਂ ਪਾਸਵਰਡ ਪੁਰਾਣੇ ਪਾਸਵਰਡ ਨਾਲੋਂ ਵੱਖਰਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (New password cannot be identical to current password).",
        });
        return;
      }
    }

    const res = updateCredentials(
      cleanCurrent,
      settingsNewUser.trim() || currentUser,
      cleanNew || undefined,
      cleanConfirm || undefined
    );

    if (res.success) {
      setSettingsMsg({
        type: "success",
        text: "ਪਾਸਵਰਡ ਸਫ਼ਲਤਾਪੂਰਵਕ ਬਦਲ ਗਿਆ ਹੈ! ਹੁਣ ਸਿਰਫ਼ ਇਹ ਨਵਾਂ ਪਾਸਵਰਡ ਹੀ ਕੰਮ ਕਰੇਗਾ, ਪੁਰਾਣਾ ਪਾਸਵਰਡ ਹਮੇਸ਼ਾ ਲਈ ਰੱਦ ਹੋ ਗਿਆ ਹੈ। (Credentials updated successfully! Only this new password will work from now on; previous password is completely revoked.)",
      });
      setSettingsCurrentPass("");
      setSettingsNewPass("");
      setSettingsConfirmPass("");
      if (settingsNewUser.trim()) {
        setCurrentUser(settingsNewUser.trim());
      }
    } else {
      setSettingsMsg({
        type: "error",
        text: res.error || "ਪਾਸਵਰਡ ਬਦਲਣ ਵਿੱਚ ਅਸਫ਼ਲ ਰਿਹਾ (Failed to update credentials).",
      });
    }
  };

  // Private URL full string
  const privateUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${privateSlug}`
    : `http://localhost:8080/${privateSlug}`;

  const handleCopyPrivateUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(privateUrl);
      setCopiedPrivateUrl(true);
      setTimeout(() => setCopiedPrivateUrl(false), 3000);
    }
  };

  // Filtered WhatsApp Events
  const filteredWaEvents = useMemo(() => {
    if (!summary) return [];
    return summary.recentEvents
      .filter((e) => e.type === "whatsapp_click")
      .filter((e) => {
        if (waSourceFilter !== "all" && e.source !== waSourceFilter) return false;
        if (waSearch.trim()) {
          const s = waSearch.toLowerCase();
          const matchLabel = e.label?.toLowerCase().includes(s);
          const matchService = e.metadata?.serviceName?.toString().toLowerCase().includes(s);
          const matchSource = e.source.toLowerCase().includes(s);
          return matchLabel || matchService || matchSource;
        }
        return true;
      });
  }, [summary, waSourceFilter, waSearch]);

  // Filtered Call Events
  const callEvents = useMemo(() => {
    if (!summary) return [];
    return summary.recentEvents.filter((e) => e.type === "call_click");
  }, [summary]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((q) => {
      if (inquiryStatusFilter !== "all" && q.status !== inquiryStatusFilter) return false;
      if (inquirySearch.trim()) {
        const s = inquirySearch.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(s);
        const matchCat = q.category?.toLowerCase().includes(s);
        const matchName = q.name?.toLowerCase().includes(s);
        const matchPhone = q.phone?.includes(s);
        return matchQ || matchCat || matchName || matchPhone;
      }
      return true;
    });
  }, [inquiries, inquiryStatusFilter, inquirySearch]);

  // Donut chart data
  const channelsPieData = useMemo(() => {
    if (!summary) return [];
    return [
      { name: "WhatsApp Clicks", value: summary.totalWhatsAppClicks, color: "#25D366" },
      { name: "Phone Calls", value: summary.totalCallClicks, color: "#0ea5e9" },
      { name: "Questions Put", value: summary.totalQuestionsPut, color: "#f59e0b" },
    ].filter((item) => item.value > 0);
  }, [summary]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-sm font-medium">
          <RefreshCw className="h-5 w-5 animate-spin text-brand-cyan" />
          <span>Verifying security session...</span>
        </div>
      </div>
    );
  }

  // PRIVATE LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-brand-deep flex items-center justify-center p-4 text-foreground relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl">
          {/* Brand header */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan to-primary text-slate-950 font-black text-xl shadow-lg shadow-primary/20 mb-3">
              DC
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-[11px] font-bold text-emerald-400 mb-2">
              <Lock className="h-3 w-3" /> Private Access Only
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">DAMAN CYBER CAFE</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mt-1">
              Private Admin Control Portal
            </p>
            <p className="text-xs text-slate-400 mt-0.5">ਰਾਜਪੁਰਾ · ਕੇਵਲ ਅਧਿਕਾਰਤ ਐਡਮਿਨ ਲਈ</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-6">
            {loginError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 animate-in fade-in-50">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {lockoutSecs > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                <Clock className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Account locked for security. Try again in {lockoutSecs}s.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-all"
                />
                <User className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loginLoading || lockoutSecs > 0}
              className="w-full h-11 bg-gradient-to-r from-brand-cyan to-primary hover:opacity-95 text-slate-950 font-bold text-sm shadow-md transition-all duration-200 active:scale-95 cursor-pointer mt-2"
            >
              {loginLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Secure Admin Login
                </span>
              )}
            </Button>
          </form>

          {/* Footer security notes */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Private & Protected
            </span>
            <a href="/" className="hover:text-white transition-colors">
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-cyan selection:text-slate-950">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-primary text-slate-950 font-extrabold text-base shadow-sm">
              DC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base">DAMAN CYBER CAFE</span>
                <span className="rounded-full bg-brand-cyan/15 border border-brand-cyan/30 px-2 py-0.5 text-[10px] font-bold text-brand-cyan">
                  Private Portal v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Owner Activity & Control Dashboard</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real Tracking</span>
            </div>

            {/* Time range selector */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
              {(
                [
                  { id: "today", label: "Today" },
                  { id: "7d", label: "7 Days" },
                  { id: "30d", label: "30 Days" },
                  { id: "all", label: "All Time" },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRangeChange(r.id)}
                  className={cn(
                    "rounded-md px-2.5 py-1 transition-all cursor-pointer",
                    timeRange === r.id
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadData(timeRange)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title="Refresh Data Now"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            {/* Clear All Data Button */}
            <button
              onClick={() => setClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-200 hover:bg-red-500/25 hover:border-red-400 transition-colors cursor-pointer shadow-xs"
              title="Clear All Analytics Data / ਸਾਰਾ ਡਾਟਾ ਸਾਫ਼ ਕਰੋ"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span>Clear All Data</span>
              <span className="hidden xl:inline text-[10px] text-red-400 font-medium">(ਸਾਰਾ ਸਾਫ਼ ਕਰੋ)</span>
            </button>

            {/* Visit Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-brand-cyan" />
              <span className="hidden sm:inline">View Site</span>
            </a>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
              title="Logout from Admin Panel"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview / ਡੈਸ਼ਬੋਰਡ", icon: Activity },
            { id: "whatsapp", label: `WhatsApp Leads (${summary?.totalWhatsAppClicks ?? 0})`, icon: MessageCircle },
            { id: "calls", label: `Calls (${summary?.totalCallClicks ?? 0})`, icon: PhoneCall },
            { id: "faq_questions", label: `Questions Put (${inquiries.length})`, icon: MessageSquare },
            { id: "traffic", label: "Traffic & Devices", icon: Laptop },
            { id: "settings", label: "Settings & Private Link", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer",
                  isActive
                    ? "bg-slate-800 text-brand-cyan shadow-sm border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-brand-cyan" : "text-slate-500")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Live Real Activity Tracking Banner */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-brand-cyan">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Daman Cyber Cafe Private Analytics Portal</h2>
                <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
                  ✓ 100% Real Activity Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ਸਿਰਫ਼ ਅਸਲੀ ਗਾਹਕਾਂ ਦਾ ਡਾਟਾ · Real visitor engagement, WhatsApp chats, calls & inquiries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Tracking</span>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Page Views */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Website Views</span>
              <Globe className="h-4 w-4 text-brand-cyan" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalPageViews.toLocaleString() ?? 0}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>{summary?.uniqueVisitors.toLocaleString() ?? 0} unique visitors</span>
              <span className="text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> active
              </span>
            </div>
          </div>

          {/* 2. WhatsApp Leads */}
          <div className="rounded-xl border border-emerald-500/20 bg-slate-900/70 p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Clicks</span>
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalWhatsAppClicks.toLocaleString() ?? 0}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Direct chat leads</span>
              <span className="text-[#25D366] font-semibold">High Intent</span>
            </div>
          </div>

          {/* 3. Phone Calls */}
          <div className="rounded-xl border border-sky-500/20 bg-slate-900/70 p-4 sm:p-5 relative overflow-hidden group hover:border-sky-500/40 transition-all">
            <div className="flex items-center justify-between text-sky-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Calls Made</span>
              <Phone className="h-4 w-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalCallClicks.toLocaleString() ?? 0}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Call button taps</span>
              <span className="text-sky-400 font-semibold">+91 97792...</span>
            </div>
          </div>

          {/* 4. Questions Put */}
          <div className="rounded-xl border border-amber-500/20 bg-slate-900/70 p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Questions Put</span>
              <MessageSquare className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.totalQuestionsPut.toLocaleString() ?? 0}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>User inquiries</span>
              <span className="text-amber-400 font-semibold">
                {inquiries.filter((q) => q.status === "new").length} New
              </span>
            </div>
          </div>

          {/* 5. Overall Conversion Rate */}
          <div className="col-span-2 lg:col-span-1 rounded-xl border border-primary/20 bg-gradient-to-br from-slate-900 to-slate-900/60 p-4 sm:p-5 relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-brand-cyan mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
              <Zap className="h-4 w-4 text-brand-cyan" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {summary?.conversionRate ?? 0}%
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Total actions: {summary?.totalConversions ?? 0}</span>
              <span className="text-brand-cyan font-bold">Leads/Views</span>
            </div>
          </div>
        </section>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Quick Action Controls Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div>
                  <p className="text-xs font-bold text-white">ਤੁਰੰਤ ਕੰਟਰੋਲ (Quick Actions)</p>
                  <p className="text-[11px] text-slate-400 hidden sm:block">ਸਾਰਾ ਡਾਟਾ ਸਾਫ਼ ਕਰੋ, ਐਕਸਪੋਰਟ ਕਰੋ ਜਾਂ ਤਾਜ਼ਾ ਕਰੋ</p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportDataAsCsv}
                  className="h-8 text-xs font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Reset analytics to baseline sample data?")) {
                      resetToDemoData();
                      loadData(timeRange);
                    }
                  }}
                  className="h-8 text-xs font-semibold border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1 text-brand-cyan" /> Demo Data
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setClearModalOpen(true)}
                  className="h-8 text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All Data (ਸਾਰਾ ਡਾਟਾ ਸਾਫ਼ ਕਰੋ)</span>
                </Button>
              </div>
            </div>

            {/* Chart: Traffic & Leads Trend */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-brand-cyan" />
                    Traffic & Engagement Trends
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daily website views vs customer contact actions (WhatsApp & Calls)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-brand-cyan">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-cyan" />
                    Website Views
                  </span>
                  <span className="flex items-center gap-1.5 text-[#25D366]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#25D366]" />
                    WhatsApp Leads
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    Phone Calls
                  </span>
                </div>
              </div>

              <div className="h-72 w-full">
                {summary && summary.dailyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={summary.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#00d2ff" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorWa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#25D366" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#25D366" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.5rem",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        name="Page Views"
                        stroke="#00d2ff"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                      <Area
                        type="monotone"
                        dataKey="whatsapp"
                        name="WhatsApp Clicks"
                        stroke="#25D366"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorWa)"
                      />
                      <Area
                        type="monotone"
                        dataKey="calls"
                        name="Phone Calls"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    No traffic trend data available yet.
                  </div>
                )}
              </div>
            </div>

            {/* 2-Column Grid: Channel Distribution & Top Inquired Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Breakdown Donut */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquarePlus className="h-4 w-4 text-emerald-400" />
                    Customer Contact Channels
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Distribution of visitor communication preferences
                  </p>
                </div>

                <div className="h-60 w-full flex items-center justify-center my-2">
                  {channelsPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelsPieData}
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {channelsPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-xs text-slate-500">No channel data recorded yet.</div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">WhatsApp</p>
                    <p className="font-extrabold text-[#25D366] text-sm mt-0.5">
                      {summary?.totalWhatsAppClicks ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Phone Calls</p>
                    <p className="font-extrabold text-sky-400 text-sm mt-0.5">
                      {summary?.totalCallClicks ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Questions Put</p>
                    <p className="font-extrabold text-amber-400 text-sm mt-0.5">
                      {summary?.totalQuestionsPut ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Services Inquired */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-cyan" />
                    Most Inquired Services
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    What services visitors ask about most on WhatsApp & Calls
                  </p>
                </div>

                <div className="space-y-3 my-4">
                  {summary && summary.topServices.length > 0 ? (
                    summary.topServices.map((item, idx) => {
                      const maxCount = summary.topServices[0]?.count || 1;
                      const pct = Math.round((item.count / maxCount) * 100);
                      return (
                        <div key={item.service} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200 truncate pr-2">
                              {idx + 1}. {item.service}
                            </span>
                            <span className="font-bold text-brand-cyan shrink-0">
                              {item.count} inquiries
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-primary transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-8">
                      No service inquiries recorded yet.
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Based on visitor clicks</span>
                  <button
                    onClick={() => setActiveTab("whatsapp")}
                    className="text-brand-cyan hover:underline font-semibold cursor-pointer"
                  >
                    View All WhatsApp Logs →
                  </button>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-cyan" />
                    Real-Time Visitor Activity Stream
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live chronological record of user interactions on Daman Cyber Cafe website
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Showing latest {summary?.recentEvents.length ?? 0} events
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Event Type</th>
                      <th className="py-2.5 px-3">Source Location</th>
                      <th className="py-2.5 px-3">Context / Service</th>
                      <th className="py-2.5 px-3">Device</th>
                      <th className="py-2.5 px-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary && summary.recentEvents.length > 0 ? (
                      summary.recentEvents.slice(0, 15).map((e) => {
                        let badgeClass = "bg-slate-800 text-slate-300";
                        let typeLabel = "Page View";
                        let icon = <Globe className="h-3 w-3" />;

                        if (e.type === "whatsapp_click") {
                          badgeClass = "bg-emerald-500/15 text-[#25D366] border border-emerald-500/30";
                          typeLabel = "WhatsApp Click";
                          icon = <MessageCircle className="h-3 w-3 text-[#25D366]" />;
                        } else if (e.type === "call_click") {
                          badgeClass = "bg-sky-500/15 text-sky-400 border border-sky-500/30";
                          typeLabel = "Phone Call";
                          icon = <Phone className="h-3 w-3 text-sky-400" />;
                        } else if (e.type === "faq_view") {
                          badgeClass = "bg-purple-500/15 text-purple-400 border border-purple-500/30";
                          typeLabel = "FAQ Viewed";
                          icon = <HelpCircle className="h-3 w-3 text-purple-400" />;
                        } else if (e.type === "faq_question_put") {
                          badgeClass = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
                          typeLabel = "Question Submitted";
                          icon = <MessageSquare className="h-3 w-3 text-amber-400" />;
                        }

                        const timeAgo = formatTimeAgo(new Date(e.timestamp));

                        return (
                          <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-medium">
                              <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold", badgeClass)}>
                                {icon}
                                <span>{typeLabel}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                              {e.source}
                            </td>
                            <td className="py-2.5 px-3 text-slate-200">
                              {e.metadata?.serviceName || e.metadata?.questionText || e.label || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              <span className="flex items-center gap-1">
                                {e.device === "Mobile" ? (
                                  <Smartphone className="h-3 w-3" />
                                ) : (
                                  <Monitor className="h-3 w-3" />
                                )}
                                <span>{e.device}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-400 whitespace-nowrap font-mono text-[11px]">
                              {timeAgo}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          No visitor events recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP LEADS TRACKER */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    WhatsApp Leads & Click Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track every user who tapped WhatsApp on your website to chat or send documents
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search service, button..."
                      value={waSearch}
                      onChange={(e) => setWaSearch(e.target.value)}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 pl-8 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                    />
                    <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>

                  <select
                    value={waSourceFilter}
                    onChange={(e) => setWaSourceFilter(e.target.value)}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="all">All Buttons</option>
                    <option value="hero">Hero Section</option>
                    <option value="header">Header</option>
                    <option value="service_card">Service Cards</option>
                    <option value="faq_item">FAQ Items</option>
                    <option value="footer_banner">Footer Banner</option>
                    <option value="mobile_floating_bar">Mobile Sticky Bar</option>
                    <option value="inquiry_box">Quick Inquiry Box</option>
                  </select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportDataAsCsv}
                    className="h-8 text-xs font-semibold gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Button Location</th>
                      <th className="py-3 px-3">Inquired Service / Context</th>
                      <th className="py-3 px-3">Device</th>
                      <th className="py-3 px-3 text-right">Direct Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredWaEvents.length > 0 ? (
                      filteredWaEvents.map((e) => {
                        const dateStr = new Date(e.timestamp).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const serviceName = e.metadata?.serviceName || "General Inquiry";
                        return (
                          <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {dateStr}
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-block rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[11px] text-slate-200">
                                {e.source}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-medium text-white">
                              {serviceName}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              <span className="flex items-center gap-1">
                                {e.device === "Mobile" ? (
                                  <Smartphone className="h-3 w-3 text-brand-cyan" />
                                ) : (
                                  <Monitor className="h-3 w-3" />
                                )}
                                <span>{e.device}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <a
                                href={`https://wa.me/919779223042?text=${encodeURIComponent(
                                  `Followup with visitor regarding: ${serviceName}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold px-2.5 py-1 text-[11px] transition-colors"
                              >
                                <MessageCircle className="h-3 w-3" /> Chat Link
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No matching WhatsApp leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PHONE CALL LOGS */}
        {activeTab === "calls" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-sky-400" />
                    Phone Call Click Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Records of visitors who tapped phone links to call +91 97792 23042
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-300 font-mono">
                    Total Calls: {callEvents.length}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportDataAsCsv}
                    className="h-8 text-xs font-semibold gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Call Button Source</th>
                      <th className="py-3 px-3">Target Number</th>
                      <th className="py-3 px-3">Device</th>
                      <th className="py-3 px-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {callEvents.length > 0 ? (
                      callEvents.map((e) => {
                        const dateStr = new Date(e.timestamp).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return (
                          <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {dateStr}
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-block rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[11px] text-slate-200">
                                {e.source}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-sky-400 font-mono">
                              +91 97792 23042
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              <span className="flex items-center gap-1">
                                {e.device === "Mobile" ? (
                                  <Smartphone className="h-3 w-3 text-sky-400" />
                                ) : (
                                  <Monitor className="h-3 w-3" />
                                )}
                                <span>{e.device}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                              {e.label || "Direct call"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No phone calls recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAQ & QUESTIONS PUT MANAGEMENT */}
        {activeTab === "faq_questions" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* User Submitted Questions Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquarePlus className="h-5 w-5 text-amber-400" />
                    Questions Put by Website Visitors (ਪੁੱਛੇ ਗਏ ਸਵਾਲ)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Questions submitted through "⚡ ਪੁੱਛੋ ਆਪਣਾ ਸਵਾਲ" & Quick Inquiry form
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search question text, name..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 pl-8 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                    />
                    <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>

                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value as any)}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New (ਨਵੇਂ ਸਵਾਲ)</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved (ਹੱਲ ਹੋਏ)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((q) => {
                    const dateFormatted = new Date(q.timestamp).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={q.id}
                        className={cn(
                          "rounded-xl border p-4 transition-all space-y-3",
                          q.status === "new"
                            ? "border-amber-500/40 bg-amber-500/5 shadow-xs"
                            : q.status === "in_progress"
                              ? "border-sky-500/30 bg-sky-500/5"
                              : "border-slate-800 bg-slate-950/60 opacity-80"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                                  q.status === "new"
                                    ? "bg-amber-500 text-slate-950"
                                    : q.status === "in_progress"
                                      ? "bg-sky-500 text-slate-950"
                                      : "bg-emerald-500 text-slate-950"
                                )}
                              >
                                {q.status.replace("_", " ")}
                              </span>
                              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-semibold">
                                {q.category || "General Inquiry"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {dateFormatted}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-white pt-1 leading-relaxed">
                              "{q.question}"
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            {/* Status Changer */}
                            <select
                              value={q.status}
                              onChange={(e) => handleStatusChange(q.id, e.target.value as any)}
                              className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-brand-cyan focus:outline-none"
                            >
                              <option value="new">Mark New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>

                            {/* Reply on WhatsApp Button */}
                            <a
                              href={`https://wa.me/919779223042?text=${encodeURIComponent(
                                `Hello, regarding your question at Daman Cyber Cafe: "${q.question}"`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded bg-[#25D366] hover:bg-[#20bd5a] px-3 py-1 text-xs font-bold text-white flex items-center gap-1 transition-colors"
                              title="Open WhatsApp with reply template"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteInquiry(q.id)}
                              className="rounded p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete inquiry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {(q.name || q.phone) && (
                          <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            {q.name && (
                              <span className="flex items-center gap-1 text-slate-300">
                                <User className="h-3 w-3 text-brand-cyan" /> {q.name}
                              </span>
                            )}
                            {q.phone && (
                              <span className="flex items-center gap-1 font-mono text-slate-300">
                                <Phone className="h-3 w-3 text-brand-cyan" /> {q.phone}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500">
                              Submitted via: {q.source} ({q.device})
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No matching visitor questions found.
                  </div>
                )}
              </div>
            </div>

            {/* Most Read FAQs Statistics */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <HelpCircle className="h-4 w-4 text-purple-400" />
                Frequently Asked Questions Readership
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Which questions are opened and read most often by visitors
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {summary && summary.faqViewsBreakdown.length > 0 ? (
                  summary.faqViewsBreakdown.map((f) => (
                    <div
                      key={f.faqNum}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-purple-400">
                          FAQ #{f.faqNum}
                        </span>
                        <span className="rounded bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[11px] font-bold text-purple-300">
                          {f.count} views
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                        {f.faqTitle}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-6 text-xs text-slate-500">
                    No FAQ views recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TRAFFIC & DEVICES INSIGHTS */}
        {activeTab === "traffic" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mobile */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Mobile Users</span>
                  <Smartphone className="h-5 w-5 text-brand-cyan" />
                </div>
                <div className="text-3xl font-black text-white">
                  {summary?.deviceBreakdown.mobile ?? 0}
                </div>
                <div className="text-xs text-slate-400">
                  Smartphone visitors (Android, iOS)
                </div>
              </div>

              {/* Desktop */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Desktop Users</span>
                  <Monitor className="h-5 w-5 text-sky-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {summary?.deviceBreakdown.desktop ?? 0}
                </div>
                <div className="text-xs text-slate-400">
                  Laptop & desktop computer users
                </div>
              </div>

              {/* Tablet */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Tablet Users</span>
                  <Laptop className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {summary?.deviceBreakdown.tablet ?? 0}
                </div>
                <div className="text-xs text-slate-400">
                  iPad & tablet device visitors
                </div>
              </div>
            </div>

            {/* Traffic Sources Breakdown */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm">
              <h3 className="text-base font-bold text-white mb-1">
                Website Section Engagement
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Which sections generated the most customer inquiries
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {summary && summary.sourceBreakdown.length > 0 ? (
                  summary.sourceBreakdown.map((s) => (
                    <div key={s.source} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                      <p className="text-xs font-bold text-slate-300 truncate">{s.source}</p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black text-white">{s.count}</span>
                        <span className="text-xs font-semibold text-brand-cyan">{s.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-brand-cyan rounded-full"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-6 text-xs text-slate-500">
                    No section engagement recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS, PRIVATE LINK & EXPORT */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200 max-w-4xl">
            {/* DEDICATED PRIVATE ADMIN LINK CARD */}
            <div className="rounded-2xl border border-brand-cyan/40 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-cyan/10 p-5 sm:p-6 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      ਖ਼ਾਸ ਪ੍ਰਾਈਵੇਟ ਐਡਮਿਨ ਲਿੰਕ (Secret Private Admin Link)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      This private link is exclusive to you. Public /admin displays 404 Not Found.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 self-start sm:self-auto flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> 100% Private & Hidden
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Your Dedicated Private Admin URL:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-brand-cyan select-all break-all shadow-inner">
                    {privateUrl}
                  </div>
                  <Button
                    type="button"
                    onClick={handleCopyPrivateUrl}
                    className="h-10 sm:h-11 px-5 bg-gradient-to-r from-brand-cyan to-primary hover:opacity-90 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    {copiedPrivateUrl ? (
                      <>
                        <Check className="h-4 w-4 text-slate-950" />
                        <span>ਕਾਪੀ ਹੋ ਗਿਆ! (Copied)</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Private Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Safety tips in Punjabi & English */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs space-y-2 text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  ਜ਼ਰੂਰੀ ਸੁਰੱਖਿਆ ਜਾਣਕਾਰੀ (Important Security Guidelines):
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-[12px] text-slate-400">
                  <li>
                    ਇਸ ਲਿੰਕ ਨੂੰ ਆਪਣੇ ਫ਼ੋਨ ਜਾਂ ਲੈਪਟਾਪ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ <strong>Bookmark (ਸੇਵ)</strong> ਕਰ ਲਵੋ ਤਾਂ ਜੋ ਤੁਸੀਂ ਬਿਨਾਂ ਕਿਸੇ ਨੂੰ ਦੱਸੇ ਸਿੱਧਾ ਐਡਮਿਨ ਪੋਰਟਲ ਖੋਲ੍ਹ ਸਕੋ।
                  </li>
                  <li>
                    ਕਿਸੇ ਵੀ ਬਾਹਰਲੇ ਗਾਹਕ ਜਾਂ ਹੈਕਰ ਨੂੰ ਇਹ ਲਿੰਕ ਨਹੀਂ ਮਿਲੇਗਾ ਕਿਉਂਕਿ ਪਬਲਿਕ ਵੈੱਬਸਾਈਟ 'ਤੇ ਇਹ ਕਿਤੇ ਵੀ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।
                  </li>
                  <li>
                    ਜੇਕਰ ਕੋਈ ਆਮ ਤੌਰ 'ਤੇ <code className="bg-slate-900 px-1 py-0.5 rounded text-red-400">/admin</code> ਲਿਖ ਕੇ ਖੋਲ੍ਹੇਗਾ, ਤਾਂ ਉਸਨੂੰ <strong>404 Page Not Found</strong> ਮਿਲੇਗਾ।
                  </li>
                </ul>
              </div>
            </div>

            {/* Export & Data Management */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-brand-cyan" />
                  Analytics Data & Export
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Download activity records for offline accounting, Excel reporting, or backup
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={exportDataAsCsv}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 flex items-center gap-2 justify-center shadow-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Download Excel / CSV Report</span>
                </Button>

                <Button
                  onClick={exportDataAsJson}
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800 text-white font-semibold h-11 flex items-center gap-2 justify-center"
                >
                  <FileText className="h-4 w-4 text-brand-cyan" />
                  <span>Download Full JSON Backup</span>
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Data Accuracy: <strong className="text-emerald-400">100% Real Live Visitor Activity</strong>
                </span>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setClearModalOpen(true)}
                  className="h-8 text-xs font-bold bg-red-600 hover:bg-red-500 cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear All Data (ਸਾਰਾ ਡਾਟਾ ਸਾਫ਼ ਕਰੋ)
                </Button>
              </div>
            </div>

            {/* Change Admin Password */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-brand-cyan" />
                  Change Admin Username & Password (ਯੂਜ਼ਰਨੇਮ ਅਤੇ ਪਾਸਵਰਡ ਬਦਲੋ)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ਸੁਰੱਖਿਅਤ ਲੌਗਇਨ ਲਈ ਆਪਣਾ ਯੂਜ਼ਰਨੇਮ ਜਾਂ ਪਾਸਵਰਡ ਬਦਲੋ। ਨਵਾਂ ਪਾਸਵਰਡ ਸੈੱਟ ਹੋਣ ਤੋਂ ਬਾਅਦ ਪੁਰਾਣਾ ਪਾਸਵਰਡ ਹਮੇਸ਼ਾ ਲਈ ਰੱਦ ਹੋ ਜਾਵੇਗਾ।
                </p>
              </div>

              {/* Strict Security Badge / Notice */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-xs text-cyan-200/90 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-brand-cyan">
                  <ShieldCheck className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>ਪੂਰੀ ਸੁਰੱਖਿਆ ਗਰੰਟੀ (Zero-Trust Security Active):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pl-1">
                  <li>ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਸਹੀ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ; ਕੋਈ ਵੀ ਗ਼ਲਤ ਜਾਣਕਾਰੀ ਭਰਨ ਤੇ ਪਾਸਵਰਡ ਬਿਲਕੁਲ ਨਹੀਂ ਬਦਲੇਗਾ।</li>
                  <li>ਨਵਾਂ ਪਾਸਵਰਡ ਬਦਲਣ ਤੋਂ ਬਾਅਦ <strong className="text-white">ਸਿਰਫ਼ ਤੇ ਸਿਰਫ਼ ਨਵਾਂ ਪਾਸਵਰਡ ਹੀ ਕੰਮ ਕਰੇਗਾ</strong>।</li>
                  <li>ਪੁਰਾਣਾ ਜਾਂ ਡਿਫਾਲਟ ਕੋਈ ਵੀ ਪਾਸਵਰਡ ਸਿਸਟਮ ਵਿੱਚੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੱਦ ਹੋ ਜਾਵੇਗਾ।</li>
                </ul>
              </div>

              {settingsMsg && (
                <div
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg p-3.5 text-xs font-medium",
                    settingsMsg.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-red-500/30 bg-red-500/10 text-red-300"
                  )}
                >
                  {settingsMsg.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{settingsMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="space-y-4 pt-1 max-w-lg">
                {/* Current Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ਮੌਜੂਦਾ ਪਾਸਵਰਡ (Current Password) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={settingsCurrentPass}
                      onChange={(e) => setSettingsCurrentPass(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 pr-10 text-sm text-white focus:border-brand-cyan focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">ਆਪਣੀ ਪਛਾਣ ਤਸਦੀਕ ਕਰਨ ਲਈ ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।</p>
                </div>

                {/* New Username Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ਨਵਾਂ ਯੂਜ਼ਰਨੇਮ (New Username - Optional)
                  </label>
                  <input
                    type="text"
                    value={settingsNewUser}
                    onChange={(e) => setSettingsNewUser(e.target.value)}
                    placeholder={currentUser}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-brand-cyan focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">ਮੌਜੂਦਾ ਯੂਜ਼ਰਨੇਮ: <strong className="text-brand-cyan">{currentUser}</strong> (ਬਦਲਣਾ ਹੋਵੇ ਤਾਂ ਨਵਾਂ ਲਿਖੋ, ਨਹੀਂ ਤਾਂ ਖਾਲੀ ਛੱਡੋ)</p>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ਨਵਾਂ ਪਾਸਵਰਡ (New Strong Password - min. 8 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={settingsNewPass}
                      onChange={(e) => setSettingsNewPass(e.target.value)}
                      placeholder="Leave blank to keep same password"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 pr-10 text-sm text-white focus:border-brand-cyan focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {settingsNewPass && settingsNewPass.length < 8 && (
                    <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ({settingsNewPass.length}/8)
                    </p>
                  )}
                  {settingsNewPass && settingsCurrentPass && settingsNewPass === settingsCurrentPass && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> ਨਵਾਂ ਪਾਸਵਰਡ ਪੁਰਾਣੇ ਪਾਸਵਰਡ ਨਾਲੋਂ ਵੱਖਰਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ
                    </p>
                  )}
                </div>

                {/* Confirm New Password Field */}
                {settingsNewPass.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ (Confirm New Password) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        required={settingsNewPass.length > 0}
                        value={settingsConfirmPass}
                        onChange={(e) => setSettingsConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className={cn(
                          "w-full rounded-lg border bg-slate-950 px-3.5 py-2 pr-10 text-sm text-white focus:outline-none",
                          settingsConfirmPass && settingsNewPass === settingsConfirmPass
                            ? "border-emerald-500 focus:border-emerald-400"
                            : settingsConfirmPass && settingsNewPass !== settingsConfirmPass
                            ? "border-red-500 focus:border-red-400"
                            : "border-slate-700 focus:border-brand-cyan"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        tabIndex={-1}
                      >
                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Live matching status */}
                    {settingsConfirmPass && (
                      <div className="mt-1">
                        {settingsNewPass === settingsConfirmPass ? (
                          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> ✓ ਦੋਵੇਂ ਪਾਸਵਰਡ ਮੇਲ ਖਾਂਦੇ ਹਨ (Passwords match)
                          </p>
                        ) : (
                          <p className="text-[11px] text-red-400 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> ✗ ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ (Passwords do not match)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={
                    !settingsCurrentPass ||
                    (Boolean(settingsNewPass) &&
                      (settingsNewPass.length < 8 ||
                        settingsNewPass !== settingsConfirmPass ||
                        settingsNewPass === settingsCurrentPass))
                  }
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-5 text-xs shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4 mr-1.5" /> Save Updated Credentials (ਸੁਰੱਖਿਅਤ ਸੇਵ ਕਰੋ)
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* CLEAR ALL DATA CONFIRMATION MODAL */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-red-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-red-950/50 space-y-5 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setClearModalOpen(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 shadow-inner">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  ਕੀ ਤੁਸੀਂ ਪੱਕਾ ਸਾਰਾ ਡਾਟਾ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?
                </h3>
                <p className="text-xs text-red-400 font-semibold mt-0.5">
                  Confirm Clear All Analytics & Inquiries Data
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2.5 text-xs">
              <p className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
                ਹੇਠ ਲਿਖਿਆ ਸਾਰਾ ਰਿਕਾਰਡ 0 ਹੋ ਜਾਵੇਗਾ (Will be reset to 0):
              </p>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Globe className="h-3.5 w-3.5 text-brand-cyan" /> Views:
                  </span>
                  <span className="font-black text-white">{summary?.totalPageViews ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp:
                  </span>
                  <span className="font-black text-white">{summary?.totalWhatsAppClicks ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="h-3.5 w-3.5 text-sky-400" /> Calls:
                  </span>
                  <span className="font-black text-white">{summary?.totalCallClicks ?? 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-400" /> Questions:
                  </span>
                  <span className="font-black text-white">{inquiries.length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">ਸਲਾਹ (Recommended):</p>
                <p className="text-amber-200/90 leading-relaxed text-[11px]">
                  ਡਾਟਾ ਸਾਫ਼ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਐਕਸਲ/CSV ਬੈਕਅੱਪ ਫਾਈਲ ਡਾਊਨਲੋਡ ਕਰ ਲਵੋ ਤਾਂ ਜੋ ਤੁਹਾਡੇ ਜ਼ਰੂਰੀ ਗਾਹਕਾਂ ਦਾ ਰਿਕਾਰਡ ਸੁਰੱਖਿਅਤ ਰਹੇ।
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={exportDataAsCsv}
                className="w-full h-10 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download CSV Backup First (ਪਹਿਲਾਂ ਬੈਕਅੱਪ ਲਵੋ)</span>
              </Button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setClearModalOpen(false)}
                  className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs h-11 cursor-pointer"
                >
                  ਰੱਦ ਕਰੋ (Cancel)
                </Button>

                <Button
                  type="button"
                  onClick={handleClearAllData}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs h-11 flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>ਹਾਂ, ਸਾਫ਼ ਕਰੋ (Clear All)</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SUCCESS NOTIFICATION */}
      {clearSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-xl border border-emerald-500/40 bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl shadow-emerald-950/30 animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3 text-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold text-white">
              ਸਾਰਾ ਡਾਟਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸਾਫ਼ ਹੋ ਗਿਆ ਹੈ!
            </p>
            <p className="text-slate-400 text-[11px]">
              All views, WhatsApp leads, calls, and questions have been reset to 0.
            </p>
            <div className="pt-1.5 flex items-center gap-3">
              <button
                onClick={() => {
                  resetToDemoData();
                  loadData(timeRange);
                  setClearSuccessToast(false);
                }}
                className="text-brand-cyan hover:underline font-bold text-[11px] cursor-pointer"
              >
                + Restore Demo Data (ਨਮੂਨਾ ਡਾਟਾ ਮੁੜ ਲਿਆਓ)
              </button>
            </div>
          </div>
          <button
            onClick={() => setClearSuccessToast(false)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-400">
        <p>Daman Cyber Cafe Private Admin System · Rajpura, Punjab · Last Refreshed: {lastRefreshed.toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
