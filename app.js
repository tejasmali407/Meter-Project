/* Meter — Electricity Bill Estimator (Phase 2)
   - Client-side only, no frameworks
   - slabs.json is the single source of truth for areas, slabs, and fixedCharge
*/

const STORAGE_KEY = "meter:v4";
const LANG_KEY = "meter:lang";
const WELCOME_KEY = "meter:welcomeShown";

const translations = {
  en: {
    "app.title": "Meter",
    "app.subtitle": "Electricity Bill Estimator (estimated)",
    "app.language": "Language",
    "app.clientSide": "Client-side",
    "inputs.title": "Inputs",
    "inputs.lastPaid": "Last Paid Meter Reading",
    "inputs.lastPaidHelp": "From your previous bill.",
    "inputs.current": "Current Meter Reading",
    "inputs.currentHelp": "Today’s meter value.",
    "inputs.district": "District",
    "inputs.selectDistrict": "Select your district",
    "inputs.districtHelp": "Used to load provider and slab rates.",
    "inputs.billMode": "Bill Mode",
    "inputs.selectBillMode": "Select bill mode",
    "inputs.residential": "Residential",
    "inputs.commercial": "Commercial",
    "inputs.billModeHelp": "Choose tariff type for selected district.",
    "inputs.provider": "Provider",
    "inputs.providerHelp": "Auto-filled when you choose a district.",
    "actions.calculate": "Calculate Bill",
    "actions.reset": "Reset",
    "result.title": "Result",
    "result.metaDistrict": "District",
    "result.metaProvider": "Provider",
    "result.metaBillMode": "Bill mode",
    "result.unitsUsed": "Units used till today",
    "result.totalBill": "Total estimated bill",
    "result.totalHint": "Includes slab-wise amount plus fixed charge.",
    "result.slabBreakdown": "Slab-wise breakdown",
    "result.fixedCharges": "Fixed charges (if any)",
    "result.taxes": "Taxes & Duties",
    "legal.privacyTitle": "Privacy:",
    "legal.privacyText": "All calculations happen on your device. Data is stored only in localStorage.",
    "legal.disclaimerTitle": "Disclaimer:",
    "legal.disclaimerText":
      "This is an estimated electricity bill calculator for learning and tracking purposes only. It is not an official bill and is not affiliated with MSEDCL or any electricity board.",
    "legal.footerDisclaimer":
      "This is an estimated electricity bill calculator for learning and tracking purposes only. It is not an official bill and is not affiliated with MSEDCL or any electricity board.",
    "msg.required": "Required.",
    "msg.enterValidNonNegative": "Enter a valid non-negative number.",
    "msg.currentLessThanLast": "Current reading cannot be less than last paid reading.",
    "msg.currentMustBeGreater": "Current reading must be greater than last paid reading.",
    "msg.meterContinuous": "Meter readings are continuous and never reset.",
    "msg.selectDistrict": "Please select your district.",
    "msg.selectBillMode": "Please select bill mode.",
    "msg.enterLastPaid": "Please enter your last paid meter reading.",
    "msg.enterCurrent": "Please enter your current meter reading.",
    "msg.enterValidReadings": "Enter valid readings.",
    "msg.breakdownEmpty": "Click “Calculate Bill” after selecting district + bill mode.",
    "msg.fixedCharge": "Fixed charge",
    "msg.totalTax": "Total Tax",
    "msg.slabSubtotal": "Slab subtotal",
    "msg.estimatedNotOfficial": "Estimated bill calculated. This is an estimated bill, not official.",
    "about.title": "How It Works",
    "about.content": "This calculator estimates your electricity bill using slab-wise tariff rates. Here's how:\n1. Units Used: Current Reading − Last Paid Reading\n2. Slab Calculation: Units are distributed across tariff slabs, each with its own rate\n3. Fixed Charge: Added based on your district and bill mode\n4. Taxes: Calculated as a percentage of (slab total + fixed charge)\n5. Final Bill: Sum of all components\n\nNote: Rates are loaded from slabs.json. This is an estimate only, not an official bill.",
    "msg.calculating": "Calculating...",
    "welcome.title": "Welcome to Meter",
    "welcome.subtitle": "Your Electricity Bill Estimator",
    "welcome.feature1.title": "Slab-wise Calculation",
    "welcome.feature1.desc": "Accurate bill estimation using tariff slabs",
    "welcome.feature2.title": "100% Private",
    "welcome.feature2.desc": "All calculations happen on your device",
    "welcome.feature3.title": "Multi-language",
    "welcome.feature3.desc": "Available in English, Marathi & Hindi",
    "welcome.feature4.title": "Works Offline",
    "welcome.feature4.desc": "No internet required after first load",
    "welcome.note": "This is an estimated bill calculator for tracking purposes only. Not an official bill.",
    "welcome.getStarted": "Get Started"
  },
  mr: {
    "app.title": "मीटर",
    "app.subtitle": "वीज बिल अंदाजक (अंदाजे)",
    "app.language": "भाषा",
    "app.clientSide": "क्लायंट-साइड",
    "inputs.title": "इनपुट",
    "inputs.lastPaid": "मागील बिलचा (शेवटचा भरलेला) मीटर रीडिंग",
    "inputs.lastPaidHelp": "मागील बिलावरून.",
    "inputs.current": "सध्याचा मीटर रीडिंग",
    "inputs.currentHelp": "आजचा मीटरचा आकडा.",
    "inputs.district": "जिल्हा",
    "inputs.selectDistrict": "जिल्हा निवडा",
    "inputs.districtHelp": "प्रोव्हायडर आणि स्लॅब दर लोड करण्यासाठी.",
    "inputs.billMode": "बिल प्रकार",
    "inputs.selectBillMode": "बिल प्रकार निवडा",
    "inputs.residential": "घरगुती",
    "inputs.commercial": "व्यावसायिक",
    "inputs.billModeHelp": "निवडलेल्या जिल्ह्यासाठी दर प्रकार निवडा.",
    "inputs.provider": "प्रोव्हायडर",
    "inputs.providerHelp": "जिल्हा निवडल्यानंतर आपोआप भरेल.",
    "actions.calculate": "बिल काढा",
    "actions.reset": "रीसेट",
    "result.title": "निकाल",
    "result.metaDistrict": "जिल्हा",
    "result.metaProvider": "प्रोव्हायडर",
    "result.metaBillMode": "बिल प्रकार",
    "result.unitsUsed": "आजपर्यंत वापरलेली युनिट्स",
    "result.totalBill": "एकूण अंदाजित बिल",
    "result.totalHint": "स्लॅब रक्कम + स्थिर शुल्क.",
    "result.slabBreakdown": "स्लॅबनुसार तपशील",
    "result.fixedCharges": "स्थिर शुल्क (असल्यास)",
    "result.taxes": "कर आणि शुल्क",
    "legal.privacyTitle": "गोपनीयता:",
    "legal.privacyText": "सर्व गणना तुमच्या डिव्हाइसवर होते. डेटा फक्त localStorage मध्ये साठवला जातो.",
    "legal.disclaimerTitle": "सूचना:",
    "legal.disclaimerText":
      "हे केवळ शिकण्यासाठी आणि ट्रॅकिंगसाठी असलेले अंदाजित वीज बिल कॅल्क्युलेटर आहे. हे अधिकृत बिल नाही आणि MSEDCL किंवा कोणत्याही वीज मंडळाशी संलग्न नाही.",
    "legal.footerDisclaimer":
      "हे केवळ शिकण्यासाठी आणि ट्रॅकिंगसाठी असलेले अंदाजित वीज बिल कॅल्क्युलेटर आहे. हे अधिकृत बिल नाही आणि MSEDCL किंवा कोणत्याही वीज मंडळाशी संलग्न नाही.",
    "msg.required": "आवश्यक.",
    "msg.enterValidNonNegative": "वैध, शून्य किंवा त्यापेक्षा मोठा आकडा द्या.",
    "msg.currentLessThanLast": "सध्याचे रीडिंग मागील रीडिंगपेक्षा कमी असू शकत नाही.",
    "msg.currentMustBeGreater": "सध्याचे रीडिंग मागील रीडिंगपेक्षा जास्त असावे.",
    "msg.meterContinuous": "मीटर रीडिंग सतत वाढते (रीसेट होत नाही).",
    "msg.selectDistrict": "कृपया जिल्हा निवडा.",
    "msg.selectBillMode": "कृपया बिल प्रकार निवडा.",
    "msg.enterLastPaid": "कृपया मागील भरलेले मीटर रीडिंग द्या.",
    "msg.enterCurrent": "कृपया सध्याचे मीटर रीडिंग द्या.",
    "msg.enterValidReadings": "कृपया वैध रीडिंग द्या.",
    "msg.breakdownEmpty": "जिल्हा + बिल प्रकार निवडून “बिल काढा” दाबा.",
    "msg.fixedCharge": "स्थिर शुल्क",
    "msg.totalTax": "एकूण कर",
    "msg.slabSubtotal": "स्लॅब उपएकूण",
    "msg.estimatedNotOfficial": "अंदाजित बिल काढले. हे अधिकृत बिल नाही.",
    "about.title": "हे कसे काम करते",
    "about.content": "हे कॅल्क्युलेटर स्लॅब-वाइज दर वापरून तुमच्या वीज बिलाचा अंदाज काढते:\n1. वापरलेली युनिट्स: सध्याचे रीडिंग − मागील भरलेले रीडिंग\n2. स्लॅब गणना: युनिट्स दर स्लॅबमध्ये वितरित केल्या जातात\n3. स्थिर शुल्क: जिल्हा आणि बिल प्रकारानुसार जोडले जाते\n4. कर: (स्लॅब एकूण + स्थिर शुल्क) वर टक्केवारी मोजली जाते\n5. अंतिम बिल: सर्व घटकांची बेरीज\n\nसूचना: दर slabs.json वरून लोड केले जातात. हा फक्त अंदाज आहे, अधिकृत बिल नाही.",
    "msg.calculating": "गणना करत आहे...",
    "welcome.title": "मीटरमध्ये आपले स्वागत आहे",
    "welcome.subtitle": "तुमचा वीज बिल अंदाजक",
    "welcome.feature1.title": "स्लॅब-वाइज गणना",
    "welcome.feature1.desc": "दर स्लॅब वापरून अचूक बिल अंदाज",
    "welcome.feature2.title": "100% खाजगी",
    "welcome.feature2.desc": "सर्व गणना तुमच्या डिव्हाइसवर होते",
    "welcome.feature3.title": "बहुभाषिक",
    "welcome.feature3.desc": "इंग्रजी, मराठी आणि हिंदी मध्ये उपलब्ध",
    "welcome.feature4.title": "ऑफलाइन काम करते",
    "welcome.feature4.desc": "पहिल्या लोड नंतर इंटरनेट आवश्यक नाही",
    "welcome.note": "हे फक्त ट्रॅकिंगसाठी अंदाजित बिल कॅल्क्युलेटर आहे. अधिकृत बिल नाही.",
    "welcome.getStarted": "सुरू करा"
  },
  hi: {
    "app.title": "मीटर",
    "app.subtitle": "बिजली बिल अनुमानक (अनुमानित)",
    "app.language": "भाषा",
    "app.clientSide": "क्लाइंट-साइड",
    "inputs.title": "इनपुट",
    "inputs.lastPaid": "पिछले बिल का (अंतिम भुगतान) मीटर रीडिंग",
    "inputs.lastPaidHelp": "पिछले बिल से.",
    "inputs.current": "वर्तमान मीटर रीडिंग",
    "inputs.currentHelp": "आज का मीटर मान.",
    "inputs.district": "जिला",
    "inputs.selectDistrict": "जिला चुनें",
    "inputs.districtHelp": "प्रोवाइडर और स्लैब दर लोड करने के लिए.",
    "inputs.billMode": "बिल मोड",
    "inputs.selectBillMode": "बिल मोड चुनें",
    "inputs.residential": "घरेलू",
    "inputs.commercial": "व्यावसायिक",
    "inputs.billModeHelp": "चुने हुए जिले के लिए टैरिफ प्रकार चुनें.",
    "inputs.provider": "प्रोवाइडर",
    "inputs.providerHelp": "जिला चुनने पर अपने-आप भर जाएगा.",
    "actions.calculate": "बिल निकालें",
    "actions.reset": "रीसेट",
    "result.title": "परिणाम",
    "result.metaDistrict": "जिला",
    "result.metaProvider": "प्रोवाइडर",
    "result.metaBillMode": "बिल मोड",
    "result.unitsUsed": "आज तक उपयोग यूनिट्स",
    "result.totalBill": "कुल अनुमानित बिल",
    "result.totalHint": "स्लैब राशि + फिक्स्ड चार्ज.",
    "result.slabBreakdown": "स्लैब-वाइज विवरण",
    "result.fixedCharges": "फिक्स्ड चार्ज (यदि हो)",
    "result.taxes": "कर और शुल्क",
    "legal.privacyTitle": "गोपनीयता:",
    "legal.privacyText": "सभी गणनाएँ आपके डिवाइस पर होती हैं. डेटा केवल localStorage में स्टोर होता है.",
    "legal.disclaimerTitle": "अस्वीकरण:",
    "legal.disclaimerText":
      "यह सीखने और ट्रैकिंग के लिए एक अनुमानित बिजली बिल कैलकुलेटर है. यह आधिकारिक बिल नहीं है और MSEDCL या किसी भी बिजली बोर्ड से संबद्ध नहीं है.",
    "legal.footerDisclaimer":
      "यह सीखने और ट्रैकिंग के लिए एक अनुमानित बिजली बिल कैलकुलेटर है. यह आधिकारिक बिल नहीं है और MSEDCL या किसी भी बिजली बोर्ड से संबद्ध नहीं है.",
    "msg.required": "आवश्यक.",
    "msg.enterValidNonNegative": "कृपया वैध, शून्य या उससे बड़ा नंबर दें.",
    "msg.currentLessThanLast": "वर्तमान रीडिंग पिछले रीडिंग से कम नहीं हो सकती.",
    "msg.currentMustBeGreater": "वर्तमान रीडिंग पिछले रीडिंग से अधिक होनी चाहिए.",
    "msg.meterContinuous": "मीटर रीडिंग लगातार बढ़ती है (रीसेट नहीं होती).",
    "msg.selectDistrict": "कृपया जिला चुनें.",
    "msg.selectBillMode": "कृपया बिल मोड चुनें.",
    "msg.enterLastPaid": "कृपया पिछले भुगतान वाला मीटर रीडिंग दर्ज करें.",
    "msg.enterCurrent": "कृपया वर्तमान मीटर रीडिंग दर्ज करें.",
    "msg.enterValidReadings": "कृपया वैध रीडिंग दर्ज करें.",
    "msg.breakdownEmpty": "जिला + बिल मोड चुनकर “बिल निकालें” दबाएँ.",
    "msg.fixedCharge": "फिक्स्ड चार्ज",
    "msg.totalTax": "कुल कर",
    "msg.slabSubtotal": "स्लैब उप-योग",
    "msg.estimatedNotOfficial": "अनुमानित बिल निकाला गया. यह आधिकारिक बिल नहीं है.",
    "about.title": "यह कैसे काम करता है",
    "about.content": "यह कैलकुलेटर स्लैब-वाइज टैरिफ दरों का उपयोग करके आपके बिजली बिल का अनुमान लगाता है:\n1. उपयोग की गई यूनिट्स: वर्तमान रीडिंग − पिछला भुगतान रीडिंग\n2. स्लैब गणना: यूनिट्स को टैरिफ स्लैब में वितरित किया जाता है\n3. फिक्स्ड चार्ज: जिले और बिल मोड के आधार पर जोड़ा जाता है\n4. कर: (स्लैब कुल + फिक्स्ड चार्ज) पर प्रतिशत की गणना\n5. अंतिम बिल: सभी घटकों का योग\n\nनोट: दर slabs.json से लोड होते हैं. यह केवल एक अनुमान है, आधिकारिक बिल नहीं.",
    "msg.calculating": "गणना कर रहा है...",
    "welcome.title": "मीटर में आपका स्वागत है",
    "welcome.subtitle": "आपका बिजली बिल अनुमानक",
    "welcome.feature1.title": "स्लैब-वाइज गणना",
    "welcome.feature1.desc": "टैरिफ स्लैब का उपयोग करके सटीक बिल अनुमान",
    "welcome.feature2.title": "100% निजी",
    "welcome.feature2.desc": "सभी गणनाएँ आपके डिवाइस पर होती हैं",
    "welcome.feature3.title": "बहुभाषी",
    "welcome.feature3.desc": "अंग्रेजी, मराठी और हिंदी में उपलब्ध",
    "welcome.feature4.title": "ऑफलाइन काम करता है",
    "welcome.feature4.desc": "पहले लोड के बाद इंटरनेट की आवश्यकता नहीं",
    "welcome.note": "यह केवल ट्रैकिंग के लिए एक अनुमानित बिल कैलकुलेटर है. आधिकारिक बिल नहीं.",
    "welcome.getStarted": "शुरू करें"
  }
};

