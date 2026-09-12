import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  CreditCard,
  FileText,
  Headphones,
  HelpCircle,
  Laptop,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquarePlus,
  MonitorSmartphone,
  Phone,
  Printer,
  QrCode,
  ScanLine,
  Send,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";

import workstationImage from "@/assets/daman-workstation.jpg";
import documentImage from "@/assets/document-services.jpg";
import qrScannerImage from "@/assets/daman-qr-scanner.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  trackPageView,
  trackWhatsAppClick,
  trackCallClick,
  trackFaqView,
  submitQuestion,
  trackPaymentClick,
  getSiteStatus,
  type SiteStatus,
} from "@/lib/analytics";

const contactDetails = {
  phone: "+91 97792 23042",
  phoneRaw: "+919779223042",
  whatsapp: "+91 97792 23042",
  whatsappUrl:
    "https://wa.me/919779223042?text=Hello%20Daman%20Cyber%20Cafe%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.",
  address: "FHCW+9FX Rajpura, Punjab",
  plusCode: "FHCW+9FX",
  hours: "9:00 AM – 7:00 PM (Daily)",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=FHCW%2B9FX+Rajpura%2C+Punjab",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=FHCW%2B9FX+Rajpura%2C+Punjab",
  embedMapUrl: "https://maps.google.com/maps?q=FHCW%2B9FX%2C+Rajpura%2C+Punjab&t=&z=16&ie=UTF8&iwloc=&output=embed",
  upiId: "rajputdaman826@oksbi",
  upiName: "Daman Rajput",
  upiPhone: "9779223042",
};


const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const services = [
  {
    icon: MonitorSmartphone,
    title: "Online Services",
    description: "Guidance with everyday online forms and digital service requirements.",
  },
  {
    icon: FileText,
    title: "Document Services",
    description: "Digital document preparation, printing and related assistance.",
  },
  {
    icon: Copy,
    title: "Photocopying",
    description: "Convenient document photocopying for everyday personal and work needs.",
  },
  {
    icon: ScanLine,
    title: "Printing & Scanning",
    description: "Professional support for clear prints and digital document scans.",
  },
  {
    icon: Headphones,
    title: "Digital Assistance",
    description: "Straightforward help with common online and computer-related tasks.",
  },
  {
    icon: Laptop,
    title: "Other Online Services",
    description: "Ask us about additional digital services available at the shop.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Convenient",
    description: "Handle multiple digital and document-related needs in one place.",
  },
  {
    icon: Zap,
    title: "Technology-Enabled",
    description: "Modern equipment supports an efficient, dependable service experience.",
  },
  {
    icon: MapPin,
    title: "Local & Accessible",
    description: "Conveniently serving students, families and businesses in Rajpura.",
  },
  {
    icon: ShieldCheck,
    title: "Customer-Focused",
    description: "Clear assistance that keeps every digital task easy to understand.",
  },
];

interface FaqItem {
  num: string;
  category: string;
  question: string;
  punjabiTitle: string;
  answer: string;
  highlights: string[];
  actionType?: "whatsapp" | "payment";
  actionText?: string;
}

const faqs: FaqItem[] = [
  {
    num: "01",
    category: "Online Forms & Govt Jobs",
    question: "Which government job, competitive exam, and college admission forms can be filled here?",
    punjabiTitle: "ਕਿਹੜੇ-ਕਿਹੜੇ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ, ਇਮਤਿਹਾਨਾਂ ਅਤੇ ਕਾਲਜ ਦਾਖਲਾ ਫਾਰਮ ਭਰੇ ਜਾਂਦੇ ਹਨ?",
    answer:
      "We provide 100% accurate online application form submission with precision document & photo resizing according to official notification guidelines. We handle Punjab Police, SSC (CGL, CHSL, MTS, GD), Railway (RRB), Army Agniveer, Banking (IBPS, SBI), UGC-NET, NEET, CTET / PSTET, State & Central Scholarship portals, and College/University Admissions. We also provide instant Admit Card downloads and Result printouts.",
    highlights: [
      "Punjab Police, SSC & Railway Forms",
      "Army Agniveer & Banking (IBPS, SBI)",
      "College Admissions & Scholarships",
      "Official Photo & Signature Resizing",
    ],
    actionType: "whatsapp",
    actionText: "Inquire About a Form on WhatsApp",
  },
  {
    num: "02",
    category: "Checklist & Requirements",
    question: "What original documents or details should I bring when visiting for form filling?",
    punjabiTitle: "ਫਾਰਮ ਜਾਂ ਸਰਟੀਫਿਕੇਟ ਅਪਲਾਈ ਕਰਨ ਲਈ ਨਾਲ ਕੀ-ਕੀ ਦਸਤਾਵੇਜ਼ ਲੈ ਕੇ ਆਉਣੇ ਚਾਹੀਦੇ ਹਨ?",
    answer:
      "For error-free online applications or certificate services, please carry: (1) Original Aadhaar Card, (2) Educational Marksheets & Certificates (10th, 12th, Degree), (3) Recent passport-size photograph & signature sample, (4) Caste / Category / Income Certificate (if applicable), and (5) The active mobile phone registered with your Aadhaar for instant OTP verification. Digital copies in a pen drive or on WhatsApp are also welcome.",
    highlights: [
      "Original Aadhaar & Mobile for OTP",
      "Educational Marksheets & Certificates",
      "Passport Photo & Sign Sample",
      "Pen Drive / WhatsApp PDFs Welcome",
    ],
  },
  {
    num: "03",
    category: "Fast WhatsApp Printing",
    question: "Can I send PDFs or photos on WhatsApp and collect urgent printouts directly?",
    punjabiTitle: "ਕੀ ਮੈਂ ਵਟਸਐਪ 'ਤੇ PDF ਜਾਂ ਫਾਈਲ ਭੇਜ ਕੇ ਤੁਰੰਤ ਪ੍ਰਿੰਟ ਕਰਵਾ ਸਕਦਾ ਹਾਂ?",
    answer:
      "Yes, absolutely! You can send your documents, PDF files, college assignments, resume, flight/train tickets, or photos directly to our official WhatsApp number (+91 97792 23042). We will have your crisp, high-definition laser prints ready when you arrive at the shop, saving your valuable time and avoiding queues.",
    highlights: [
      "Direct WhatsApp to Print: +91 97792 23042",
      "Laser B&W & Vivid Color Prints",
      "Ready Before You Arrive",
      "100% Confidential & Secure Handling",
    ],
    actionType: "whatsapp",
    actionText: "Send Document on WhatsApp Now",
  },
  {
    num: "04",
    category: "Photocopy, Lamination & Studio",
    question: "Do you provide urgent color photocopy, lamination, and passport photos?",
    punjabiTitle: "ਕੀ ਇੱਥੇ ਕਲਰ ਫੋਟੋਸਟੈਟ, ਲੈਮੀਨੇਸ਼ਨ ਅਤੇ ਤੁਰੰਤ ਪਾਸਪੋਰਟ ਫੋਟੋਜ਼ ਮਿਲਦੀਆਂ ਹਨ?",
    answer:
      "Yes! We offer instant heavy-duty thermal lamination (for marksheets, Aadhaar cards, driving licenses, and certificates), crystal-clear black & white and vivid color photocopies, high-resolution flatbed scanning to PDF, and urgent 5-minute passport-size photos with official white or blue backgrounds suitable for government submissions.",
    highlights: [
      "5-Minute Instant Passport Photos",
      "Heavy-Duty Thermal Lamination",
      "High-Resolution Color Photocopies",
      "Flatbed Scanning to Clean PDF",
    ],
  },
  {
    num: "05",
    category: "Shop Timings & Payments",
    question: "What are your shop opening hours and accepted payment methods?",
    punjabiTitle: "ਸਾਈਬਰ ਕੈਫੇ ਦੇ ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ ਕੀ ਹੈ ਅਤੇ ਕਿਹੜੇ ਪੇਮੈਂਟ ਤਰੀਕੇ ਚੱਲਦੇ ਹਨ?",
    answer:
      "Daman Cyber Cafe is open 7 days a week from 9:00 AM to 7:00 PM (Daily). We accept all forms of payment including Cash, Google Pay, PhonePe, Paytm, and any UPI app via our official UPI ID (rajputdaman826@oksbi). We also have an instant QR standee scanner at our counter for quick contactless payments.",
    highlights: [
      "Open 7 Days: 9:00 AM – 7:00 PM Daily",
      "Google Pay, PhonePe & Paytm Accepted",
      "Official UPI: rajputdaman826@oksbi",
      "Cash & Contactless QR Scanner Standee",
    ],
    actionType: "payment",
    actionText: "Open UPI Payment Scanner",
  },
];

