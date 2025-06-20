/**
 * ================================
 * 🔧 Editable Profile Configuration
 * ================================
 * 
 * This is the only file you need to edit to personalize your digital vCard.
 * Update the values below to reflect your name, contact info, images, and social media.
 * 
 * GENERAL INSTRUCTIONS:
 * - Keep text inside quotes ("...")
 * - Make sure image filenames match files in your /images folder
 * - Do not remove keys — just update their values
 * 
 * ================================
 * FIELD OVERVIEW:
 * ----------------------------
 * fullName, jobTitle, company       → Shown prominently on the card and saved in the vCard file
 * email, telNumber, whatsappNumber → Used in buttons and vCard export
 * address                          → Visible on card, stored in vCard ADR field
 * bio                              → Short personal blurb below your name
 * companyDescription               → Longer paragraph shown in the “About Company” section
 * 
 * ================================
 * SOCIAL PROFILES:
 * ----------------------------
 * - Add or remove platforms by editing the socialProfiles array
 * - Use the "type" that matches available icons (e.g. youtube, facebook, linkedin)
 * - Only the first `numberOfIcons` will be shown
 * 
 * ================================
 * IMAGES:
 * ----------------------------
 * profileImage → Your headshot 
 * coverImage   → Background banner image for the header 
 * 
 * ================================
 * REVIEWS:
 * ----------------------------
 * ratingValue            → Number from 0 to 5.0, controls star display
 * googleBusinessProfile  → Link to your public reviews
 * reviewLinkText         → Label text shown on the link
 * 
 * ================================
 * QR MODAL:
 * ----------------------------
 * qrHeading, qrDescription → Shown when user opens the QR code overlay
 * 
 * ================================
 * FOOTER INFO:
 * ----------------------------
 * footerTagline         → Short slogan in the footer
 * footerCompanyName     → Text of the footer link
 * footerCompanyUrl      → URL the footer link points to
 * 
 * ================================
 * SHARING META:
 * ----------------------------
 * shareTitle → Title shown in Web Share prompt
 * shareText  → Description in Web Share prompt
 */

const cardData = {

  // === Identity / Personal Info ===
  fullName: "Liam Thorley",               // Full name shown on the card and in vCard
  jobTitle: "Client Relations Manager",  // Job title under name and in vCard
  company: "My Company Solutions Ltd",             // Company name shown on the card and in vCard
  birthday: "19900101",                  // Optional birthday in YYYYMMDD format

  // === Contact Information ===
  email: "liamthorley@mycompany.com",           // Email address (mailto: link + vCard)
  telNumber: "+440000000001",            // Telephone number (tel: link + vCard) e.g. +44 (0) 1234 567 890
  officeNumber: "+440000000002",          // Office/Landline
  whatsappNumber: "+440000000001",       // WhatsApp number (used in wa.me link)
  websiteUrl: "https://mycompany.com",   // Optional personal/business website


  // === Social Profiles - uncomment the profiles you want and comment the others - change number of icons to show ===

  numberOfIcons: 3, // Set how many social icons you want to show - 3 by default

  socialProfiles: [
    
    { type: "youtube", url: "https://youtube.com/liamthorley" },
    { type: "tiktok", url: "https://tiktok.com/liamthorley" },
    { type: "twitter", url: "https://twitter.com/liamthorley" },
    /*
    { type: "facebook", url: "https://twitter.com/liamthorley" },
    { type: "instagram", url: "https://instagram.com/liamthorley" },
    { type: "discord", url: "https://discord.com/users/liamthorley" },
    { type: "linkedin", url: "https://linkedin.com/liamthorley" },
    { type: "pinterest", url: "https://pinterest.com/liamthorley" },
    { type: "nextdoor", url: "https://nextdoor.com/liamthorley" } 
      */
  ],


  // === Address ===
  address: "10 Edgware Road, London, W5 7HA, United Kingdom", // Full business address (shown + vCard ADR)

  // === Biography / About ===
  bio: "My Company helps small businesses grow through smart digital strategies and personalised support.", // Short tagline (used in card + vCard NOTE)
  companyDescription: "At My Company, we take time to understand your business goals and challenges. Whether you're launching something new or improving what already works, our flexible approach ensures every solution fits your unique needs.", // Optional long description (not in vCard)

  // === Reviews Section ===
  reviewLinkText: "Check Our Reviews on Google",                            // Text shown as the link to your reviews
  googleBusinessProfile: "https://g.page/yourbiz",                 // Link to your Google Business Profile or any other business profile
  ratingValue: "4.5",                                                       // Numeric rating value (Automatically adjusts the stars)

  // === QR Modal Content ===
  qrHeading: "Scan the QR Code",             // Heading shown in the QR popup modal
  qrDescription: "to view my Business Card on another device", // Description below QR

  // === Footer Link ===
  footerTagline: "Smart connections start with a digital card.",
  footerCompanyUrl: "https://mycompany.com/", // URL of footer company link
  footerCompanyName: "My Company Solutions Ltd",        // Link text for footer

  // === Image & Icon Files (filenames must match files in the folder) ===
  profileImage: "images/headshoot-300x300.png",      // Profile photo (shown + embedded in vCard)
  coverImage: "images/cover-960x640.png",            // Header background image

  // === Metadata / SEO / Sharing ===
  shareTitle: "Liam Thorley Digital Business Card", // Title used by Web Share API
  shareText: "You can view my Digital Business Card here:" // Web Share API description

};