function t(key) {
  const lang = localStorage.getItem(LANG_KEY) || "en";
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

function applyTranslations(lang) {
  const safeLang = translations[lang] ? lang : "en";
  localStorage.setItem(LANG_KEY, safeLang);
  document.documentElement.lang = safeLang === "mr" ? "mr" : safeLang === "hi" ? "hi" : "en";

  const nodes = document.querySelectorAll("[data-i18n]");
  for (const node of nodes) {
    const key = node.getAttribute("data-i18n");
    if (!key) continue;
    const text = translations[safeLang]?.[key] ?? translations.en[key] ?? node.textContent;
    if (key === "about.content") {
      // Handle multi-line content for About section
      const lines = text.split("\n").filter(l => l.trim());
      let html = "";
      let inList = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^\d+\./)) {
          if (!inList) {
            html += "<ol>";
            inList = true;
          }
          const match = line.match(/^(\d+\.)\s*(.+?):\s*(.+)$/);
          if (match) {
            html += `<li><strong>${match[2]}:</strong> ${match[3]}</li>`;
          } else {
            html += `<li>${line.replace(/^\d+\.\s*/, "")}</li>`;
          }
        } else if (line.toLowerCase().startsWith("note:")) {
          if (inList) {
            html += "</ol>";
            inList = false;
          }
          const noteParts = line.split(":");
          html += `<p class="aboutNote"><strong>${noteParts[0]}:</strong> ${noteParts.slice(1).join(":").trim()}</p>`;
        } else {
          if (inList) {
            html += "</ol>";
            inList = false;
          }
          html += `<p>${line}</p>`;
        }
      }
      if (inList) html += "</ol>";
      node.innerHTML = html;
    } else {
      node.textContent = text;
    }
  }
}

