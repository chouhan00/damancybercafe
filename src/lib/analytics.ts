// Daman Cyber Cafe - Comprehensive Analytics & Event Tracking Engine

export type EventType =
  | "page_view"
  | "whatsapp_click"
  | "call_click"
  | "faq_view"
  | "faq_question_put"
  | "payment_click"
  | "status_change";

export type DeviceType = "Mobile" | "Desktop" | "Tablet";

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: string;
  source: string;
  label?: string;
  device: DeviceType;
  metadata?: {
    serviceName?: string;
    faqNum?: string;
    faqTitle?: string;
    questionText?: string;
    phone?: string;
    method?: string;
    url?: string;
    referrer?: string;
    [key: string]: unknown;
  };
}

export interface UserInquiry {
  id: string;
  timestamp: string;
  name?: string;
  phone?: string;
  question: string;
  category?: string;
  status: "new" | "in_progress" | "resolved";
  source: string;
  device: DeviceType;
}

const STORAGE_KEY_EVENTS = "daman_analytics_events_v2";
const STORAGE_KEY_INQUIRIES = "daman_user_inquiries_v2";
const STORAGE_KEY_VISITOR_ID = "daman_visitor_id";
const STORAGE_KEY_SESSION_ID = "daman_session_id";
const STORAGE_KEY_CLEARED = "daman_analytics_cleared_v2";
const STORAGE_KEY_SITE_STATUS = "daman_site_status_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export interface SiteStatus {
  isOnline: boolean;
  notice?: string;
  lastUpdated: string;
}

export function getSiteStatus(): SiteStatus {
  if (!isBrowser()) {
    return {
      isOnline: true,
      notice: "Online & Open for Online Forms, Printouts & Digital Services",
      lastUpdated: new Date().toISOString(),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SITE_STATUS);
    if (!raw) {
      const initial: SiteStatus = {
        isOnline: true,
        notice: "Online & Open for Online Forms, Printouts & Digital Services",
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_SITE_STATUS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.isOnline) {
      parsed.isOnline = true;
      localStorage.setItem(STORAGE_KEY_SITE_STATUS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return {
      isOnline: true,
      notice: "Online & Open for Online Forms, Printouts & Digital Services",
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function setSiteStatus(isOnline: boolean, notice?: string): SiteStatus {
  const status: SiteStatus = {
    isOnline,
    notice:
      notice !== undefined && notice.trim().length > 0
        ? notice.trim()
        : isOnline
        ? "Online & Open for Digital Services (ਦੁਕਾਨ ਖੁੱਲ੍ਹੀ ਹੈ)"
        : "Currently Offline / Closed (ਇਸ ਵੇਲੇ ਦੁਕਾਨ ਬੰਦ ਹੈ). You can still leave a message on WhatsApp anytime!",
    lastUpdated: new Date().toISOString(),
  };

  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEY_SITE_STATUS, JSON.stringify(status));
      window.dispatchEvent(new CustomEvent("daman_status_change", { detail: status }));
      trackEvent(
        "status_change",
        "admin_panel",
        `Website operational status set to ${isOnline ? "ONLINE" : "OFFLINE"}`
      );
    } catch (e) {
      console.error("Failed to save site status", e);
    }
  }

  return status;
}

export function getDeviceType(): DeviceType {
  if (!isBrowser()) return "Desktop";
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)/i.test(ua)) return "Mobile";
  return "Desktop";
}

export function getVisitorId(): string {
  if (!isBrowser()) return "srv_visitor";
  let id = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
  if (!id) {
    id = "vis_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY_VISITOR_ID, id);
  }
  return id;
}

export function getSessionId(): string {
  if (!isBrowser()) return "srv_session";
  try {
    if (typeof sessionStorage !== "undefined") {
      let id = sessionStorage.getItem(STORAGE_KEY_SESSION_ID);
      if (!id) {
        id = "ses_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
        sessionStorage.setItem(STORAGE_KEY_SESSION_ID, id);
      }
      return id;
    }
  } catch {}
  return "ses_fallback";
}

// Retrieve raw events - strictly 100% REAL visitor activity
export function getAllEvents(): AnalyticsEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify([]));
      return [];
    }
    const parsed: AnalyticsEvent[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Purge any fake seed events from previous version
    const realEvents = parsed.filter(
      (e) => e && e.id && !e.id.includes("seed")
    );
    if (realEvents.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(realEvents));
    }
    return realEvents;
  } catch (e) {
    console.error("Failed to load analytics events", e);
    return [];
  }
}

