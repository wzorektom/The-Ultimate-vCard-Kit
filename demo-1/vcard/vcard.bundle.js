/**
 * ================================
 * 🔧 Editable Profile Configuration
 * ================================
 * 
 * Edit ONLY the JSON data in `cardData.json`.
 * This script dynamically loads and injects your vCard content.
 * 
 * GENERAL:
 * - Keep all text values inside quotes ("...")
 * - Make sure images exist in your /images folder or use full URLs
 * - Do not remove keys, just update values in the JSON
 * 
 * ================================
 * FIELD OVERVIEW:
 * -------------------------------
 * fullName, jobTitle, company        → Shown on card and in vCard file
 * email, telNumber, whatsappNumber  → Used for contact links and vCard
 * address                           → Displayed and saved in vCard ADR field
 * bio                               → Short personal description on card
 * companyDescription                → Longer "About" text in company section
 * 
 * ================================
 * SOCIAL PROFILES:
 * -------------------------------
 * Use the "type" to match available icons (e.g. facebook, twitter)
 * Enable/disable profiles via the `enabled` boolean flag.
 * 
 * ================================
 * IMAGES:
 * -------------------------------
 * profileImage → Headshot photo
 * coverImage   → Header background/banner image
 * 
 * ================================
 * REVIEWS:
 * -------------------------------
 * ratingValue           → Numeric 0 to 5.0 star rating
 * googleBusinessProfile → Link to Google reviews page
 * reviewLinkText        → Label text for review link
 * 
 * ================================
 * QR MODAL:
 * -------------------------------
 * qrHeading, qrDescription → Text shown in the QR modal
 * 
 * ================================
 * FOOTER INFO:
 * -------------------------------
 * footerTagline       → Footer slogan text
 * footerCompanyName   → Text for footer company link
 * footerCompanyUrl    → URL for footer company link
 * 
 * ================================
 * SHARING META:
 * -------------------------------
 * shareTitle → Title shown in native share dialogs
 * shareText  → Description shown in native share dialogs
 */

// Global card data container
let cardData = {};

// Load cardData.json asynchronously
async function loadCardData() {
  try {
    const response = await fetch("./cardData.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load cardData.json");
    cardData = await response.json();
  } catch (err) {
    console.error("Error loading card data:", err);
    alert("Problem loading card data.");
  }
}

/**
 * Resolve relative paths to full URLs using baseUrl.
 * If path is already absolute (http/https), return as-is.
 * Ensures exactly one slash between baseUrl and path.
 */
function resolveUrl(baseUrl, path) {
 // console.log("Resolving URL:", { baseUrl, path });
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // absolute URL, return as is
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith("/") ? path : "/" + path;
 // console.log("Resolved URL:", base + p);
  return base + p;
}

/**
 * Injects SEO meta tags dynamically into the <head>.
 * Supports Open Graph, Twitter Cards, and icons.
 */
function injectMetaTags(meta = {}, baseUrl = "") {
  document.title = meta.title || "Digital Business Card";

  document.getElementById("meta-title").textContent = meta.title || "";
  document.getElementById("meta-description").setAttribute("content", meta.description || "");
  document.getElementById("meta-author").setAttribute("content", meta.author || "");

  // Open Graph
  document.getElementById("og-title").setAttribute("content", meta.og?.title || "");
  document.getElementById("og-description").setAttribute("content", meta.og?.description || "");
  document.getElementById("og-image").setAttribute("content", resolveUrl(baseUrl, meta.og?.image || ""));
  document.getElementById("og-url").setAttribute("content", meta.og?.url || baseUrl);

  // Twitter Card
  document.getElementById("twitter-title").setAttribute("content", meta.twitter?.title || "");
  document.getElementById("twitter-description").setAttribute("content", meta.twitter?.description || "");
  document.getElementById("twitter-image").setAttribute("content", resolveUrl(baseUrl, meta.twitter?.image || ""));
  document.getElementById("twitter-url").setAttribute("content", meta.twitter?.url || baseUrl);

  // Favicons and touch icons
  document.getElementById("favicon-link").setAttribute("href", resolveUrl(baseUrl, meta.favicon || "images/favi-100x100.png"));
  document.getElementById("apple-touch-icon").setAttribute("href", resolveUrl(baseUrl, meta.appleTouchIcon || "images/bookmark-128x128.png"));
}

/**
 * Renders 5 stars with opacity based on rating value (e.g., 4.5).
 * Uses CSS classes for opacity (e.g. opacity-50).
 */
function renderRatingStars(value) {
  const rating = parseFloat(value) || 0;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const opacity = Math.min(1, Math.max(0, rating - (i - 1)));
    const className = `star-dynamic opacity-${Math.round(opacity * 100)}`;
    html += `<span class="${className}">★</span>`;
  }
  return html;
}

/**
 * Sanitize phone number by removing everything except digits and plus sign.
 */
function sanitizePhone(number) {
  if (!number) return "";
  return number.replace(/[^\d+]/g, "");
}

/**
 * Injects all card data into the DOM:
 * - Text content, images, contact links, reviews, footer
 */