const els = {
  form: () => document.getElementById("meterForm"),
  lastPaid: () => document.getElementById("lastPaidReading"),
  current: () => document.getElementById("currentReading"),
  districtSelect: () => document.getElementById("districtSelect"),
  billModeSelect: () => document.getElementById("billModeSelect"),
  providerText: () => document.getElementById("providerText"),
  calcBtn: () => document.getElementById("calculateBtn"),
  resetBtn: () => document.getElementById("resetBtn"),
  unitsValue: () => document.getElementById("unitsUsedValue"),
  totalValue: () => document.getElementById("totalBillValue"),
  slabBreakdown: () => document.getElementById("slabBreakdown"),
  fixedCharges: () => document.getElementById("fixedCharges"),
  taxesAndDuties: () => document.getElementById("taxesAndDuties"),
  message: () => document.getElementById("resultMessage")
};

const fmtNumber = (n) =>
  typeof n === "number" && Number.isFinite(n)
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n)
    : "—";

const fmtMoney = (n) =>
  typeof n === "number" && Number.isFinite(n)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
      }).format(n)
    : "—";

function setMessage(type, text) {
  const el = els.message();
  if (!text) {
    el.hidden = true;
    el.className = "message";
    el.textContent = "";
    return;
  }
  el.hidden = false;
  el.className = `message ${type}`;
  el.textContent = text;
}