// =============================================================
// 🚫 DO NOT EDIT BELOW THIS LINE
// =============================================================
// The following code powers the dynamic rendering, vCard export,
// QR functionality, and contact logic. Changing anything below
// may break the functionality of your digital business card.
//
// You only need to customize the `cardData` object above.
// =============================================================




/**
 * Renders a 5-star rating with dynamic opacity based on a numeric rating.
 *
 * - Always renders 5 full stars (★)
 * - Applies opacity to each star according to the score (e.g. 4.5)
 * - Higher rating = more opaque stars
 * - Fully CSP-compliant: uses class-based styling, no inline styles
 *
 * @param {string|number} value - Numeric rating value (e.g. "4.2")
 * @returns {string} - HTML string of 5 span elements with opacity classes
 */

function renderRatingStars(value) {
  const rating = parseFloat(value);
  let html = "";

  for (let i = 1; i <= 5; i++) {
    const opacity = Math.min(1, Math.max(0, rating - (i - 1)));
    const className = `star-dynamic opacity-${Math.round(opacity * 100)}`;
    html += `<span class="${className}">★</span>`;
  }

  return html;
}



/**
 * Populates the vCard page with dynamic data from the `cardData` object.
 *
 * This function injects all editable content into the DOM, including:
 * - Profile name, job title, address, bio, and avatar image
 * - Company description and review link
 * - Footer tagline, company link, and current year
 * - Header cover image
 * - Contact action buttons (call, email, WhatsApp)
 * - Star rating display and numeric score
 * - QR modal title and description
 *
 * It uses helper logic to safely fall back on default text if values are missing.
 * Also builds proper URLs for images and contact actions.
 *
 * @requires {Object} cardData - Must contain structured fields like `fullName`, `profileImage`, `companyDescription`, etc.
 * @requires {Function} renderRatingStars - Used to generate star rating HTML
 * @requires {Function} sanitizePhone - Used to safely format phone numbers for call/WhatsApp links
 */