// Record an event
export function trackEvent(
  type: EventType,
  source: string,
  label?: string,
  metadata?: AnalyticsEvent["metadata"]
): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: "evt_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
    type,
    timestamp: new Date().toISOString(),
    source,
    label,
    device: getDeviceType(),
    metadata,
  };

  if (isBrowser()) {
    try {
      const current = getAllEvents();
      // Keep last 3000 events to manage storage comfortably
      const updated = [event, ...current].slice(0, 3000);
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));

      // Dispatch custom window event so open admin dashboards can reactively update
      window.dispatchEvent(new CustomEvent("daman_analytics_update", { detail: event }));
    } catch (e) {
      console.error("Failed to persist analytics event", e);
    }
  }

  return event;
}

// Quick tracking shortcuts
export function trackPageView(url = "/"): void {
  // Deduplicate rapid re-renders within 15 seconds for same session
  if (isBrowser()) {
    try {
      if (typeof sessionStorage !== "undefined") {
        const lastView = sessionStorage.getItem("daman_last_pv");
        const now = Date.now();
        if (lastView && now - parseInt(lastView, 10) < 15000) {
          return;
        }
        sessionStorage.setItem("daman_last_pv", now.toString());
      }
    } catch {}
  }

  trackEvent("page_view", "navigation", "Page view", {
    url,
    referrer: isBrowser() ? (typeof document !== "undefined" ? document.referrer || "direct" : "direct") : "direct",
  });
}

export function trackWhatsAppClick(source: string, serviceName?: string, customText?: string): void {
  trackEvent("whatsapp_click", source, `WhatsApp: ${serviceName || "General Inquiry"}`, {
    serviceName,
    text: customText,
  });
}

export function trackCallClick(source: string, serviceName?: string): void {
  trackEvent("call_click", source, `Phone Call: ${serviceName || "General"}`, {
    serviceName,
  });
}

export function trackFaqView(faqNum: string, faqTitle: string): void {
  trackEvent("faq_view", "faq_accordion", `Viewed FAQ #${faqNum}: ${faqTitle}`, {
    faqNum,
    faqTitle,
  });
}

export function trackPaymentClick(method: string): void {
  trackEvent("payment_click", "payment_modal", `Payment Method Selected: ${method}`, {
    method,
  });
}

// Inquiries / Questions Put Management - strictly 100% REAL visitor questions
export function getAllInquiries(): UserInquiry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify([]));
      return [];
    }
    const parsed: UserInquiry[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Purge any fake seed questions
    const realInquiries = parsed.filter(
      (q) => q && q.id && !q.id.includes("seed")
    );
    if (realInquiries.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(realInquiries));
    }
    return realInquiries;
  } catch (e) {
    console.error("Failed to load inquiries", e);
    return [];
  }
}

export function submitQuestion(
  question: string,
  options?: { phone?: string; name?: string; category?: string; source?: string }
): UserInquiry {
  const inquiry: UserInquiry = {
    id: "inq_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    question: question.trim(),
    name: options?.name?.trim(),
    phone: options?.phone?.trim(),
    category: options?.category || "General Inquiry",
    status: "new",
    source: options?.source || "faq_question_box",
    device: getDeviceType(),
  };

  if (isBrowser()) {
    try {
      const current = getAllInquiries();
      const updated = [inquiry, ...current];
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));

      // Also log as an analytics event
      trackEvent("faq_question_put", inquiry.source, `Question Asked: ${inquiry.question.slice(0, 40)}...`, {
        questionText: inquiry.question,
        phone: inquiry.phone,
        category: inquiry.category,
      });

      window.dispatchEvent(new CustomEvent("daman_inquiries_update", { detail: inquiry }));
    } catch (e) {
      console.error("Failed to save inquiry", e);
    }
  }

  return inquiry;
}

export function updateInquiryStatus(id: string, status: UserInquiry["status"]): void {
  if (!isBrowser()) return;
  try {
    const current = getAllInquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("daman_inquiries_update"));
  } catch (e) {
    console.error("Failed to update inquiry status", e);
  }
}