function setFieldError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (errorEl) errorEl.textContent = message || "";
}

function clearErrors() {
  setFieldError("lastPaidReading", "");
  setFieldError("currentReading", "");
  setFieldError("districtSelect", "");
  setFieldError("billModeSelect", "");
  setMessage("", "");
}

function parseNonNegative(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? { ok: true, value: n } : { ok: false, value: null };
}

async function loadSlabsJson() {
  // Fetch slabs.json; fallback to embedded JSON for file:// use.
  try {
    const res = await fetch("./slabs.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (_) {
    const embedded = document.getElementById("embeddedSlabs");
    if (!embedded) throw new Error("No slabs.json and no embedded fallback found.");
    return JSON.parse(embedded.textContent || "{}");
  }
}

function populateDistricts(data) {
  const select = els.districtSelect();
  while (select.options.length > 1) select.remove(1);
  const districts = Array.isArray(data?.districts) ? data.districts : [];
  for (const d of districts) {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.label;
    select.appendChild(opt);
  }
}

function findDistrict(data, districtId) {
  return (Array.isArray(data?.districts) ? data.districts : []).find((d) => d.id === districtId) || null;
}

function saveState() {
  const state = {
    lastPaidReading: els.lastPaid().value.trim(),
    currentReading: els.current().value.trim(),
    selectedDistrictId: els.districtSelect().value,
    selectedBillMode: els.billModeSelect().value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state.lastPaidReading) els.lastPaid().value = state.lastPaidReading;
    if (state.currentReading) els.current().value = state.currentReading;
    if (state.selectedDistrictId) els.districtSelect().value = state.selectedDistrictId;
    if (state.selectedBillMode) els.billModeSelect().value = state.selectedBillMode;
  } catch {
    /* ignore */
  }
}

