const inputs = {
  fullName: document.getElementById("fullName"),
  jobTitle: document.getElementById("jobTitle"),
  email: document.getElementById("email"),
  telNumber: document.getElementById("telNumber"),
};

const initialCardData = {
  fullName: "",
  jobTitle: "",
  email: "",
  telNumber: "",
  whatsappNumber: "",
  officeNumber: "",
  birthday: "19900101",
  websiteUrl: "https://example.com",
  address: "",
  bio: "",
  company: "My Company Solutions Ltd",
  companyDescription: "",
  reviewLinkText: "Check Our Reviews on Google",
  googleBusinessProfile: "https://g.page/yourbiz",
  ratingValue: "4.5",
  qrHeading: "Scan the QR Code",
  qrDescription: "to view my Business Card on another device",
  footerTagline: "Smart connections start with a digital card.",
  footerCompanyUrl: "https://example.com",
  footerCompanyName: "My Company Solutions Ltd",
  profileImage: "images/headshoot-300x300.png",
  coverImage: "images/cover-960x640.png",
  shareTitle: "Digital Business Card",
  shareText: "You can view my Digital Business Card here:",
  socialProfiles: [],
};

// -------------------------
// Live Preview in Iframe
// -------------------------

function updateCardData() {
  const cardData = getCurrentCardData();

  const injectScript = `
    <script type="application/json" id="card-data">
      ${JSON.stringify(cardData)}
    </script>
  `;

  // Dynamically detect path like /test20/vcard/
  const currentPath = window.location.pathname.split("/");
  const baseFolder = currentPath[1]; // e.g. test20
  const absoluteBase = `https://${window.location.host}/${baseFolder}/vcard/`;

  fetch(`${absoluteBase}index.html`)
    .then((res) => res.text())
    .then((html) => {
      const rebasedHtml = html.replace(
        /(src|href)=["'](?!https?:\/\/|data:)(\.?\/)?(scripts|styles|images|vcard\.bundle[^"']*)["']/g,
        (match, attr, _, path) => `${attr}="${absoluteBase}${path}"`
      );

      const modifiedHtml = rebasedHtml.replace(
        "<head>",
        `<head>\n<base href="${absoluteBase}">\n${injectScript}`
      );

      const iframe = document.getElementById("vcardPreview");
      iframe.removeAttribute("src");
      iframe.srcdoc = modifiedHtml;
    })
    .catch((err) => {
      console.error("Failed to inject cardData into iframe:", err);
    });
}

function getCurrentCardData() {
  return {
    ...initialCardData,
    fullName: inputs.fullName.value,
    jobTitle: inputs.jobTitle.value,
    email: inputs.email.value,
    telNumber: inputs.telNumber.value,
  };
}

Object.values(inputs).forEach((input) =>
  input.addEventListener("input", updateCardData)
);

document.addEventListener("DOMContentLoaded", updateCardData);

// -------------------------
// Download My vCard ZIP
// -------------------------

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const cardData = getCurrentCardData();
  const zip = new JSZip();

  // Add updated cardData.json
  zip.file("vcard/cardData.json", JSON.stringify(cardData, null, 2));

  // Files to bundle
  const staticFiles = [
    "vcard/index.html",
    "vcard/vcard.bundle.js",
    "vcard/scripts/qrcode.min.js",
    "vcard/styles/style.css",
    "vcard/images/headshoot-300x300.png",
    "vcard/images/cover-960x640.png",
    "vcard/images/favi-100x100.png",
    "vcard/images/bookmark-128x128.png",
  ];

  for (const path of staticFiles) {
    try {
      const response = await fetch(`../${path}`);
      if (!response.ok) throw new Error(`Failed to fetch ${path}`);
      const blob = await response.blob();
      zip.file(path, blob);
    } catch (err) {
      console.error("Could not include file:", path, err);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipBlob);
  a.download = "my-vcard.zip";
  a.click();
});