function injectCardData() {
  // Determine the base path of the current directory
  const base = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "");

  // Helper to set inner text for multiple elements sharing the same class
  const setText = (selector, text) => {
    document.querySelectorAll(selector).forEach(el => el.textContent = text);
  };

  // Insert profile and company information
  setText(".profile-name", cardData.fullName || "Missing Full Name");                                // Full name
  setText(".profile-job-title", cardData.jobTitle || "Job Title Unavailable");                       // Job title
  setText(".profile-address", cardData.address || "Business Location Unavailable");                  // Business address
  setText(".profile-bio", cardData.bio || "Bio Description Unavailable");                            // Short bio / tagline
  setText(".company-description", cardData.companyDescription || "Company Description Unavailable"); // Longer company description

  // Update footer link with company name and URL
  const footerLink = document.getElementById("site-footer-link");
  if (footerLink) {
    footerLink.href = cardData.footerCompanyUrl;              // Website URL
    footerLink.textContent = cardData.footerCompanyName;      // Link text
    footerLink.target = "_blank";                             // Opens in new tab
    footerLink.rel = "noopener noreferrer";                   // Security best practice
  }

  // Inject footer tagline
  const tagline = document.getElementById("site-footer-tagline");
  if (tagline) tagline.textContent = cardData.footerTagline || "";

  // Inject current year dynamically
  const yearSpan = document.getElementById("site-footer-year");
  if (yearSpan) yearSpan.textContent = ` | ${new Date().getFullYear()}`;

  // Load profile and header images
  const profileImg = document.getElementById("profile-avatar");
  if (profileImg) profileImg.src = `${base}/${cardData.profileImage}`; // Headshot
  const coverImg = document.getElementById("header-cover-image");
  if (coverImg) coverImg.src = `${base}/${cardData.coverImage}`;       // Cover/banner image

  // Update reviews section
  const reviewLink = document.querySelector(".company-info-review-link");
  if (reviewLink) {
    reviewLink.href = cardData.googleBusinessProfile;
    reviewLink.textContent = cardData.reviewLinkText;
    reviewLink.target = "_blank";
    reviewLink.rel = "noopener noreferrer";
  }


  const stars = document.querySelector(".company-info-stars");
  if (stars) stars.innerHTML = renderRatingStars(cardData.ratingValue);        // Star icons (can use HTML)

  const rating = document.querySelector(".company-info-rating-value");
  if (rating) rating.textContent = cardData.ratingValue;    // Numeric rating (e.g. “4.9”)

  // Create clickable contact actions
  const whatsappLink = document.getElementById("whatsapp-link");
  if (whatsappLink) whatsappLink.href = `https://wa.me/${sanitizePhone(cardData.whatsappNumber).replace(/\D/g, "")}`;

  const callLink = document.getElementById("call-link");
  if (callLink) callLink.href = `tel:${sanitizePhone(cardData.telNumber)}`;

  const emailLink = document.getElementById("email-link");
  if (emailLink) emailLink.href = `mailto:${cardData.email}`;

  // Set modal title and description for the QR code popup
  document.getElementById("qr-modal-title").textContent = cardData.qrHeading;
  document.getElementById("qr-modal-description").textContent = cardData.qrDescription;
}



/**
 * Removes all non-digit characters from a phone number string.
 *
 * Useful for formatting phone numbers into numeric-only strings
 * for use in tel:, WhatsApp, and vCard links.
 *
 * Example:
 *   "+44 (0) 7123 456 789" → "4407123456789"
 *
 * @param {string} number - The raw phone number string (may include spaces, dashes, etc.)
 * @returns {string} The sanitized phone number containing digits only.
 */

const sanitizePhone = (number) => number.replace(/[^\d+]/g, "");


/**
 * Dynamically injects social media profile icons into the DOM.
 *
 * This function reads an array of social media profiles (each with a `type` and `url`)
 * and appends corresponding <a> elements with SVG icons into the container with ID `social-links`.
 * 
 * The number of icons displayed is controlled by `cardData.numberOfIcons`. If undefined,
 * all available profiles will be rendered.
 *
 * Each icon is linked to its respective profile and includes:
 * - an accessible label (aria-label),
 * - a CSS class matching the platform name for styling,
 * - and an SVG <use> reference that must match a <symbol> ID (e.g. #icon-facebook).
 *
 * @param {Array} profiles - Array of social profile objects with `type` and `url` fields.
 */

function renderSocialProfiles(profiles) {
  const container = document.getElementById("social-links");
  if (!container || !Array.isArray(profiles)) return;

  container.innerHTML = ""; // Clear existing icons

  const maxIcons = cardData.numberOfIcons || profiles.length;
  profiles.slice(0, maxIcons).forEach(profile => {
    const { type, url } = profile;
    if (!type || !url) return;

    const iconId = `#icon-${type.toLowerCase()}`; // Matches <symbol id="icon-facebook"> etc.

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", type);
    a.classList.add(type.toLowerCase()); // For custom background color via CSS

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
 * Generates a scalable SVG QR code that inherits its color from CSS.
 *
 * This function creates an SVG-based QR code where each square (module)
 * uses `fill: currentColor`, allowing its color to be controlled via CSS
 * on the parent container (e.g. using `color: var(--color-primary)`).
 *
 * The background color remains customizable via the `background` parameter.
 *
 * @param {string} content - The data to encode in the QR code (e.g. a URL).
 * @param {number} [size=256] - Width and height of the SVG canvas in pixels.
 * @param {number} [padding=0] - Padding (in modules) around the QR content.
 * @param {string} [background="#ffffff"] - Background color of the QR code.
 *
 * @returns {SVGElement} A fully constructed <svg> element representing the QR code.
 *
 * @example
 * // Inject into the DOM with color inherited from CSS
 * const qrSvg = generateQRCodeSVG("https://example.com");
 * document.getElementById("qr-code").appendChild(qrSvg);
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
      rect.setAttribute("fill", "currentColor"); // Inherits from parent element’s CSS color
      svg.appendChild(rect);
    }
  }

  return svg;
}




