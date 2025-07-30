/**
 * vCard Bundle – Main Logic
 * ==========================
 * This script loads `cardData.json`, populates the page dynamically,
 * and powers features like social icons, share modal, and vCard export.
 *
 * Edit ONLY `cardData.json` — this script reads from it.
 */

let cardData = {};

/**
 * Load cardData from external JSON file.
 */
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
 * Clean phone numbers for use in `tel:` and WhatsApp links.
 */
function sanitizePhone(number) {
  return number ? number.replace(/[^\d+]/g, "") : "";
}

/**
 * Generate a QR code in SVG format with currentColor fill.
 */
function generateQRCodeSVG(content, size = 256, padding = 0, background = "#ffffff") {
  const qr = new QRCode({ content, width: size, height: size, padding, color: "#000", background });
  const modules = qr.qrcode.modules;
  const count = modules.length;
  const scale = size / (count + 2 * padding);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("width", size);
  bg.setAttribute("height", size);
  bg.setAttribute("fill", background);
  svg.appendChild(bg);

  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!modules[r][c]) continue;
      const x = (c + padding) * scale;
      const y = (r + padding) * scale;
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
 * Setup share button and QR modal toggle logic.
 */
function setupQRModalAndSharing() {
  const modal = document.getElementById("qr-modal");
  const closeBtn = document.getElementById("qr-modal-close");
  const qrView = document.getElementById("qr-modal-qr-section");
  const qrContainer = document.getElementById("qr-code");
  const qrTrigger = document.getElementById("showQR");
  const shareBtn = document.getElementById("share");

  const toggleModal = (el) => {
    const open = el.style.top === "0px";
    el.style.top = open ? "2rem" : "0px";
    el.style.opacity = open ? 0 : 1;
    el.style.visibility = open ? "hidden" : "visible";
  };

  const qrSvg = generateQRCodeSVG(window.location.href, 256);
  qrContainer.innerHTML = "";
  qrContainer.appendChild(qrSvg);

  if (shareBtn && navigator.share) {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.share({
        title: cardData.shareTitle || document.title,
        text: cardData.shareText,
        url: window.location.href,
      }).catch(console.warn);
    });
  } else if (shareBtn) {
    shareBtn.addEventListener("click", (e) => {
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
 * Loop through provided socialProfiles array and inject icons.
 */
function renderSocialProfiles(profiles) {
  const container = document.getElementById("social-links");
  if (!container || !Array.isArray(profiles)) return;
  container.innerHTML = "";

  profiles.filter(p => p.enabled !== false && p.type && p.url).forEach(({ type, url }) => {
    const iconId = `#icon-${type.toLowerCase()}`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", type);
    a.classList.add(type.toLowerCase());

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
 * Inject vCard profile data into the DOM.
 */
function injectCardData() {
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => (el.textContent = value));
  };

  setText(".profile-name", cardData.fullName);
  setText(".profile-job-title", cardData.jobTitle);
  setText(".profile-address", cardData.address);
  setText(".profile-bio", cardData.bio);
  setText(".company-description", cardData.companyDescription);

  const avatar = document.getElementById("profile-avatar");
  if (avatar) avatar.src = cardData.profileImage;
  const cover = document.getElementById("header-cover-image");
  if (cover) cover.src = cardData.coverImage;

  const footerLink = document.getElementById("site-footer-link");
  if (footerLink) {
    footerLink.href = cardData.footerCompanyUrl;
    footerLink.textContent = cardData.footerCompanyName;
    footerLink.target = "_blank";
    footerLink.rel = "noopener noreferrer";
  }

  const tagline = document.getElementById("site-footer-tagline");
  if (tagline) tagline.textContent = cardData.footerTagline;
  const year = document.getElementById("site-footer-year");
  if (year) year.textContent = ` | ${new Date().getFullYear()}`;

  const reviewLink = document.querySelector(".company-info-review-link");
  if (reviewLink) {
    reviewLink.href = cardData.googleBusinessProfile;
    reviewLink.textContent = cardData.reviewLinkText;
    reviewLink.target = "_blank";
    reviewLink.rel = "noopener noreferrer";
  }

  const stars = document.querySelector(".company-info-stars");
  if (stars) stars.innerHTML = renderRatingStars(cardData.ratingValue);
  const rating = document.querySelector(".company-info-rating-value");
  if (rating) rating.textContent = cardData.ratingValue;

  const tel = document.getElementById("call-link");
  if (tel) tel.href = `tel:${sanitizePhone(cardData.telNumber)}`;
  const wa = document.getElementById("whatsapp-link");
  if (wa) wa.href = `https://wa.me/${sanitizePhone(cardData.whatsappNumber).replace(/\D/g, "")}`;
  const mail = document.getElementById("email-link");
  if (mail) mail.href = `mailto:${cardData.email}`;

  const qrTitle = document.getElementById("qr-modal-title");
  if (qrTitle) qrTitle.textContent = cardData.qrHeading;
  const qrDesc = document.getElementById("qr-modal-description");
  if (qrDesc) qrDesc.textContent = cardData.qrDescription;
}

/**
 * Inject star rating as Unicode ★ with CSS classes for opacity.
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
 * Export and download contact info as .vcf file.
 */
async function createAndDownloadVCard() {
  try {
    if (!cardData.fullName) return alert("Missing name info");
    const [first, ...lastArr] = cardData.fullName.trim().split(" ");
    const last = lastArr.join(" ");

    const response = await fetch(cardData.profileImage);
    if (!response.ok) throw new Error("Failed to load image");
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64 = reader.result.split(",")[1];
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${last};${first};;;`,
        `FN:${cardData.fullName}`,
        `ORG:${cardData.company}`,
        `TITLE:${cardData.jobTitle}`,
        `PHOTO;ENCODING=b;TYPE=PNG:${base64}`,
        `TEL;TYPE=cell:${sanitizePhone(cardData.telNumber)}`,
        `TEL;TYPE=work:${sanitizePhone(cardData.officeNumber)}`,
        `EMAIL;TYPE=internet:${cardData.email}`,
      ];
      if (cardData.address) lines.push(`ADR:;;${cardData.address.replace(/,/g, ";")}`);
      if (cardData.websiteUrl) lines.push(`URL:${cardData.websiteUrl}`);
      if (cardData.birthday) lines.push(`BDAY:${cardData.birthday}`);
      if (cardData.bio) lines.push(`NOTE:${cardData.bio}`);

      if (Array.isArray(cardData.socialProfiles)) {
        cardData.socialProfiles.forEach(({ type, url }) => {
          if (type && url) lines.push(`X-SOCIALPROFILE;type=${type}:${url}`);
        });
      }
      if (cardData.whatsappNumber) lines.push(`X-SOCIALPROFILE;type=whatsapp:https://wa.me/${sanitizePhone(cardData.whatsappNumber)}`);
      if (cardData.googleBusinessProfile) lines.push(`X-SOCIALPROFILE;type=review:${cardData.googleBusinessProfile}`);

      lines.push("END:VCARD");
      const blob = new Blob([lines.join("\n")], { type: "text/vcard;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${first.toLowerCase()}${last.toLowerCase()}.vcf`;
      link.click();
    };
    reader.readAsDataURL(blob);
  } catch (err) {
    console.error(err);
    alert("Failed to generate vCard");
  }
}

// Main init on page load

document.addEventListener("DOMContentLoaded", async () => {
  await loadCardData();
  injectCardData();
  renderSocialProfiles(cardData.socialProfiles);
  setupQRModalAndSharing();

  const save = document.getElementById("vcf-save-contact");
  if (save) save.addEventListener("click", (e) => {
    e.preventDefault();
    createAndDownloadVCard();
  });
});