function validateInputs() {
  clearErrors();
  const lastRaw = els.lastPaid().value.trim();
  const currRaw = els.current().value.trim();
  const districtId = els.districtSelect().value;
  const billMode = els.billModeSelect().value;

  let ok = true;
  let summaryError = "";
  if (!lastRaw) {
    setFieldError("lastPaidReading", t("msg.enterLastPaid"));
    ok = false;
  }
  if (!currRaw) {
    setFieldError("currentReading", t("msg.enterCurrent"));
    ok = false;
  }
  if (!districtId) {
    setFieldError("districtSelect", t("msg.selectDistrict"));
    summaryError = t("msg.selectDistrict");
    ok = false;
  }
  if (!billMode) {
    setFieldError("billModeSelect", t("msg.selectBillMode"));
    summaryError = t("msg.selectBillMode");
    ok = false;
  }

  const last = parseNonNegative(lastRaw);
  const curr = parseNonNegative(currRaw);
  if (lastRaw && !last.ok) {
    setFieldError("lastPaidReading", t("msg.enterValidNonNegative"));
    summaryError = t("msg.enterValidReadings");
    ok = false;
  }
  if (currRaw && !curr.ok) {
    setFieldError("currentReading", t("msg.enterValidNonNegative"));
    summaryError = t("msg.enterValidReadings");
    ok = false;
  }
  if (!ok) {
    if (summaryError) setMessage("error", summaryError);
    return { ok: false };
  }

  const unitsUsed = curr.value - last.value;
  if (unitsUsed <= 0) {
    setFieldError(
      "currentReading",
      unitsUsed < 0
        ? t("msg.currentLessThanLast")
        : t("msg.currentMustBeGreater")
    );
    setMessage("error", t("msg.meterContinuous"));
    return { ok: false };
  }

  return { ok: true, last: last.value, curr: curr.value, unitsUsed, districtId, billMode };
}