/**
 * Initializes the QR code modal and sharing functionality.
 *
 * This function sets up the following interactive features:
 *
 * 1. **QR Code Modal Toggle**
 *    - Opens and closes the QR code overlay with smooth CSS transitions.
 *    - Toggles visibility using inline `style.top`, `opacity`, and `visibility` (CSP-safe).
 *
 * 2. **QR Code Injection**
 *    - Dynamically generates a QR code SVG using the current page URL.
 *    - Injects it into the element with ID `#qr-code` using `generateQRCodeSVG()`.
 *    - QR squares use `currentColor`, allowing CSS-based color control.
 *
 * 3. **Web Share API Support**
 *    - If `navigator.share` is supported:
 *       → Taps the native share sheet with `title`, `text`, and `url` from `cardData`.
 *    - If not supported:
 *       → Falls back to showing the QR modal instead.
 *
 * 4. **Header Visibility**
 *    - Ensures the header action buttons (`#header-actions`) are set to visible.
 *
 * Event listeners are attached to:
 * - The "Show QR" button (`#showQR`)
 * - The "Share" button (`#share`)
 * - The modal close button (`#qr-modal-close`)
 *
 * Requires:
 * - An SVG container with ID `#qr-code`
 * - A modal with ID `#qr-modal`
 * - Icons/buttons with IDs `#showQR`, `#share`, and `#qr-modal-close`
 * - `cardData` must contain optional `shareTitle` and `shareText`
 */

function setupQRModalAndSharing() {
  const modal = document.getElementById("qr-modal");
  const closeBtn = document.getElementById("qr-modal-close");
  const qrView = document.getElementById("qr-modal-qr-section");
  const qrContainer = document.getElementById("qr-code");
  const qrTrigger = document.getElementById("showQR");
  const shareBtn = document.getElementById("share");

  // Modal toggle helper
  function toggleModal(el) {
    if (el.style.top === "0px") {
      el.style.top = "2rem";
      el.style.opacity = 0;
      setTimeout(() => {
        el.style.visibility = "hidden";
      }, 200);
    } else {
      el.style.visibility = "visible";
      el.style.top = "0px";
      el.style.opacity = 1;
    }
  }

  // Ensure the QR/share actions are visible
  const headerActions = document.querySelector("#header-actions");
  if (headerActions) headerActions.style.display = "flex";

  // Generate and inject QR SVG (CSP-safe)
  const qrSvg = generateQRCodeSVG(window.location.href, 256, 0); // You can pull from cardData if needed
  qrContainer.innerHTML = "";
  qrContainer.appendChild(qrSvg);

  // Native share support
  if (shareBtn && navigator.share) {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.share({
        title: cardData.shareTitle || document.title,
        text: cardData.shareText,
        url: window.location.href
      }).catch(console.warn);
    });
  } else if (shareBtn) {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleModal(modal);
      qrView.style.display = "block";
    });
  }

  // Attach modal open/close logic
  closeBtn.addEventListener("click", () => toggleModal(modal));
  qrTrigger.addEventListener("click", () => {
    toggleModal(modal);
    qrView.style.display = "block";
  });
}