function injectCardData() {
  const baseUrl = cardData.baseUrl || "";

  // Helper to set text content on all matching elements
  const setText = (selector, text) => {
    document.querySelectorAll(selector).forEach(el => el.textContent = text);
  };

  setText(".profile-name", cardData.fullName || "Missing Full Name");
  setText(".profile-job-title", cardData.jobTitle || "Job Title Unavailable");
  setText(".profile-address", cardData.address || "Business Location Unavailable");
  setText(".profile-bio", cardData.bio || "Bio Description Unavailable");
  setText(".company-description", cardData.companyDescription || "Company Description Unavailable");

  // Footer company link
  const footerLink = document.getElementById("site-footer-link");
  if (footerLink) {
    footerLink.href = cardData.footerCompanyUrl || "#";
    footerLink.textContent = cardData.footerCompanyName || "";
    footerLink.target = "_blank";
    footerLink.rel = "noopener noreferrer";
  }

  // Footer tagline
  const tagline = document.getElementById("site-footer-tagline");
  if (tagline) tagline.textContent = cardData.footerTagline || "";

  // Current year
  const yearSpan = document.getElementById("site-footer-year");
  if (yearSpan) yearSpan.textContent = ` | ${new Date().getFullYear()}`;

  // Load images with resolveUrl
  const profileImg = document.getElementById("profile-avatar");
  if (profileImg) profileImg.src = resolveUrl(baseUrl, cardData.profileImage);

  const coverImg = document.getElementById("header-cover-image");
  if (coverImg) coverImg.src = resolveUrl(baseUrl, cardData.coverImage);

  // Reviews section
  const reviewLink = document.querySelector(".company-info-review-link");
  if (reviewLink) {
    reviewLink.href = cardData.googleBusinessProfile || "#";
    reviewLink.textContent = cardData.reviewLinkText || "Read Reviews";
    reviewLink.target = "_blank";
    reviewLink.rel = "noopener noreferrer";
  }

  const stars = document.querySelector(".company-info-stars");
  if (stars) stars.innerHTML = renderRatingStars(cardData.ratingValue);

  const rating = document.querySelector(".company-info-rating-value");
  if (rating) rating.textContent = cardData.ratingValue || "";

  // Contact action links
  const whatsappLink = document.getElementById("whatsapp-link");
  if (whatsappLink && cardData.whatsappNumber) {
    whatsappLink.href = `https://wa.me/${sanitizePhone(cardData.whatsappNumber).replace(/\D/g, "")}`;
  }

  const callLink = document.getElementById("call-link");
  if (callLink && cardData.telNumber) {
    callLink.href = `tel:${sanitizePhone(cardData.telNumber)}`;
  }

  const emailLink = document.getElementById("email-link");
  if (emailLink && cardData.email) {
    emailLink.href = `mailto:${cardData.email}`;
  }

  // QR modal text
  const qrTitle = document.getElementById("qr-modal-title");
  if (qrTitle) qrTitle.textContent = cardData.qrHeading || "Scan the QR Code";

  const qrDescription = document.getElementById("qr-modal-description");
  if (qrDescription) qrDescription.textContent = cardData.qrDescription || "";
}

/**
 * Inject social media icons into #social-links container.
 * Only show profiles with enabled !== false.
 */
function renderSocialProfiles(profiles) {
  const container = document.getElementById("social-links");
  if (!container || !Array.isArray(profiles)) return;

  container.innerHTML = ""; // Clear existing

  profiles
    .filter(p => p.enabled !== false && p.type && p.url)
    .forEach(({ type, url }) => {
      const iconId = `#icon-${type.toLowerCase()}`;

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", type);
      a.classList.add(type.toLowerCase());

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.setAttribute("viewBox", "0 0 256 256");
      svg.setAttribute("width", "28");
      svg.setAttribute("height", "28");

      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttributeNS("http://www.w3.org/1999/xlink", "href", iconId);
      svg.appendChild(use);

      a.appendChild(svg);
      container.appendChild(a);
    });
}

/**
 * Generate an SVG QR code with color inherited from CSS.
 * @param {string} content - Data to encode (URL)
 * @param {number} [size=256] - SVG width/height in px
 * @param {number} [padding=0] - Padding modules
 * @param {string} [background="#fff"] - Background color
 * @returns {SVGElement} SVG element with QR code
 */
function generateQRCodeSVG(content, size = 256, padding = 0, background = "#ffffff") {
  const qr = new QRCode({ content, width: size, height: size, padding, color: "#000", background });
  const modules = qr.qrcode.modules;
  const count = modules.length;
  const scale = size / (count + 2 * padding);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", size);
  bg.setAttribute("height", size);
  bg.setAttribute("fill", background);
  svg.appendChild(bg);

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules[row][col]) continue;

      const x = Math.round((col + padding) * scale);
      const y = Math.round((row + padding) * scale);

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", scale);
      rect.setAttribute("height", scale);
      rect.setAttribute("fill", "currentColor");
      svg.appendChild(rect);
    }
  }

  return svg;
}

/**
 * Set up QR code modal and share button.
 * - Toggle modal visibility with smooth CSS transition
 * - Generate QR code SVG with current URL
 * - Use Web Share API if available, fallback to QR modal
 */