// Live validation for every field (shows field-level errors as the user types/selects).
// This does NOT block typing; it only updates error labels + Calculate button enabled state.
function validateInputsLive() {
  // Don't clear the top banner on every keystroke; keep it for submit-level messaging.
  setFieldError("lastPaidReading", "");
  setFieldError("currentReading", "");
  setFieldError("districtSelect", "");
  setFieldError("billModeSelect", "");

  const lastRaw = els.lastPaid().value.trim();
  const currRaw = els.current().value.trim();
  const districtId = els.districtSelect().value;
  const billMode = els.billModeSelect().value;

  if (!lastRaw) setFieldError("lastPaidReading", t("msg.required"));
  if (!currRaw) setFieldError("currentReading", t("msg.required"));
  if (!districtId) setFieldError("districtSelect", t("msg.required"));
  if (!billMode) setFieldError("billModeSelect", t("msg.required"));

  const last = parseNonNegative(lastRaw);
  const curr = parseNonNegative(currRaw);

  if (lastRaw && !last.ok) setFieldError("lastPaidReading", t("msg.enterValidNonNegative"));
  if (currRaw && !curr.ok) setFieldError("currentReading", t("msg.enterValidNonNegative"));

  if (last.ok && curr.ok) {
    const unitsUsed = curr.value - last.value;
    if (unitsUsed <= 0) {
      setFieldError(
        "currentReading",
        unitsUsed < 0
          ? t("msg.currentLessThanLast")
          : t("msg.currentMustBeGreater")
      );
    }
  }
}

function updateCalcDisabled() {
  const lastRaw = els.lastPaid().value.trim();
  const currRaw = els.current().value.trim();
  const districtId = els.districtSelect().value;
  const billMode = els.billModeSelect().value;
  const last = parseNonNegative(lastRaw);
  const curr = parseNonNegative(currRaw);
  const ok =
    !!lastRaw &&
    !!currRaw &&
    !!districtId &&
    !!billMode &&
    last.ok &&
    curr.ok &&
    curr.value - last.value > 0;
  els.calcBtn().disabled = !ok;
}

// Inclusive slab ranges (from/to). to === null means open-ended.
function calculateSlabs(slabs, units) {
  let remaining = units;
  const rows = [];
  for (const slab of slabs) {
    if (remaining <= 0) break;
    const start = slab.from;
    const end = slab.to === null || slab.to === undefined ? Infinity : slab.to;
    const span = end - start + 1;
    const inSlab = Math.max(0, Math.min(remaining, span));
    if (inSlab > 0) {
      const amount = Number((inSlab * slab.rate).toFixed(2));
      rows.push({
        from: start,
        to: slab.to,
        units: inSlab,
        rate: slab.rate,
        amount
      });
      remaining -= inSlab;
    }
  }
  return rows;
}

