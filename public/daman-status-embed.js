/**
 * Daman Cyber Cafe - Remote Online/Offline Controller Script
 * Place this script in any other website to automatically control its On/Off state
 * from the Daman Cyber Cafe Admin Panel.
 *
 * Usage:
 * <script src="http://localhost:8080/daman-status-embed.js"></script>
 */

(function () {
  "use strict";

  // Determine host from script tag or default
  var scripts = document.getElementsByTagName("script");
  var currentScript = scripts[scripts.length - 1];
  var scriptSrc = (currentScript && currentScript.src) || "";
  var baseUrl = "http://localhost:8080";
  try {
    if (scriptSrc) {
      var parsed = new URL(scriptSrc);
      baseUrl = parsed.origin;
    }
  } catch (e) {}

  var OVERLAY_ID = "daman-remote-offline-overlay";

  function renderOfflineScreen(notice) {
    if (document.getElementById(OVERLAY_ID)) return;

    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.style.cssText =
      "position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; " +
      "background: rgba(2, 6, 23, 0.96); backdrop-filter: blur(8px); " +
      "color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; " +
      "display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center;";

    overlay.innerHTML =
      '<div style="max-width: 520px; width: 100%; background: #0f172a; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">' +
      '  <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: rgba(239, 68, 68, 0.15); border: 2px solid rgba(239, 68, 68, 0.4); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px;">⏰</div>' +
      '  <div style="display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">🔴 Site Currently Offline / ਦੁਕਾਨ ਬੰਦ ਹੈ</div>' +
      '  <h2 style="font-size: 24px; font-weight: 900; margin: 0 0 8px; color: #ffffff;">ਇਸ ਵੇਲੇ ਸੇਵਾਵਾਂ ਬੰਦ ਹਨ</h2>' +
      '  <p style="font-size: 14px; color: #94a3b8; margin: 0 0 20px;">Daman Cyber Cafe is Currently Offline / Closed</p>' +
      '  <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px; text-align: left; margin-bottom: 24px;">' +
      '    <p style="font-size: 11px; font-weight: 700; color: #fcd34d; text-transform: uppercase; margin: 0 0 6px;">📢 ਮਾਲਕ ਦਾ ਸੁਨੇਹਾ / Notice:</p>' +
      '    <p style="font-size: 13px; color: #e2e8f0; margin: 0; line-height: 1.5;">' +
      (notice || "ਅਸੀਂ ਇਸ ਵੇਲੇ ਆਫਲਾਈਨ ਹਾਂ। ਪਰ ਤੁਸੀਂ ਵਟਸਐਪ 'ਤੇ ਸੁਨੇਹਾ ਭੇਜ ਸਕਦੇ ਹੋ, ਦੁਕਾਨ ਖੁੱਲ੍ਹਦੇ ਹੀ ਤੁਹਾਡਾ ਕੰਮ ਕਰ ਦਿੱਤਾ ਜਾਵੇਗਾ!") +
      "    </p>" +
      "  </div>" +
      '  <div style="display: flex; flex-direction: column; gap: 10px;">' +
      '    <a href="https://wa.me/919779223042?text=Hello%20Daman%20Cyber%20Cafe%2C%20I%20visited%20your%20website%20and%20want%20to%20leave%20an%20inquiry." target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px; border-radius: 12px; box-shadow: 0 4px 14px rgba(37,211,102,0.4);">' +
      "      <span>💬 Send WhatsApp Message / ਵਟਸਐਪ ਕਰੋ</span>" +
      "    </a>" +
      '    <a href="tel:+919779223042" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #1e293b; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px; border-radius: 12px; border: 1px solid #334155;">' +
      "      <span>📞 Call Shop / ਫੋਨ ਕਰੋ (+91 97792 23042)</span>" +
      "    </a>" +
      "  </div>" +
      '  <p style="font-size: 11px; color: #64748b; margin: 18px 0 0;">Daman Cyber Cafe · Rajpura · Timings: 9:00 AM – 7:00 PM</p>' +
      "</div>";

    document.body.appendChild(overlay);
  }

  function removeOfflineScreen() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  function checkStatus() {
    // 1. Check local storage if on same origin
    try {
      var raw = localStorage.getItem("daman_site_status_v1");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed.isOnline === "boolean") {
          if (parsed.isOnline) {
            removeOfflineScreen();
          } else {
            renderOfflineScreen(parsed.notice);
          }
          return;
        }
      }
    } catch (e) {}

    // 2. Fetch from Daman Cyber Cafe server
    fetch(baseUrl + "/status?format=json", { cache: "no-store" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data && typeof data.isOnline === "boolean") {
          if (data.isOnline) {
            removeOfflineScreen();
          } else {
            renderOfflineScreen(data.notice);
          }
        }
      })
      .catch(function () {
        // Fallback check
      });
  }

  // Initial check when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkStatus);
  } else {
    checkStatus();
  }

  // Re-check periodically every 10 seconds
  setInterval(checkStatus, 10000);

  // Listen to cross-tab storage events or postMessage
  window.addEventListener("storage", function (e) {
    if (e.key === "daman_site_status_v1") {
      checkStatus();
    }
  });

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "DAMAN_STATUS_UPDATE") {
      if (event.data.isOnline) {
        removeOfflineScreen();
      } else {
        renderOfflineScreen(event.data.notice);
      }
    }
  });
})();