export function deleteInquiry(id: string): void {
  if (!isBrowser()) return;
  try {
    const current = getAllInquiries();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("daman_inquiries_update"));
  } catch (e) {
    console.error("Failed to delete inquiry", e);
  }
}

// Analytics summary calculation for date ranges
export type TimeRange = "today" | "7d" | "30d" | "all";

export interface AnalyticsSummary {
  timeRange: TimeRange;
  totalPageViews: number;
  uniqueVisitors: number;
  totalWhatsAppClicks: number;
  totalCallClicks: number;
  totalQuestionsPut: number;
  totalPaymentClicks: number;
  totalConversions: number;
  conversionRate: number;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  dailyTrend: Array<{
    date: string;
    label: string;
    views: number;
    whatsapp: number;
    calls: number;
    questions: number;
  }>;
  sourceBreakdown: Array<{ source: string; count: number; percentage: number }>;
  topServices: Array<{ service: string; count: number }>;
  faqViewsBreakdown: Array<{ faqNum: string; faqTitle: string; count: number }>;
  recentEvents: AnalyticsEvent[];
}

export function getAnalyticsSummary(timeRange: TimeRange = "7d"): AnalyticsSummary {
  const allEvents = getAllEvents();
  const allInquiries = getAllInquiries();
  const now = new Date();

  // Determine cutoff date
  let cutoffDate: Date | null = null;
  if (timeRange === "today") {
    cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (timeRange === "7d") {
    cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeRange === "30d") {
    cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const events = cutoffDate
    ? allEvents.filter((e) => new Date(e.timestamp) >= cutoffDate!)
    : allEvents;

  const inquiries = cutoffDate
    ? allInquiries.filter((q) => new Date(q.timestamp) >= cutoffDate!)
    : allInquiries;

  let pageViews = 0;
  let whatsappClicks = 0;
  let callClicks = 0;
  let paymentClicks = 0;
  let faqViews = 0;

  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
  const sourceMap = new Map<string, number>();
  const servicesMap = new Map<string, number>();
  const faqMap = new Map<string, { title: string; count: number }>();
  const dayBuckets = new Map<
    string,
    { views: number; whatsapp: number; calls: number; questions: number; dateStr: string }
  >();

  // Pre-seed daily buckets for smooth chart
  const numDays = timeRange === "today" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 14;
  for (let d = numDays - 1; d >= 0; d--) {
    const dObj = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const key = dObj.toISOString().split("T")[0];
    const displayLabel = dObj.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      weekday: timeRange === "today" || timeRange === "7d" ? "short" : undefined,
    });
    dayBuckets.set(key, { views: 0, whatsapp: 0, calls: 0, questions: 0, dateStr: displayLabel });
  }

  events.forEach((e) => {
    // Device counts
    if (e.device === "Mobile") deviceCounts.mobile++;
    else if (e.device === "Tablet") deviceCounts.tablet++;
    else deviceCounts.desktop++;

    // Day bucket key
    const dayKey = e.timestamp.split("T")[0];
    const bucket = dayBuckets.get(dayKey);

    switch (e.type) {
      case "page_view":
        pageViews++;
        if (bucket) bucket.views++;
        break;
      case "whatsapp_click":
        whatsappClicks++;
        if (bucket) bucket.whatsapp++;
        const waSrc = e.source || "General";
        sourceMap.set(waSrc, (sourceMap.get(waSrc) || 0) + 1);
        if (e.metadata?.serviceName) {
          servicesMap.set(e.metadata.serviceName, (servicesMap.get(e.metadata.serviceName) || 0) + 1);
        }
        break;
      case "call_click":
        callClicks++;
        if (bucket) bucket.calls++;
        const callSrc = e.source || "Direct";
        sourceMap.set(`Call (${callSrc})`, (sourceMap.get(`Call (${callSrc})`) || 0) + 1);
        break;
      case "payment_click":
        paymentClicks++;
        break;
      case "faq_view":
        faqViews++;
        const faqNum = e.metadata?.faqNum || "General";
        const faqTitle = e.metadata?.faqTitle || "FAQ Item";
        const prev = faqMap.get(faqNum) || { title: faqTitle, count: 0 };
        faqMap.set(faqNum, { title: prev.title, count: prev.count + 1 });
        break;
    }
  });

  // Count questions in daily buckets
  inquiries.forEach((q) => {
    const dayKey = q.timestamp.split("T")[0];
    const bucket = dayBuckets.get(dayKey);
    if (bucket) bucket.questions++;
  });

  const totalQuestions = inquiries.length;
  const totalConversions = whatsappClicks + callClicks + totalQuestions;
  // Estimate unique visitors
  const uniqueVisitors = Math.max(Math.round(pageViews * 0.68), totalConversions, 1);
  const conversionRate = pageViews > 0 ? Number(((totalConversions / pageViews) * 100).toFixed(1)) : 0;

  // Convert daily trend map to array
  const dailyTrend = Array.from(dayBuckets.entries()).map(([dateKey, data]) => ({
    date: dateKey,
    label: data.dateStr,
    views: data.views,
    whatsapp: data.whatsapp,
    calls: data.calls,
    questions: data.questions,
  }));

  // Top services sorted
  const topServices = Array.from(servicesMap.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Top FAQs sorted
  const faqViewsBreakdown = Array.from(faqMap.entries())
    .map(([faqNum, val]) => ({ faqNum, faqTitle: val.title, count: val.count }))
    .sort((a, b) => b.count - a.count);

  // Sources sorted
  const totalSources = Array.from(sourceMap.values()).reduce((a, b) => a + b, 0) || 1;
  const sourceBreakdown = Array.from(sourceMap.entries())
    .map(([source, count]) => ({
      source: formatSourceLabel(source),
      count,
      percentage: Math.round((count / totalSources) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    timeRange,
    totalPageViews: pageViews,
    uniqueVisitors,
    totalWhatsAppClicks: whatsappClicks,
    totalCallClicks: callClicks,
    totalQuestionsPut: totalQuestions,
    totalPaymentClicks: paymentClicks,
    totalConversions,
    conversionRate,
    deviceBreakdown: deviceCounts,
    dailyTrend,
    sourceBreakdown,
    topServices,
    faqViewsBreakdown,
    recentEvents: events.slice(0, 40),
  };
}

function formatSourceLabel(source: string): string {
  const map: Record<string, string> = {
    hero: "Hero Section",
    header: "Top Header",
    service_card: "Services Cards",
    faq: "FAQ Section",
    footer: "Footer",
    footer_banner: "Footer Fast Print Banner",
    mobile_bar: "Mobile Bottom Floating Bar",
    inquiry_box: "Quick Inquiry Box",
    whatsapp_float: "WhatsApp Action",
  };
  return map[source] || source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Export functions for CSV & JSON
export function exportDataAsCsv(): void {
  if (!isBrowser()) return;
  const events = getAllEvents();
  const inquiries = getAllInquiries();

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "=== DAMAN CYBER CAFE - ACTIVITY EVENTS LOG ===\n";
  csvContent += "ID,Type,Date Time,Source,Device,Label,Service/Context\n";

  events.forEach((e) => {
    const safeLabel = (e.label || "").replace(/,/g, " ");
    const safeCtx = (e.metadata?.serviceName || e.metadata?.questionText || "").replace(/,/g, " ");
    csvContent += `${e.id},${e.type},"${new Date(e.timestamp).toLocaleString("en-IN")}",${e.source},${e.device},"${safeLabel}","${safeCtx}"\n`;
  });

  csvContent += "\n=== QUESTIONS & INQUIRIES PUT BY USERS ===\n";
  csvContent += "ID,Date Time,Question,Category,Phone,Status,Device\n";

  inquiries.forEach((q) => {
    const safeQ = q.question.replace(/,/g, " ").replace(/\n/g, " ");
    csvContent += `${q.id},"${new Date(q.timestamp).toLocaleString("en-IN")}","${safeQ}",${q.category || "General"},${q.phone || "N/A"},${q.status},${q.device}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `daman_cyber_cafe_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportDataAsJson(): void {
  if (!isBrowser()) return;
  const data = {
    exportedAt: new Date().toISOString(),
    site: "Daman Cyber Cafe, Rajpura",
    events: getAllEvents(),
    inquiries: getAllInquiries(),
  };

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", `daman_cyber_cafe_data_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function clearAnalyticsData(): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY_CLEARED, "true");
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("daman_analytics_update"));
  window.dispatchEvent(new CustomEvent("daman_inquiries_update"));
}

export function resetToDemoData(): void {
  // Purposely cleared to 0 as owner requested strictly REAL data only
  clearAnalyticsData();
}