function AnchorButton({
  href,
  children,
  variant = "default",
  className,
  label,
  target,
  rel,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  label?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      asChild
      variant={variant}
      size="lg"
      className={cn(
        "group h-12 px-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95",
        className,
      )}
    >
      <a href={href} aria-label={label} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    </Button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  const serviceWaUrl = `https://wa.me/919779223042?text=${encodeURIComponent(
    `Hello Daman Cyber Cafe, I would like to inquire about "${title}".`
  )}`;

  return (
    <article className="service-card reveal group flex flex-col justify-between">
      <div>
        <div className="icon-box transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <a
          href={serviceWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("service_card", title)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
        >
          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
          <span>Ask on WhatsApp</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
        </a>
        <a
          href={`tel:${contactDetails.phoneRaw}`}
          onClick={() => trackCallClick("service_card", title)}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          title={`Call about ${title}`}
        >
          <Phone className="h-3 w-3" />
          <span>Call</span>
        </a>
      </div>
    </article>
  );
}

export function DamanCyberCafe() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"gpay" | "phonepe" | "paytm" | "cash" | "upi">("upi");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showOriginalScanner, setShowOriginalScanner] = useState(true);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  // Ask Question Modal State
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askQuestionText, setAskQuestionText] = useState("");
  const [askName, setAskName] = useState("");
  const [askPhone, setAskPhone] = useState("");
  const [askCategory, setAskCategory] = useState("Online Forms & Govt Jobs");
  const [askSubmitted, setAskSubmitted] = useState(false);

  // Operational Online / Offline Status
  const [siteStatus, setSiteStatusState] = useState<SiteStatus>(() => getSiteStatus());
  const [viewCatalogAnyway, setViewCatalogAnyway] = useState(false);

  useEffect(() => {
    trackPageView("/");

    const handleStatusSync = () => {
      const cur = getSiteStatus();
      setSiteStatusState(cur);
      if (cur.isOnline) {
        setViewCatalogAnyway(false);
      }
    };

    window.addEventListener("daman_status_change", handleStatusSync);
    window.addEventListener("storage", handleStatusSync);
    return () => {
      window.removeEventListener("daman_status_change", handleStatusSync);
      window.removeEventListener("storage", handleStatusSync);
    };
  }, []);

  const toggleFaq = (index: number) => {
    const isOpening = !openFaqIndices.includes(index);
    if (isOpening && faqs[index]) {
      trackFaqView(faqs[index].num, faqs[index].question);
    }
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleExpandAllFaqs = () => {
    if (openFaqIndices.length === faqs.length) {
      setOpenFaqIndices([]);
    } else {
      faqs.forEach((f) => trackFaqView(f.num, f.question));
      setOpenFaqIndices(faqs.map((_, i) => i));
    }
  };

  const upiPayee = contactDetails.upiId;
  const upiName = contactDetails.upiName;
  const upiUniversalUrl = `upi://pay?pa=${upiPayee}&pn=${encodeURIComponent(upiName)}&cu=INR`;
  const gpayUrl = `tez://upi/pay?pa=${upiPayee}&pn=${encodeURIComponent(upiName)}&cu=INR`;
  const phonepeUrl = `phonepe://pay?pa=${upiPayee}&pn=${encodeURIComponent(upiName)}&cu=INR`;
  const paytmUrl = `paytmmp://pay?pa=${upiPayee}&pn=${encodeURIComponent(upiName)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUniversalUrl)}`;

  const handleOpenPayment = (method: "gpay" | "phonepe" | "paytm" | "cash" | "upi") => {
    trackPaymentClick(method);
    setSelectedPaymentMethod(method);
    setPaymentModalOpen(true);

    if (method !== "cash" && typeof window !== "undefined") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        let targetUrl = upiUniversalUrl;
        if (method === "gpay") targetUrl = gpayUrl;
        else if (method === "phonepe") targetUrl = phonepeUrl;
        else if (method === "paytm") targetUrl = paytmUrl;

        window.location.href = targetUrl;
        setTimeout(() => {
          if (document.hasFocus()) {
            window.location.href = upiUniversalUrl;
          }
        }, 700);
      }
    }
  };

  const handleCopyUpi = () => {
    trackPaymentClick("copy_upi_id");
    navigator.clipboard.writeText(contactDetails.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inquiryText.trim();
    if (query) {
      submitQuestion(query, { source: "quick_inquiry_box" });
      trackWhatsAppClick("inquiry_box", "Quick Online Inquiry", query);
    } else {
      trackWhatsAppClick("inquiry_box", "General Inquiry");
    }
    const fullText = query
      ? `Hello Daman Cyber Cafe, ${query}`
      : "Hello Daman Cyber Cafe, I would like to inquire about your services.";
    window.open(`https://wa.me/919779223042?text=${encodeURIComponent(fullText)}`, "_blank", "noopener,noreferrer");
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestionText.trim()) return;
    submitQuestion(askQuestionText, {
      name: askName,
      phone: askPhone,
      category: askCategory,
      source: "faq_ask_modal",
    });
    setAskSubmitted(true);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // WHEN SITE IS SET TO OFFLINE: Render Dedicated Shop Closed / Offline Mode Screen
  if (!siteStatus.isOnline && !viewCatalogAnyway) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-cyan selection:text-slate-950 relative overflow-hidden">
        {/* Ambient lighting effects */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur px-4 py-3.5 relative z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-amber-600 text-white font-black text-sm shadow-md">
                DC
              </span>
              <div>
                <span className="block font-black text-white text-base tracking-tight">DAMAN CYBER CAFE</span>
                <span className="block text-xs text-slate-400">Digital Services · Rajpura, Punjab</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                <span>Closed / ਆਫਲਾਈਨ</span>
              </span>
            </div>
          </div>
        </header>

        {/* Center Closed Hero Card */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 sm:py-16 flex flex-col items-center justify-center text-center relative z-10">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-400 mb-6 shadow-2xl shadow-red-950/50">
            <Clock3 className="h-10 w-10 text-amber-400 animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/40 px-3.5 py-1 text-xs font-extrabold text-red-300 uppercase tracking-wider mb-4">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Shop & Website Currently Offline · ਇਸ ਵੇਲੇ ਦੁਕਾਨ ਬੰਦ ਹੈ
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-xl">
            ਦਮਨ ਸਾਈਬਰ ਕੈਫੇ ਇਸ ਵੇਲੇ ਬੰਦ ਹੈ
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-300 font-semibold">
            Daman Cyber Cafe is Currently Closed / Offline
          </p>

          {/* Owner Notice Box */}
          <div className="mt-6 w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-red-500/10 p-5 sm:p-6 text-left shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              ਮਾਲਕ ਵੱਲੋਂ ਸੁਨੇਹਾ / Owner Notice:
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {siteStatus.notice || "ਅਸੀਂ ਇਸ ਵੇਲੇ ਆਫਲਾਈਨ ਹਾਂ। ਪਰ ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਵਟਸਐਪ 'ਤੇ ਸੁਨੇਹਾ ਭੇਜ ਸਕਦੇ ਹੋ ਜਾਂ ਫਾਈਲਾਂ ਭੇਜ ਸਕਦੇ ਹੋ, ਦੁਕਾਨ ਖੁੱਲ੍ਹਦੇ ਹੀ ਤੁਹਾਡਾ ਕੰਮ ਕਰ ਦਿੱਤਾ ਜਾਵੇਗਾ!"}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-brand-cyan" />
                ਦੁਕਾਨ ਦਾ ਸਮਾਂ: <strong>9:00 AM – 7:00 PM (Daily)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-cyan" />
                {contactDetails.address}
              </span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Phone */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            <a
              href={contactDetails.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("offline_screen", "Offline Screen WhatsApp")}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold px-6 py-4 shadow-xl hover:shadow-green-900/40 transition-all hover:scale-[1.02] active:scale-95 text-sm sm:text-base btn-whatsapp-glow cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" />
              <span>ਵਟਸਐਪ 'ਤੇ ਕੰਮ ਭੇਜੋ (WhatsApp)</span>
            </a>

            <a
              href={`tel:${contactDetails.phoneRaw}`}
              onClick={() => trackCallClick("offline_screen", "Offline Screen Call")}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 transition-all hover:scale-[1.02] active:scale-95 text-sm sm:text-base cursor-pointer"
            >
              <Phone className="h-5 w-5 text-sky-400" />
              <span>ਫੋਨ ਕਾਲ ਕਰੋ ({contactDetails.phone})</span>
            </a>
          </div>

          {/* Option to still view services */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 text-xs text-slate-400">
            <span>ਕੀ ਤੁਸੀਂ ਸਾਡੀਆਂ ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਤੇ ਰੇਟ ਦੇਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?</span>
            <button
              type="button"
              onClick={() => setViewCatalogAnyway(true)}
              className="font-bold text-brand-cyan hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>ਸਰਵਿਸਾਂ ਦੀ ਸੂਚੀ ਵੇਖੋ (View Services)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-500 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <p>© 2026 Daman Cyber Cafe, Rajpura. All rights reserved.</p>
            <p className="text-slate-500">Rajpura, Punjab · +91 97792 23042</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Dynamic Offline Alert Banner (Shown when admin toggles site Offline) */}
      {!siteStatus.isOnline && (
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 px-4 py-2.5 text-white text-center text-xs sm:text-sm font-semibold shadow-md animate-in slide-in-from-top-2 duration-300">
          <div className="site-container flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-yellow-200 border border-yellow-300/30">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
              Offline / ਇਸ ਵੇਲੇ ਦੁਕਾਨ ਬੰਦ ਹੈ
            </span>
            <span className="text-white/95 font-medium">{siteStatus.notice}</span>
            <a
              href={contactDetails.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("offline_banner", "Offline Banner WhatsApp")}
              className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-900 px-3 py-1 text-xs font-bold hover:bg-slate-100 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" /> Leave WhatsApp Message
            </a>
            <button
              type="button"
              onClick={() => setViewCatalogAnyway(false)}
              className="text-xs text-yellow-200 underline hover:text-white cursor-pointer ml-1"
            >
              Show Closed Screen
            </button>
          </div>
        </div>
      )}

      {/* Top Address & Live Status Strip */}
      <div className="bg-brand-deep px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
          {/* Real-time Status Indicator */}
          {siteStatus.isOnline ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Open Now · ਖੁੱਲ੍ਹਾ ਹੈ
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/25 border border-red-400/50 px-2.5 py-0.5 text-[11px] font-bold text-amber-200">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Offline · ਬੰਦ ਹੈ
            </span>
          )}

          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-cyan" />
            {contactDetails.address}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-brand-cyan" />
            Open: {contactDetails.hours}
          </span>
          <a
            href={`tel:${contactDetails.phoneRaw}`}
            onClick={() => trackCallClick("top_bar", "Top Bar Phone")}
            className="inline-flex items-center gap-1.5 hover:text-brand-cyan transition-colors font-semibold"
          >
            <Phone className="h-3.5 w-3.5 text-brand-cyan" />
            {contactDetails.phone}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur transition-all duration-300",
          isScrolled ? "shadow-sm" : "",
        )}
      >
        <div className={cn("site-container flex items-center justify-between transition-all", isScrolled ? "h-16" : "h-20")}>
          <a href="#home" className="flex min-w-0 items-center gap-3" aria-label="Daman Cyber Cafe home">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-sm font-extrabold text-primary-foreground">
              DC
            </span>
            <span className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="block truncate text-sm font-extrabold text-foreground sm:text-base">DAMAN CYBER CAFE</span>
                {siteStatus.isOnline ? (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Offline
                  </span>
                )}
              </div>
              <span className="block truncate text-xs text-muted-foreground">Digital Services · Rajpura</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="group h-11 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <a href={`tel:${contactDetails.phoneRaw}`} onClick={() => trackCallClick("header", "Header Call Button")}>
                <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call Us
              </a>
            </Button>
            <AnchorButton
              href={contactDetails.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("header", "Header WhatsApp Button")}
              className="h-11 bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-sm btn-whatsapp-glow"
            >
              <MessageCircle className="transition-transform duration-300 group-hover:scale-115" /> WhatsApp Us
            </AnchorButton>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 transition-transform duration-200 hover:scale-105 active:scale-95 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen ? (
          <nav className="border-t border-border bg-background px-4 py-4 lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto flex max-w-7xl flex-col">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="border-b border-border py-3 text-base font-medium text-foreground transition-colors hover:text-primary last:border-0"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="group h-11 w-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <a href={`tel:${contactDetails.phoneRaw}`} onClick={() => trackCallClick("mobile_nav", "Mobile Nav Call")}>
                    <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call
                  </a>
                </Button>
                <AnchorButton
                  href={contactDetails.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("mobile_nav", "Mobile Nav WhatsApp")}
                  className="h-11 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-none btn-whatsapp-glow shadow-sm"
                  label="Chat on WhatsApp"
                >
                  <MessageCircle className="transition-transform duration-300 group-hover:scale-115" /> WhatsApp
                </AnchorButton>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <section id="home" className="relative scroll-mt-28 border-b border-border bg-hero-wash">
          <div className="site-container grid min-h-[42rem] items-center gap-12 py-14 sm:min-h-[46rem] lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <div className="relative z-10 max-w-2xl reveal">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-brand-cyan" />
                DIGITAL SERVICES · RAJPURA
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-brand-deep sm:text-5xl lg:text-6xl xl:text-7xl">
                Your Local Digital Service Centre in Rajpura
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Online services, document support, photocopying and everyday digital assistance—conveniently available under one roof.
              </p>
              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                <AnchorButton
                  href={contactDetails.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("hero", "Hero WhatsApp Button")}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-md btn-whatsapp-glow"
                  label="Chat on WhatsApp"
                >
                  <MessageCircle className="transition-transform duration-300 group-hover:scale-115" /> WhatsApp Us
                </AnchorButton>
                <AnchorButton
                  href={`tel:${contactDetails.phoneRaw}`}
                  variant="secondary"
                  onClick={() => trackCallClick("hero", "Hero Call Button")}
                  className="w-full sm:w-auto group shadow-xs"
                >
                  <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call {contactDetails.phone}
                </AnchorButton>
                <AnchorButton
                  href={contactDetails.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="w-full sm:w-auto group shadow-xs"
                >
                  <MapPin className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-1" /> Get Directions
                </AnchorButton>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
                {["Online Services", "Document Support", "Photocopying", "Modern Technology"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-xs font-semibold text-foreground sm:text-sm">
                    <Check className="h-4 w-4 shrink-0 text-brand-cyan-strong" /> {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl reveal lg:ml-auto">
              <div className="absolute -left-5 top-12 hidden h-32 w-1 bg-brand-cyan lg:block" />
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-image">
                <img
                  src={workstationImage}
                  alt="Modern computer, scanner and printer workstation in a digital service centre"
                  width={1408}
                  height={1056}
                  fetchPriority="high"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-4 right-4 grid grid-cols-[auto_1fr] items-center gap-3 rounded-md border border-border bg-background p-4 shadow-lg sm:left-auto sm:right-6 sm:w-72">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-accent text-accent-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Clear, practical support</p>
                  <p className="text-xs text-muted-foreground">For everyday digital work</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 py-20 sm:py-28">
          <div className="site-container">
            <SectionHeading
              eyebrow="What we help with"
              title="Digital Services, Made Simple"
              description="Get straightforward assistance with everyday online and document-related requirements, right here in Rajpura."
              align="center"
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>

        <section id="why-us" className="scroll-mt-24 bg-brand-deep py-20 text-primary-foreground sm:py-28">
          <div className="site-container">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div className="reveal">
                <p className="section-eyebrow section-eyebrow-dark">Why Daman Cyber Cafe</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  A Smarter Way to Handle Everyday Digital Work
                </h2>
                <p className="mt-5 max-w-lg leading-7 text-primary-foreground/70">
                  Professional tools, clear guidance and useful services—without unnecessary complexity.
                </p>
              </div>
              <div className="grid gap-px overflow-hidden rounded-lg border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-2 reveal">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="bg-brand-deep p-6 sm:p-8">
                    <Icon className="h-6 w-6 text-brand-cyan" />
                    <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-primary-foreground/65">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="site-container">
            <SectionHeading
              eyebrow="Simple process"
              title="From Requirement to Done"
              description="A clear three-step experience designed to keep your visit straightforward."
              align="center"
            />
            <ol className="relative mt-14 grid gap-8 lg:grid-cols-3 lg:gap-10">
              <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-border lg:block" />
              {[
                ["01", "Tell Us What You Need", "Explain the online or document service you require."],
                ["02", "Get Assistance", "We help with the required digital process or document task."],
                ["03", "Get It Done", "Complete your requirement conveniently and efficiently."],
              ].map(([number, title, description]) => (
                <li key={number} className="relative grid grid-cols-[3.5rem_1fr] gap-5 lg:block lg:text-center reveal">
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-primary bg-background text-sm font-extrabold text-primary lg:mx-auto">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground lg:mt-6">{title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-12 flex justify-center reveal">
              <AnchorButton
                href={contactDetails.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("process_section", "Start on WhatsApp")}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-md btn-whatsapp-glow"
              >
                <MessageCircle className="h-4 w-4" /> Start on WhatsApp
              </AnchorButton>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 sm:py-28">
          <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-image reveal">
              <img
                src={documentImage}
                alt="Professional printer and documents ready for scanning and copying"
                width={1200}
                height={912}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="reveal">
              <SectionHeading
                eyebrow="Document support"
                title="Documents Ready When You Need Them"
                description="Practical support for the paper and digital documents you use every day. Ask us about your exact requirement before visiting."
              />
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {["Photocopying", "Printing", "Scanning", "Digital document assistance"].map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <AnchorButton
                  href={`https://wa.me/919779223042?text=${encodeURIComponent(
                    "Hello Daman Cyber Cafe, I want to inquire about Document Services (Photocopying, Printing, Scanning, and Lamination)."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("document_section", "Document Services (Photocopying, Printing, Scanning, Lamination)")}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-md btn-whatsapp-glow"
                >
                  <MessageCircle className="h-4 w-4" /> Inquire on WhatsApp
                </AnchorButton>
                <AnchorButton
                  href={`tel:${contactDetails.phoneRaw}`}
                  variant="outline"
                  onClick={() => trackCallClick("document_section", "Document Support Call")}
                  className="w-full sm:w-auto"
                >
                  <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call Now
                </AnchorButton>
              </div>
            </div>
          </div>
        </section>

        <section id="location" className="scroll-mt-24 border-y border-border py-16 sm:py-20">
          <div className="site-container">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] reveal">
              <div className="flex min-w-0 items-start gap-5">
                <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground sm:grid">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="section-eyebrow">Location & Directions</p>
                  <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Visit Us in Rajpura</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                    Visit Daman Cyber Cafe for all your digital assistance, document preparation, photocopies, prints, and online applications.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-sm">
                    <p className="font-semibold text-foreground">
                      📍 Plus Code / Location: <span className="text-primary font-bold">{contactDetails.address}</span>
                    </p>
                    <p className="font-medium text-muted-foreground">⏰ Hours: {contactDetails.hours}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <AnchorButton
                  href={contactDetails.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="default"
                  className="w-full sm:w-auto shadow-sm"
                >
                  <MapPin className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" /> Get Directions
                </AnchorButton>
                <AnchorButton
                  href={`tel:${contactDetails.phoneRaw}`}
                  variant="outline"
                  onClick={() => trackCallClick("location_section", "Location Call Shop")}
                  className="w-full sm:w-auto"
                >
                  <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call Shop
                </AnchorButton>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-border shadow-sm bg-muted aspect-[16/9] sm:aspect-[21/9] max-h-80 w-full reveal">
              <iframe
                title="Daman Cyber Cafe Location Map - FHCW+9FX Rajpura, Punjab"
                src={contactDetails.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[220px]"
              />
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 py-20 sm:py-28 relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none" />

          <div className="site-container relative">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
              {/* Left Column: Interactive Overview & Quick Help */}
              <div className="reveal lg:sticky lg:top-28 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 shadow-xs">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
                    Good to Know <br />
                    <span className="bg-gradient-to-r from-primary to-brand-cyan-strong bg-clip-text text-transparent">
                      Before You Visit
                    </span>
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    ਤੁਹਾਡੇ ਹਰ ਸਵਾਲ ਦਾ ਸਹੀ ਅਤੇ ਭਰੋਸੇਮੰਦ ਜਵਾਬ। Quick answers about online forms, instant WhatsApp printing, document checklists, and payments at Daman Cyber Cafe, Rajpura.
                  </p>
                </div>

                {/* Quick Feature Highlights Card */}
                <div className="rounded-xl border border-border/80 bg-card/60 backdrop-blur-md p-5 shadow-sm space-y-3.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    At Daman Cyber Cafe:
                  </p>
                  <div className="space-y-2.5 text-xs sm:text-sm font-medium text-foreground">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>Send files on WhatsApp & get prints ready</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>Zero-error government exam & college forms</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>5-minute instant passport-size photos</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>Open 7 days a week (9:00 AM – 7:00 PM)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExpandAllFaqs}
                      className="text-xs font-semibold h-8 px-3 rounded-md hover:bg-accent transition-colors active:scale-95"
                    >
                      {openFaqIndices.length === faqs.length ? "Collapse All FAQs" : "Expand All 5 FAQs"}
                    </Button>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {openFaqIndices.length} of {faqs.length} open
                    </span>
                  </div>
                </div>

                {/* Direct Contact Card & Ask a Question button */}
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-accent/50 via-card to-background p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Have a different question?</h4>
                      <p className="text-xs text-muted-foreground">Ask directly on WhatsApp, call, or submit online</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <AnchorButton
                      href={contactDetails.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("faq_sidebar", "FAQ WhatsApp Us")}
                      className="h-10 text-xs sm:text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white border-0 shadow-sm w-full"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp Us
                    </AnchorButton>
                    <AnchorButton
                      href={`tel:${contactDetails.phoneRaw}`}
                      variant="outline"
                      onClick={() => trackCallClick("faq_sidebar", "FAQ Call Shop")}
                      className="h-10 text-xs sm:text-xs font-semibold w-full"
                    >
                      <Phone className="h-4 w-4 text-primary" /> Call Shop
                    </AnchorButton>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setAskSubmitted(false);
                      setAskModalOpen(true);
                    }}
                    className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquarePlus className="h-4 w-4 text-brand-cyan" />
                    <span>ਪੁੱਛੋ ਆਪਣਾ ਸਵਾਲ (Ask a Question Online)</span>
                  </Button>
                </div>
              </div>

              {/* Right Column: 5 Interactive Animated Accordion Cards */}
              <div className="space-y-4 reveal">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndices.includes(index);
                  return (
                    <article
                      key={faq.num}
                      className={cn(
                        "rounded-xl border transition-all duration-300 ease-out overflow-hidden bg-card/90 backdrop-blur-sm",
                        isOpen
                          ? "border-primary/60 shadow-lg shadow-primary/5 ring-1 ring-primary/20 bg-card faq-active-card"
                          : "border-border/80 hover:border-primary/40 hover:shadow-md"
                      )}
                    >
                      {/* Accordion Trigger Button */}
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                        className="w-full text-left p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 select-none group cursor-pointer transition-colors duration-200"
                      >
                        {/* Number Badge with animated scale & highlight */}
                        <div
                          className={cn(
                            "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs sm:text-sm font-bold transition-all duration-300",
                            isOpen
                              ? "bg-primary text-primary-foreground shadow-sm scale-105"
                              : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                          )}
                        >
                          {faq.num}
                        </div>

                        {/* Title & Category */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                              {faq.category}
                            </span>
                            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline-block">
                              {faq.punjabiTitle}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
                            {faq.question}
                          </h3>
                        </div>

                        {/* Animated Chevron */}
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 mt-0.5",
                            isOpen
                              ? "bg-primary/15 text-primary rotate-180"
                              : "bg-muted/70 text-muted-foreground group-hover:bg-accent group-hover:text-foreground rotate-0"
                          )}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>

                      {/* Smooth CSS Grid Height Animation */}
                      <div
                        id={`faq-answer-${index}`}
                        className={cn("faq-grid-wrapper", isOpen && "is-open")}
                      >
                        <div className="faq-grid-inner">
                          <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/50 space-y-4">
                            {/* Punjabi title for mobile */}
                            <p className="sm:hidden text-xs font-semibold text-primary/80">
                              {faq.punjabiTitle}
                            </p>

                            {/* Detailed Answer */}
                            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                              {faq.answer}
                            </p>

                            {/* Key Highlights Grid */}
                            {faq.highlights && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {faq.highlights.map((item) => (
                                  <div
                                    key={item}
                                    className="flex items-center gap-2 rounded-lg bg-accent/40 px-2.5 py-1.5 text-xs font-semibold text-foreground"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-cyan-strong" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Contextual Action Button */}
                            {faq.actionType === "whatsapp" && (
                              <div className="pt-2">
                                <Button
                                  type="button"
                                  asChild
                                  size="sm"
                                  className="h-9 px-4 text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  <a
                                    href={`https://wa.me/919779223042?text=${encodeURIComponent(
                                      `Hello Daman Cyber Cafe, regarding FAQ #${faq.num} (${faq.question}): I would like to inquire or send documents.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackWhatsAppClick("faq_item", `FAQ #${faq.num}`)}
                                  >
                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                                    {faq.actionText || "Send on WhatsApp"}
                                  </a>
                                </Button>
                              </div>
                            )}

                            {faq.actionType === "payment" && (
                              <div className="pt-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleOpenPayment("upi")}
                                  className="h-9 px-4 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                  <QrCode className="h-3.5 w-3.5 mr-1.5" />
                                  {faq.actionText || "Open UPI Scanner"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-secondary py-20 sm:py-28">
          <div className="site-container">
            <div className="grid overflow-hidden rounded-lg border border-border bg-background shadow-image lg:grid-cols-[0.9fr_1.1fr] reveal">
              <div className="bg-brand-deep p-7 text-primary-foreground sm:p-10 lg:p-12">
                <p className="section-eyebrow section-eyebrow-dark">Visit or contact us</p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Daman Cyber Cafe</h2>
                <p className="mt-3 text-primary-foreground/65">Digital Services · Document Support · Rajpura</p>
                <div className="mt-9 space-y-6">
                  <ContactLine
                    icon={Phone}
                    label="Mobile / Call"
                    value={contactDetails.phone}
                    href={`tel:${contactDetails.phoneRaw}`}
                    onClick={() => trackCallClick("contact_sidebar", "Contact Sidebar Phone")}
                  />
                  <ContactLine
                    icon={MessageCircle}
                    label="WhatsApp"
                    value={contactDetails.whatsapp}
                    href={contactDetails.whatsappUrl}
                    onClick={() => trackWhatsAppClick("contact_sidebar", "Contact Sidebar WhatsApp")}
                  />
                  <ContactLine
                    icon={MapPin}
                    label="Location / Plus Code"
                    value={contactDetails.address}
                    href={contactDetails.directionsUrl}
                  />
                  <ContactLine
                    icon={Clock3}
                    label="Opening Hours"
                    value={contactDetails.hours}
                  />
                </div>
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="section-eyebrow">Let’s get it sorted</p>
                <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                  Need Help With an Online or Document Service?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Contact Daman Cyber Cafe directly or visit us in Rajpura. We are here to help with form filling, photocopies, prints, and all digital tasks.
                </p>

                {/* Direct Action CTAs */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <AnchorButton
                    href={contactDetails.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("contact_section", "Contact Box WhatsApp")}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-sm btn-whatsapp-glow"
                    label="Chat on WhatsApp"
                  >
                    <MessageCircle className="transition-transform duration-300 group-hover:scale-115" /> WhatsApp Us
                  </AnchorButton>
                  <AnchorButton
                    href={`tel:${contactDetails.phoneRaw}`}
                    variant="outline"
                    onClick={() => trackCallClick("contact_section", "Contact Box Call")}
                    className="group"
                    label="Call Daman Cyber Cafe"
                  >
                    <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call Now
                  </AnchorButton>
                  <AnchorButton
                    href={contactDetails.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    className="group"
                    label="Get Directions on Google Maps"
                  >
                    <MapPin className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-1" /> Get Directions
                  </AnchorButton>
                </div>

                {/* Quick Interactive WhatsApp Inquiry Box */}
                <form onSubmit={handleSendInquiry} className="mt-8 rounded-lg border border-border bg-card p-4 sm:p-5 shadow-xs">
                  <label htmlFor="quick-query" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    ⚡ Quick Online Inquiry
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Type what service you need (e.g. Admit Card print, PAN card apply, college admission form):
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <input
                      id="quick-query"
                      type="text"
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder="Type your requirement here..."
                      className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      type="submit"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none font-semibold whitespace-nowrap shadow-xs btn-animated shrink-0"
                    >
                      <Send className="h-4 w-4" /> Send on WhatsApp
                    </Button>
                  </div>
                </form>

                {/* Quick Copy Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopy(contactDetails.phone, "phone")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 hover:bg-muted px-2.5 py-1.5 font-medium text-foreground transition-colors cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600 font-semibold">Phone Number Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Copy Phone Number</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(contactDetails.address, "address")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 hover:bg-muted px-2.5 py-1.5 font-medium text-foreground transition-colors cursor-pointer"
                  >
                    {copiedField === "address" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600 font-semibold">Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Copy Plus Code</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-5 text-xs leading-5 text-muted-foreground">
                  Open daily from 9:00 AM to 7:00 PM. Fast and reliable service for students, job applicants, and residents.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-deep pb-28 pt-14 text-primary-foreground md:pb-12 border-t border-primary-foreground/10">
        <div className="site-container">
          {/* Top Notice / WhatsApp Fast Document Print Banner */}
          <div className="mb-12 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 sm:p-6 backdrop-blur-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-cyan/20 text-brand-cyan">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white text-base">Save Your Time – Send Documents on WhatsApp!</p>
                <p className="text-sm text-primary-foreground/75 mt-0.5">
                  Send your files or forms on WhatsApp before visiting for instant printouts, scanning, and fast processing.
                </p>
              </div>
            </div>
            <a
              href={contactDetails.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("footer_banner", "Fast Print Banner")}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#25D366] hover:bg-[#20bd5a] px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-md btn-whatsapp-glow shrink-0"
            >
              <MessageCircle className="h-4 w-4" /> Send Documents on WhatsApp
            </a>
          </div>

          {/* 4-Column Detailed Cyber Cafe Grid */}
          <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-b border-primary-foreground/15">
            {/* Col 1: About Cafe & Trust Highlights */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-cyan text-xs font-black text-brand-deep">
                  DC
                </span>
                <span className="text-lg font-extrabold tracking-tight">DAMAN CYBER CAFE</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/75">
                Your trusted one-stop digital service centre in Rajpura. We assist students, job seekers, and families with online government applications, document printing, scanning, and fast digital solutions.
              </p>
              <div className="mt-5 space-y-2 text-xs font-medium text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>100% Confidential & Secure Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>Instant Print & Fast Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>Honest Guidance & Transparent Rates</span>
                </div>
              </div>
            </div>

            {/* Col 2: Online & Govt Services */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Online & Govt Services</p>
              <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
                {[
                  "Govt Job Applications & Exams",
                  "Admit Card & Result Downloads",
                  "PAN Card (New & Corrections)",
                  "Aadhaar & Voter Card Services",
                  "College & University Admissions",
                  "Pension & Social Scheme Forms",
                  "Electricity Bills & Challan Payments",
                ].map((service) => (
                  <li key={service}>
                    <a
                      href={`https://wa.me/919779223042?text=${encodeURIComponent(
                        `Hello Daman Cyber Cafe, I want to inquire about "${service}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("footer_service_list", service)}
                      className="flex items-center gap-2 hover:text-white transition-colors group/item"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-brand-cyan shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
                      <span>{service}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Document & Printing Solutions */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Printing & Documents</p>
              <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
                {[
                  "High-Speed B/W & Color Prints",
                  "Heavy-Duty Photocopy (Xerox)",
                  "HD Document Scanning to PDF",
                  "Professional Resume / CV Design",
                  "ID Card & Certificate Lamination",
                  "Passport Size Urgent Photos",
                  "WhatsApp & Pen Drive Printing",
                ].map((service) => (
                  <li key={service}>
                    <a
                      href={`https://wa.me/919779223042?text=${encodeURIComponent(
                        `Hello Daman Cyber Cafe, I want to inquire about "${service}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("footer_print_list", service)}
                      className="flex items-center gap-2 hover:text-white transition-colors group/item"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-brand-cyan shrink-0 transition-transform duration-200 group-hover/item:translate-x-1" />
                      <span>{service}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Visiting Details, Timings & Payments */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-cyan">Visit & Contact Info</p>
              <div className="mt-4 space-y-3.5 text-sm text-primary-foreground/75">
                <div>
                  <p className="text-xs uppercase text-primary-foreground/50 font-semibold">Location / Address</p>
                  <a
                    href={contactDetails.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-start gap-1.5 hover:text-brand-cyan transition-colors"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-brand-cyan mt-0.5" />
                    <span>{contactDetails.address}</span>
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase text-primary-foreground/50 font-semibold">Phone / Mobile</p>
                  <a
                    href={`tel:${contactDetails.phoneRaw}`}
                    onClick={() => trackCallClick("footer_info", "Footer Phone")}
                    className="mt-0.5 inline-flex items-center gap-1.5 hover:text-brand-cyan transition-colors font-semibold"
                  >
                    <Phone className="h-4 w-4 text-brand-cyan" />
                    <span>{contactDetails.phone}</span>
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase text-primary-foreground/50 font-semibold">WhatsApp Support</p>
                  <a
                    href={contactDetails.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("footer_info", "Footer WhatsApp")}
                    className="mt-0.5 inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors font-semibold"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>{contactDetails.whatsapp}</span>
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase text-primary-foreground/50 font-semibold">Opening Hours</p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-white font-medium">
                    <Clock3 className="h-4 w-4 text-brand-cyan" />
                    <span>{contactDetails.hours}</span>
                  </p>
                  <p className="text-xs text-primary-foreground/60 mt-0.5">Open all 7 days for your service</p>
                </div>

                <div className="pt-2 border-t border-primary-foreground/10">
                  <p className="text-xs uppercase text-primary-foreground/50 font-semibold mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-brand-cyan" />
                      Payments Accepted
                    </span>
                    <span className="text-[11px] text-brand-cyan font-normal lowercase tracking-normal">
                      (tap to pay)
                    </span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenPayment("gpay")}
                      className="group inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white hover:text-black border border-white/20 px-2.5 py-1.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
                      title="Touch to open Google Pay"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#4285F4] group-hover:scale-125 transition-transform shrink-0" />
                      <span>GPay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPayment("phonepe")}
                      className="group inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-[#5f259f] hover:text-white border border-white/20 px-2.5 py-1.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
                      title="Touch to open PhonePe"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#5f259f] group-hover:scale-125 transition-transform shrink-0" />
                      <span>PhonePe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPayment("paytm")}
                      className="group inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-[#00b9f5] hover:text-white border border-white/20 px-2.5 py-1.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
                      title="Touch to open Paytm / UPI"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#00b9f5] group-hover:scale-125 transition-transform shrink-0" />
                      <span>Paytm / UPI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPayment("cash")}
                      className="group inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-emerald-600 hover:text-white border border-white/20 px-2.5 py-1.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
                      title="Cash payment accepted at counter"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform shrink-0" />
                      <span>Cash</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Essential Visitor Advisory */}
          <div className="py-6 border-b border-primary-foreground/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/65">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="font-semibold text-primary-foreground/80">Quick Links:</span>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
              <a href="#location" className="hover:text-white transition-colors">Get Directions</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact Shop</a>
            </div>
            <p className="text-center md:text-right max-w-md">
              <span className="font-medium text-white">Advisory: </span>
              Please carry your original Aadhaar Card, academic certificates, and photos when applying for online government examinations or schemes.
            </p>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/50">
            <p>© 2026 Daman Cyber Cafe, Rajpura, Punjab. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
              <span className="text-center sm:text-right">
                Providing dependable digital, print and document assistance in Rajpura.
              </span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <Button asChild variant="outline" className="group h-12 w-full font-semibold transition-all duration-200 active:scale-95">
          <a
            href={`tel:${contactDetails.phoneRaw}`}
            onClick={() => trackCallClick("mobile_floating_bar", "Mobile Floating Bar Call")}
            aria-label="Call Daman Cyber Cafe"
          >
            <Phone className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" /> Call Now
          </a>
        </Button>
        <Button asChild className="group h-12 w-full font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-sm btn-whatsapp-glow active:scale-95">
          <a
            href={contactDetails.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("mobile_floating_bar", "Mobile Floating Bar WhatsApp")}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-115" /> WhatsApp
          </a>
        </Button>
      </div>

      {/* UPI Payment Modal (Pure React Modal) */}
      {paymentModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-0 duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setPaymentModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pb-2">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mb-2">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {selectedPaymentMethod === "cash" ? "Cash Payment at Counter" : "Pay to Daman Cyber Cafe"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPaymentMethod === "cash"
                  ? "Visit our shop in Rajpura for direct cash payments"
                  : "Instant & 100% secure payment via Google Pay, PhonePe, Paytm or any UPI app"}
              </p>
            </div>

            {selectedPaymentMethod === "cash" ? (
              <div className="space-y-4 py-2 mt-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    💵 Cash Accepted at Counter
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can pay cash directly when visiting our shop in Rajpura. No advance required for everyday print and photocopy jobs.
                  </p>
                </div>
                <div className="space-y-2 rounded-lg border border-border p-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{contactDetails.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-primary shrink-0" />
                    <span>Open: {contactDetails.hours}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button asChild variant="outline" className="w-full">
                    <a href={contactDetails.directionsUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4" /> Get Directions
                    </a>
                  </Button>
                  <Button asChild className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white">
                    <a href={`tel:${contactDetails.phoneRaw}`}>
                      <Phone className="h-4 w-4" /> Call Shop
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-1 mt-2">
                {/* QR Code / Scanner Container */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-3.5 shadow-xs">
                  <div className="flex items-center gap-1 mb-2.5 rounded-lg bg-muted p-1 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setShowOriginalScanner(true)}
                      className={cn(
                        "rounded px-2.5 py-1 transition-all cursor-pointer",
                        showOriginalScanner ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Original Scanner
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOriginalScanner(false)}
                      className={cn(
                        "rounded px-2.5 py-1 transition-all cursor-pointer",
                        !showOriginalScanner ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Digital QR Code
                    </button>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-border/80 bg-white p-2 shadow-xs max-w-[220px]">
                    {showOriginalScanner ? (
                      <img
                        src={qrScannerImage}
                        alt="Google Pay Scanner - Daman Rajput - rajputdaman826@oksbi"
                        width={220}
                        height={280}
                        className="w-full h-auto max-h-[220px] object-contain rounded"
                      />
                    ) : (
                      <img
                        src={qrCodeUrl}
                        alt="UPI QR Code - Daman Rajput - rajputdaman826@oksbi"
                        width={200}
                        height={200}
                        className="w-48 h-48 object-contain"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-center text-xs font-bold text-foreground">
                    Scan with Google Pay, PhonePe, Paytm or Any UPI App
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Payee: <span className="font-bold text-foreground">{contactDetails.upiName}</span>
                  </p>
                </div>

                {/* UPI ID Copy Field */}
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/60 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">UPI ID (Google Pay / PhonePe / Paytm)</p>
                    <p className="text-sm font-bold text-foreground truncate select-all">{contactDetails.upiId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant UPI App Launchers */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-muted-foreground text-center">
                    Or tap to open directly in your mobile app:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={gpayUrl}
                      className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-2.5 text-center hover:bg-muted/70 transition-all active:scale-95 group shadow-xs"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-[#4285F4] mb-1 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-bold text-foreground">Google Pay</span>
                      <span className="text-[10px] text-muted-foreground">Open App</span>
                    </a>
                    <a
                      href={phonepeUrl}
                      className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-2.5 text-center hover:bg-muted/70 transition-all active:scale-95 group shadow-xs"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-[#5f259f] mb-1 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-bold text-foreground">PhonePe</span>
                      <span className="text-[10px] text-muted-foreground">Open App</span>
                    </a>
                    <a
                      href={paytmUrl}
                      className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-2.5 text-center hover:bg-muted/70 transition-all active:scale-95 group shadow-xs"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-[#00b9f5] mb-1 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-bold text-foreground">Paytm / UPI</span>
                      <span className="text-[10px] text-muted-foreground">Open App</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ask a Question Modal */}
      {askModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-0 duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setAskModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAskModalOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {askSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">ਤੁਹਾਡਾ ਸਵਾਲ ਪ੍ਰਾਪਤ ਹੋ ਗਿਆ ਹੈ!</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">
                    Your question has been recorded in our system. We will assist you shortly!
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-left text-xs space-y-1">
                  <p className="font-semibold text-foreground">Your Question:</p>
                  <p className="text-muted-foreground italic">"{askQuestionText}"</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <Button
                    asChild
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold h-11 shadow-sm"
                  >
                    <a
                      href={`https://wa.me/919779223042?text=${encodeURIComponent(
                        `Hello Daman Cyber Cafe, I submitted a question on your website: "${askQuestionText}"`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("ask_modal_confirmation", "Ask Modal WhatsApp")}
                    >
                      <MessageCircle className="h-4 w-4 mr-1.5" /> Also Send on WhatsApp
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAskModalOpen(false);
                      setAskQuestionText("");
                      setAskSubmitted(false);
                    }}
                    className="h-11"
                  >
                    Done / ਬੰਦ ਕਰੋ
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquarePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">ਪੁੱਛੋ ਆਪਣਾ ਸਵਾਲ / Ask Any Question</h3>
                    <p className="text-xs text-muted-foreground">Directly send your inquiry to Daman Cyber Cafe</p>
                  </div>
                </div>

                <form onSubmit={handleAskSubmit} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Service Category / ਸ਼੍ਰੇਣੀ
                    </label>
                    <select
                      value={askCategory}
                      onChange={(e) => setAskCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="Online Forms & Govt Jobs">Online Forms & Govt Jobs (ਸਰਕਾਰੀ ਫਾਰਮ)</option>
                      <option value="Fast WhatsApp Printing">Fast WhatsApp Printing & Xerox (ਪ੍ਰਿੰਟ ਤੇ ਫੋਟੋਸਟੈਟ)</option>
                      <option value="Aadhaar & Documents">Aadhaar & Certificate Services (ਦਸਤਾਵੇਜ਼)</option>
                      <option value="Passport Photos & Lamination">Passport Photos & Lamination</option>
                      <option value="College Admission & Other">College Admission & Other (ਹੋਰ ਸੇਵਾਵਾਂ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Your Question / ਤੁਹਾਡਾ ਸਵਾਲ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={askQuestionText}
                      onChange={(e) => setAskQuestionText(e.target.value)}
                      placeholder="ਜਿਵੇਂ ਕਿ: ਪੰਜਾਬ ਪੁਲਿਸ ਫਾਰਮ ਦੀ ਲਾਸਟ ਡੇਟ ਕੀ ਹੈ? ਜਾਂ ਕੀ ਮੈਂ ਫਾਈਲ ਵਟਸਐਪ 'ਤੇ ਭੇਜ ਸਕਦਾ ਹਾਂ?"
                      className="w-full rounded-md border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Your Name / ਤੁਹਾਡਾ ਨਾਮ (Optional)
                      </label>
                      <input
                        type="text"
                        value={askName}
                        onChange={(e) => setAskName(e.target.value)}
                        placeholder="e.g. Gurpreet Singh"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Mobile Number / ਫੋਨ ਨੰਬਰ (Optional)
                      </label>
                      <input
                        type="tel"
                        value={askPhone}
                        onChange={(e) => setAskPhone(e.target.value)}
                        placeholder="e.g. 98721XXXXX"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
                    >
                      <SendHorizontal className="h-4 w-4 mr-2" /> Submit Question / ਸਵਾਲ ਭੇਜੋ
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAskModalOpen(false)}
                      className="h-11"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Quick Action Button (Desktop & Tablet) */}
      <aside className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3">
        <a
          href={contactDetails.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("desktop_floating_button", "Floating Desktop WhatsApp")}
          className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white font-bold text-sm shadow-xl hover:bg-[#20ba59] transition-all hover:scale-105 active:scale-95 group btn-whatsapp-glow border-2 border-white/20"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-115" />
          <span>{siteStatus.isOnline ? "Chat on WhatsApp" : "Leave WhatsApp Message"}</span>
          <span className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white/60", siteStatus.isOnline ? "bg-emerald-200 animate-ping" : "bg-amber-300")} />
        </a>
      </aside>
    </div>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="grid grid-cols-[2.5rem_1fr] items-start gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-foreground/10 text-brand-cyan">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase text-primary-foreground/50">{label}</span>
        <span className={cn("mt-1 block break-words text-sm font-medium", href && "hover:text-brand-cyan transition-colors underline sm:no-underline sm:hover:underline")}>
          {value}
        </span>
      </span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }
  return content;
}