function renderBreakdown(rows) {
  const el = els.slabBreakdown();
  if (!rows || rows.length === 0) {
    el.className = "emptyState";
    el.textContent = t("msg.breakdownEmpty");
    return;
  }

  const subtotal = rows.reduce((acc, r) => acc + r.amount, 0);
  const body = rows
    .map((r) => {
      const toLabel = r.to == null ? "Above" : fmtNumber(r.to);
      return `<tr>
        <td>${fmtNumber(r.from)}</td>
        <td>${toLabel}</td>
        <td>${fmtNumber(r.units)}</td>
        <td>₹ ${fmtNumber(r.rate)}</td>
        <td>₹ ${fmtNumber(r.amount)}</td>
      </tr>`;
    })
    .join("");

  el.className = "";
  el.innerHTML = `
    <div class="tableWrap">
      <table class="table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Units Used</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
        <tfoot>
          <tr class="summaryRow">
            <td colspan="4">${t("msg.slabSubtotal")}</td>
            <td>₹ ${fmtNumber(subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

function renderFixedCharge(fixedCharge) {
  const fc = Number(fixedCharge) || 0;
  const el = els.fixedCharges();
  if (fc <= 0) {
    el.className = "emptyState";
    el.textContent = "—";
    return;
  }
  el.className = "";
  el.innerHTML = `
    <ul class="list">
      <li><span>${t("msg.fixedCharge")}</span><span>₹ ${fmtNumber(fc)}</span></li>
    </ul>
  `;
}

function calculateTaxes(taxesAndSurcharges, baseAmount) {
  const taxes = Array.isArray(taxesAndSurcharges) ? taxesAndSurcharges : [];
  const rows = [];
  for (const t of taxes) {
    if (!t || t.type !== "percentage") continue;
    const pct = Number(t.value);
    if (!Number.isFinite(pct)) continue;
    const amount = Number(((baseAmount * pct) / 100).toFixed(2));
    rows.push({
      label: String(t.label || "Tax"),
      type: "percentage",
      value: pct,
      amount
    });
  }
  const taxTotal = Number(rows.reduce((acc, r) => acc + r.amount, 0).toFixed(2));
  return { rows, taxTotal };
}

function renderTaxes(taxRows, taxTotal) {
  const el = els.taxesAndDuties();
  if (!el) return;
  if (!taxRows || taxRows.length === 0) {
    el.className = "emptyState";
    el.textContent = "—";
    return;
  }
  el.className = "";
  el.innerHTML = `
    <ul class="list">
      ${taxRows
        .map((t) => `<li><span>${t.label}</span><span>₹ ${fmtNumber(t.amount)}</span></li>`)
        .join("")}
      <li class="listTotal"><span>${t("msg.totalTax")}</span><span>₹ ${fmtNumber(taxTotal)}</span></li>
    </ul>
  `;
}

function updateResults(units, total) {
  els.unitsValue().textContent = units == null ? "—" : fmtNumber(units);
  els.totalValue().textContent = total == null ? "—" : fmtMoney(total);
}

function updateMeta({ district, provider, billMode }) {
  const districtEl = document.getElementById("metaDistrict");
  const providerEl = document.getElementById("metaProvider");
  const modeEl = document.getElementById("metaBillMode");
  if (districtEl) districtEl.textContent = district || "—";
  if (providerEl) providerEl.textContent = provider || "—";
  if (modeEl) modeEl.textContent = billMode || "—";
}

function resetUI() {
  els.lastPaid().value = "";
  els.current().value = "";
  els.districtSelect().value = "";
  els.billModeSelect().value = "";
  els.billModeSelect().disabled = true;
  els.providerText().value = "";
  clearErrors();
  updateResults(null, null);
  els.slabBreakdown().className = "emptyState";
  els.slabBreakdown().textContent = "Enter readings and select a district + bill mode to see the slab structure.";
  els.fixedCharges().className = "emptyState";
  els.fixedCharges().textContent = "—";
  els.taxesAndDuties().className = "emptyState";
  els.taxesAndDuties().textContent = "—";
  setMessage("", "");
  localStorage.removeItem(STORAGE_KEY);
  updateMeta({ district: "—", provider: "—", billMode: "—" });
  updateCalcDisabled();
}

function showWelcomeScreen() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  if (welcomeScreen) {
    welcomeScreen.hidden = false;
    document.body.style.overflow = "hidden";
  }
}

function hideWelcomeScreen() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  if (welcomeScreen) {
    welcomeScreen.hidden = true;
    document.body.style.overflow = "";
    // Don't save to localStorage - we want it to show every time
  }
}

function checkWelcomeScreen() {
  // Always show welcome screen on page load
  const welcomeScreen = document.getElementById("welcomeScreen");
  if (welcomeScreen) {
    welcomeScreen.hidden = false;
    document.body.style.overflow = "hidden";
  }
}

async function main() {
  // Check welcome screen FIRST, before anything else loads
  checkWelcomeScreen();
  
  const data = await loadSlabsJson();
  const langSelect = document.getElementById("langSelect");
  const initialLang = localStorage.getItem(LANG_KEY) || "en";
  if (langSelect) {
    langSelect.value = translations[initialLang] ? initialLang : "en";
    langSelect.addEventListener("change", () => {
      applyTranslations(langSelect.value);
      // Re-validate to refresh translated error strings
      validateInputsLive();
    });
  }
  applyTranslations(langSelect?.value || initialLang);
  
  const welcomeBtn = document.getElementById("welcomeGetStarted");
  const showWelcomeBtn = document.getElementById("showWelcomeBtn");

  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", () => {
      hideWelcomeScreen();
    });
  }

  if (showWelcomeBtn) {
    showWelcomeBtn.addEventListener("click", () => {
      showWelcomeScreen();
      applyTranslations(langSelect?.value || initialLang);
    });
  }

  // Save embedded fallback for offline/file:// reuse.
  const embedded = document.getElementById("embeddedSlabs");
  if (embedded && !embedded.textContent.trim()) {
    embedded.textContent = JSON.stringify(data);
  }

  populateDistricts(data);
  restoreState();
  // Set provider + enable bill mode if state restored
  const restoredDistrict = els.districtSelect().value;
  if (restoredDistrict) {
    const d = findDistrict(data, restoredDistrict);
    els.providerText().value = d?.provider || "";
    els.billModeSelect().disabled = !d;
  }
  updateMeta({
    district: els.districtSelect().options[els.districtSelect().selectedIndex]?.textContent || "—",
    provider: els.providerText().value || "—",
    billMode: els.billModeSelect().options[els.billModeSelect().selectedIndex]?.textContent || "—"
  });
  // Apply initial live validation (after restore)
  validateInputsLive();
  updateCalcDisabled();

  const handleDistrictChange = () => {
    const districtId = els.districtSelect().value;
    const district = findDistrict(data, districtId);
    els.providerText().value = district?.provider || "";
    if (!district) {
      els.billModeSelect().value = "";
      els.billModeSelect().disabled = true;
    } else {
      els.billModeSelect().disabled = false;
    }
    updateMeta({
      district: district?.label || "—",
      provider: district?.provider || "—",
      billMode: els.billModeSelect().value ? els.billModeSelect().options[els.billModeSelect().selectedIndex].textContent : "—"
    });
    saveState();
    validateInputsLive();
    updateCalcDisabled();
  };

  els.districtSelect().addEventListener("change", handleDistrictChange);

  els.billModeSelect().addEventListener("change", () => {
    updateMeta({
      district: els.districtSelect().options[els.districtSelect().selectedIndex]?.textContent || "—",
      provider: els.providerText().value || "—",
      billMode: els.billModeSelect().options[els.billModeSelect().selectedIndex]?.textContent || "—"
    });
    saveState();
    validateInputsLive();
    updateCalcDisabled();
  });
  els.lastPaid().addEventListener("input", () => {
    saveState();
    validateInputsLive();
    updateCalcDisabled();
  });
  els.current().addEventListener("input", () => {
    saveState();
    validateInputsLive();
    updateCalcDisabled();
  });

  // Also validate on blur so required errors appear even if user tabs through.
  els.lastPaid().addEventListener("blur", validateInputsLive);
  els.current().addEventListener("blur", validateInputsLive);
  els.districtSelect().addEventListener("blur", validateInputsLive);
  els.billModeSelect().addEventListener("blur", validateInputsLive);

  els.form().addEventListener("submit", (e) => {
    e.preventDefault();
    const val = validateInputs();
    saveState();
    if (!val.ok) {
      validateInputsLive();
      updateCalcDisabled();
      return;
    }

    // Show loading feedback
    const calcBtn = els.calcBtn();
    const originalText = calcBtn.textContent;
    calcBtn.disabled = true;
    calcBtn.textContent = t("msg.calculating");
    setMessage("", "");

    // Use setTimeout to allow UI to update, then calculate
    setTimeout(() => {
      const district = findDistrict(data, val.districtId);
      if (!district) {
        setMessage("error", "Selected district not found in slabs.json.");
        calcBtn.disabled = false;
        calcBtn.textContent = originalText;
        return;
      }

      const modeData = district.billModes ? district.billModes[val.billMode] : null;
      if (!modeData) {
        setMessage("error", "Selected bill mode not available for this district.");
        calcBtn.disabled = false;
        calcBtn.textContent = originalText;
        return;
      }

      const breakdown = calculateSlabs(modeData.slabs || [], val.unitsUsed);
      const slabTotal = breakdown.reduce((acc, r) => acc + r.amount, 0);
      const fixed = Number(modeData.fixedCharge) || 0;
      const baseAmount = Number((slabTotal + fixed).toFixed(2));
      const { rows: taxRows, taxTotal } = calculateTaxes(modeData.taxesAndSurcharges, baseAmount);
      const total = Number((baseAmount + taxTotal).toFixed(2));

      renderBreakdown(breakdown);
      renderFixedCharge(fixed);
      renderTaxes(taxRows, taxTotal);
      updateResults(val.unitsUsed, total);
      updateMeta({
        district: district.label,
        provider: district.provider || "—",
        billMode: val.billMode
      });
      setMessage("success", t("msg.estimatedNotOfficial"));
      
      // Restore button
      calcBtn.disabled = false;
      calcBtn.textContent = originalText;
      updateCalcDisabled();
      
      // Smooth scroll to results
      document.querySelector('[aria-label="Results"]')?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  });

  els.resetBtn().addEventListener("click", resetUI);
}

main().catch((err) => {
  console.error(err);
  setMessage("error", "Failed to load slab data. Please refresh the page.");
});