function setupQRModalAndSharing() {
  const modal = document.getElementById("qr-modal");
  const closeBtn = document.getElementById("qr-modal-close");
  const qrView = document.getElementById("qr-modal-qr-section");
  const qrContainer = document.getElementById("qr-code");
  const qrTrigger = document.getElementById("showQR");
  const shareBtn = document.getElementById("share");

  function toggleModal(el) {
    if (el.style.top === "0px") {
      el.style.top = "2rem";
      el.style.opacity = 0;
      setTimeout(() => (el.style.visibility = "hidden"), 200);
    } else {
      el.style.visibility = "visible";
      el.style.top = "0px";
      el.style.opacity = 1;
    }
  }

  // Make header actions visible
  const headerActions = document.querySelector("#header-actions");
  if (headerActions) headerActions.style.display = "flex";

  // Generate QR code SVG with current page URL
  const qrSvg = generateQRCodeSVG(window.location.href, 256, 0);
  qrContainer.innerHTML = "";
  qrContainer.appendChild(qrSvg);

  // Web Share API
  if (shareBtn && navigator.share) {
    shareBtn.addEventListener("click", e => {
      e.preventDefault();
      navigator
        .share({
          title: cardData.shareTitle || document.title,
          text: cardData.shareText,
          url: window.location.href
        })
        .catch(console.warn);
    });
  } else if (shareBtn) {
    shareBtn.addEventListener("click", e => {
      e.preventDefault();
      toggleModal(modal);
      qrView.style.display = "block";
    });
  }

  closeBtn.addEventListener("click", () => toggleModal(modal));
  qrTrigger.addEventListener("click", () => {
    toggleModal(modal);
    qrView.style.display = "block";
  });
}

/**
 * Create and download .vcf vCard file with embedded profile photo as base64.
 * Automatically names the file from fullName.
 */
async function createAndDownloadVCard() {
  try {
    if (!cardData.fullName) {
      alert("Missing name information.");
      return;
    }

    const [firstName, ...lastParts] = cardData.fullName.trim().split(" ");
    const lastName = lastParts.join(" ") || "";

    const imgUrl = resolveUrl(cardData.baseUrl, cardData.profileImage);
    const response = await fetch(imgUrl);
    if (!response.ok) throw new Error("Failed to load profile image.");

    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64 = reader.result.split(",")[1];

      const vcardLines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName};;;`,
        `FN:${cardData.fullName}`,
        `ORG:${cardData.company || ""}`,
        `TITLE:${cardData.jobTitle || ""}`,
        `PHOTO;ENCODING=b;TYPE=PNG:${base64}`,
        `TEL;TYPE=cell,voice:${sanitizePhone(cardData.telNumber)}`,
        `TEL;TYPE=work,voice:${sanitizePhone(cardData.officeNumber)}`,
        `EMAIL;TYPE=internet:${cardData.email}`
      ];

      if (cardData.birthday) vcardLines.push(`BDAY:${cardData.birthday}`);
      if (cardData.address) vcardLines.push(`ADR;TYPE=work:;;${cardData.address.replace(/,/g, ";")}`);
      if (cardData.websiteUrl) vcardLines.push(`URL:${cardData.websiteUrl}`);

      if (Array.isArray(cardData.socialProfiles)) {
        cardData.socialProfiles.forEach(({ type, url }) => {
          if (type && url) vcardLines.push(`X-SOCIALPROFILE;type=${type}:${url}`);
        });
      }

      if (cardData.whatsappNumber) {
        const waUrl = `https://wa.me/${sanitizePhone(cardData.whatsappNumber)}`;
        vcardLines.push(`X-ABLabel:WhatsApp`);
        vcardLines.push(`X-SOCIALPROFILE;type=whatsapp:${waUrl}`);
      }

      if (cardData.googleBusinessProfile) {
        vcardLines.push(`X-ABLabel:GoogleReviews`);
        vcardLines.push(`X-SOCIALPROFILE;type=review:${cardData.googleBusinessProfile}`);
      }

      if (cardData.bio) vcardLines.push(`NOTE:${cardData.bio}`);

      vcardLines.push("END:VCARD");

      const vcardString = vcardLines.join("\n");
      const vcardBlob = new Blob([vcardString], { type: "text/vcard;charset=utf-8" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(vcardBlob);
      link.download = `${firstName.toLowerCase()}${lastName.toLowerCase()}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("vCard generation error:", error);
    if (location.protocol === "file:" || error.message.includes("Failed to load profile image")) {
      alert("Run this on a web server or use full image URLs. Local file access is restricted.");
    } else {
      alert("Error generating vCard.");
    }
  }
}

// Initialize after DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadCardData();
  injectMetaTags(cardData.meta, cardData.baseUrl);
  injectCardData();
  setupQRModalAndSharing();
  renderSocialProfiles(cardData.socialProfiles);

  const saveBtn = document.getElementById("vcf-save-contact");
  if (saveBtn) {
    saveBtn.addEventListener("click", e => {
      e.preventDefault();
      createAndDownloadVCard();
    });
  }
});