/**
 * Creates a downloadable `.vcf` (vCard) file from the `cardData` object and triggers a download.
 *
 * This function extracts user profile information, contact details, social media,
 * and a base64-encoded headshot image, and composes them into a valid vCard 3.0 format.
 * 
 * It also gracefully handles missing fields and provides fallbacks or alerts where needed.
 * 
 * Features:
 * - Name, company, title, email, phone number, birthday, address
 * - Embeds the profile image (base64 PNG)
 * - Includes website and all enabled social media profiles
 * - Adds WhatsApp and Google Business review links if present
 * - Includes the short bio as a vCard NOTE
 * 
 * File is named automatically based on the user's name (e.g. `johnsmith.vcf`)
 * and is downloaded without requiring server-side processing.
 *
 * @async
 * @function
 * @returns {void}
 *
 * @throws Alerts the user if image fetching fails (e.g., local file protocol) or data is missing.
 *
 * ⚠️ Notes:
 * - This must be run in a **web server environment** to load images reliably.
 * - Works best when `cardData.profileImage` is a valid path or full URL.
 * - If testing locally (file://), image embedding may fail due to browser security.
 */


async function createAndDownloadVCard() {
  try {
    if (!cardData.fullName) {
      alert("Missing name information.");
      return;
    }

    // Split full name into first and last
    const [firstName, ...lastParts] = cardData.fullName.trim().split(" ");
    const lastName = lastParts.join(" ") || "";

    // Fetch profile image as base64
    const response = await fetch(cardData.profileImage);
    if (!response.ok) throw new Error("Failed to load headshot image.");
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64 = reader.result.split(',')[1];

      const vcardLines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName};;;`,
        `FN:${cardData.fullName}`,
        `ORG:${cardData.company}`,
        `TITLE:${cardData.jobTitle}`,
        `PHOTO;ENCODING=b;TYPE=PNG:${base64}`,
        `TEL;TYPE=cell,voice:${sanitizePhone(cardData.telNumber)}`,
        `TEL;TYPE=work,voice:${sanitizePhone(cardData.officeNumber)}`,
        `EMAIL;TYPE=internet:${cardData.email}`
      ];

      // Optional fields
      if (cardData.birthday)
        vcardLines.push(`BDAY:${cardData.birthday}`);

      if (cardData.address)
        vcardLines.push(`ADR;TYPE=work:;;${cardData.address.replace(/,/g, ";")}`);

      if (cardData.websiteUrl)
        vcardLines.push(`URL:${cardData.websiteUrl}`);

      if (cardData.socialProfiles && Array.isArray(cardData.socialProfiles)) {
        cardData.socialProfiles.forEach(profile => {
          if (profile.type && profile.url) {
            vcardLines.push(`X-SOCIALPROFILE;type=${profile.type}:${profile.url}`);
          }
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


      if (cardData.bio)
        vcardLines.push(`NOTE:${cardData.bio}`);

      vcardLines.push("END:VCARD");

      // Final vCard string
      const vcard = vcardLines.join("\n");

      // Create file and trigger download
      const vcardBlob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(vcardBlob);
      link.download = `${firstName.toLowerCase()}${lastName.toLowerCase()}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    reader.readAsDataURL(blob);

  } catch (error) {
    console.error("vCard generation error:", error);
    const isLocalFile = location.protocol === "file:";
    if (isLocalFile || error.message.includes("Failed to load headshot image")) {
      alert("This feature must be tested on a web server or use a full image URL for the profile image. Local file access is restricted.");
    } else {
      alert("There was an error generating the vCard.");
    }
  }
}




/**
 * Initializes the vCard functionality once the DOM is fully loaded.
 *
 * This bootstraps the entire digital business card experience by:
 * 
 * 1. Injecting dynamic content from `cardData` into the page:
 *    - Text fields, contact buttons, images, reviews, and footer
 *
 * 2. Setting up QR code and share button logic:
 *    - Generates the QR code
 *    - Attaches open/close modal handlers
 *    - Enables native share API or fallback
 *
 * 3. Rendering social profile icons:
 *    - Injects icons into the `.social-links` container based on `cardData.socialProfiles`
 *
 * 4. Attaching vCard download functionality:
 *    - When the user clicks the “Save Contact” button, a `.vcf` file is generated and downloaded
 *
 * This function ensures all major features are initialized only after the DOM is ready,
 * avoiding race conditions or missing element references.
 */

document.addEventListener("DOMContentLoaded", () => {
  injectCardData();
  setupQRModalAndSharing();
  renderSocialProfiles(cardData.socialProfiles);

  const saveBtn = document.getElementById("vcf-save-contact");
  if (saveBtn) {
    saveBtn.addEventListener("click", function(event) {
      event.preventDefault();
      createAndDownloadVCard();
    });
  }
});

