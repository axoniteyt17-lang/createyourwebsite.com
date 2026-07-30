const STRIPE_TEST_LINK =
  "https://buy.stripe.com/test_3cI28k4gQ5QP3BL6TKaAw00";

const STORAGE_KEY = "createYourWebsiteDraft";

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const modal = document.getElementById("builderModal");
const form = document.getElementById("websiteForm");
const preview = document.getElementById("sitePreview");
const saveStatus = document.getElementById("saveStatus");
const downloadBox = document.getElementById("downloadBox");
const beforePayment = document.getElementById("beforePayment");

const fields = {
  siteName: document.getElementById("siteName"),
  siteLabel: document.getElementById("siteLabel"),
  siteHeadline: document.getElementById("siteHeadline"),
  siteDescription: document.getElementById("siteDescription"),
  buttonText: document.getElementById("buttonText"),
  accentColor: document.getElementById("accentColor"),
  contactEmail: document.getElementById("contactEmail")
};

document.getElementById("year").textContent = new Date().getFullYear();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeEmail(value) {
  const email = String(value).trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : "hello@example.com";
}

function getDraft() {
  const selectedTemplate = form.querySelector(
    'input[name="template"]:checked'
  );

  return {
    template: selectedTemplate ? selectedTemplate.value : "bold",
    siteName: fields.siteName.value.trim() || "My Website",
    siteLabel: fields.siteLabel.value.trim() || "Welcome",
    siteHeadline:
      fields.siteHeadline.value.trim() ||
      "An amazing idea starts here.",
    siteDescription:
      fields.siteDescription.value.trim() ||
      "Add a short description of what you do.",
    buttonText: fields.buttonText.value.trim() || "Get in touch",
    accentColor: fields.accentColor.value || "#7b61ff",
    contactEmail: safeEmail(fields.contactEmail.value)
  };
}

function buildWebsite(draft) {
  const data = Object.fromEntries(
    Object.entries(draft).map(([key, value]) => [
      key,
      escapeHtml(value)
    ])
  );

  const themes = {
    bold: {
      background: "#fff5ed",
      text: "#111111",
      card: "#ffffff",
      font: "'Arial Black', Arial, sans-serif",
      bodyFont: "Arial, sans-serif",
      align: "left",
      radius: "6px",
      decoration: "BOLD"
    },

    clean: {
      background: "#f6f3eb",
      text: "#24302d",
      card: "#ffffff",
      font: "Georgia, 'Times New Roman', serif",
      bodyFont: "Arial, sans-serif",
      align: "center",
      radius: "0px",
      decoration: "STUDIO"
    },

    playful: {
      background: "#eefbe5",
      text: "#18211d",
      card: "#ffffff",
      font: "'Arial Rounded MT Bold', Arial, sans-serif",
      bodyFont: "Arial, sans-serif",
      align: "left",
      radius: "32px",
      decoration: "HELLO!"
    }
  };

  const theme = themes[draft.template] || themes.bold;
  const title = data.siteName.replace(/&quot;/g, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <meta
    name="description"
    content="${data.siteDescription}"
  >

  <title>${title}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      min-height: 100vh;
      color: ${theme.text};
      background: ${theme.background};
      font-family: ${theme.bodyFont};
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .page {
      min-height: 100vh;
      overflow: hidden;
      position: relative;
    }

    nav {
      width: min(1120px, calc(100% - 40px));
      height: 88px;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 3;
    }

    .logo {
      font: 800 18px ${theme.font};
    }

    nav a:last-child {
      font-size: 14px;
      font-weight: 700;
    }

    main {
      width: min(1120px, calc(100% - 40px));
      min-height: calc(100vh - 158px);
      margin: auto;
      display: grid;
      align-items: center;
      position: relative;
      z-index: 2;
      text-align: ${theme.align};
    }

    .content {
      max-width: 780px;
      ${theme.align === "center" ? "margin: auto;" : ""}
    }

    .label {
      display: inline-block;
      margin-bottom: 18px;
      color: ${data.accentColor};
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      max-width: 850px;
      font: 800 clamp(52px, 8vw, 112px) / 0.94 ${theme.font};
      letter-spacing: -0.06em;
    }

    p {
      max-width: 610px;
      margin: 28px ${theme.align === "center" ? "auto" : "0"} 30px;
      color: color-mix(
        in srgb,
        ${theme.text} 68%,
        transparent
      );
      font-size: clamp(17px, 2vw, 21px);
      line-height: 1.6;
    }

    .cta {
      display: inline-block;
      padding: 15px 24px;
      border: 2px solid ${theme.text};
      border-radius: ${theme.radius};
      color: ${theme.background};
      background: ${theme.text};
      font-weight: 800;
      transition: transform 0.2s;
    }

    .cta:hover {
      transform: translateY(-3px);
    }

    .shape {
      width: 420px;
      height: 420px;
      position: absolute;
      right: -110px;
      bottom: -150px;
      border-radius:
        ${draft.template === "bold" ? "50%" : theme.radius};
      background: ${data.accentColor};
      opacity: 0.95;
      transform: rotate(18deg);
    }

    .shape::after {
      content: "${theme.decoration}";
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: white;
      font: 800 55px ${theme.font};
      transform: rotate(-18deg);
    }

    footer {
      width: min(1120px, calc(100% - 40px));
      height: 70px;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 2;
      font-size: 12px;
      opacity: 0.58;
    }

    @media (max-width: 700px) {
      nav {
        height: 72px;
      }

      main {
        min-height: calc(100vh - 132px);
        padding: 55px 0 110px;
      }

      h1 {
        font-size: clamp(50px, 15vw, 76px);
      }

      .shape {
        width: 240px;
        height: 240px;
        right: -100px;
        bottom: -90px;
        opacity: 0.25;
      }

      .shape::after {
        font-size: 30px;
      }

      footer {
        height: 60px;
      }
    }
  </style>
</head>

<body>
  <div class="page">
    <nav>
      <a class="logo" href="#">
        ${data.siteName}
      </a>

      <a href="mailto:${data.contactEmail}">
        Contact
      </a>
    </nav>

    <main>
      <div class="content">
        <span class="label">
          ${data.siteLabel}
        </span>

        <h1>
          ${data.siteHeadline}
        </h1>

        <p>
          ${data.siteDescription}
        </p>

        <a
          class="cta"
          href="mailto:${data.contactEmail}"
        >
          ${data.buttonText} →
        </a>
      </div>
    </main>

    <div class="shape" aria-hidden="true"></div>

    <footer>
      <span>
        © ${new Date().getFullYear()} ${data.siteName}
      </span>

      <span>
        Made with Create Your Website
      </span>
    </footer>
  </div>
</body>
</html>`;
}

function updatePreview() {
  const draft = getDraft();

  preview.srcdoc = buildWebsite(draft);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(draft)
  );

  saveStatus.textContent = "Saved";
}

function restoreDraft() {
  try {
    const draft = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (!draft) {
      return;
    }

    Object.entries(fields).forEach(([key, field]) => {
      if (draft[key]) {
        field.value = draft[key];
      }
    });

    const template = form.querySelector(
      `input[name="template"][value="${draft.template}"]`
    );

    if (template) {
      template.checked = true;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function openBuilder(template) {
  if (template) {
    const input = form.querySelector(
      `input[name="template"][value="${template}"]`
    );

    if (input) {
      input.checked = true;
    }
  }

  updatePreview();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  setTimeout(() => {
    fields.siteName.focus();
  }, 30);
}

function closeBuilder() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function unlockDownload() {
  beforePayment.hidden = true;
  downloadBox.hidden = false;

  sessionStorage.setItem(
    "createYourWebsiteTestPaid",
    "true"
  );
}

function downloadWebsite() {
  const html = buildWebsite(getDraft());

  const blob = new Blob(
    [html],
    {
      type: "text/html;charset=utf-8"
    }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "index.html";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

menuButton.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");

  menuButton.classList.toggle("active", open);
  menuButton.setAttribute(
    "aria-expanded",
    String(open)
  );

  document.body.classList.toggle(
    "modal-open",
    open
  );
});

navLinks
  .querySelectorAll("a, button")
  .forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      document.body.classList.remove(
        "modal-open"
      );
    });
  });

document
  .querySelectorAll(".open-builder")
  .forEach((button) => {
    button.addEventListener("click", () => {
      openBuilder();
    });
  });

document
  .querySelectorAll("[data-close-modal]")
  .forEach((button) => {
    button.addEventListener(
      "click",
      closeBuilder
    );
  });

document
  .querySelectorAll(".style-card")
  .forEach((card) => {
    const choose = () => {
      openBuilder(card.dataset.style);
    };

    card.addEventListener("click", choose);

    card.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          choose();
        }
      }
    );
  });

form.addEventListener("input", () => {
  saveStatus.textContent = "Saving…";
  updatePreview();
});

document
  .querySelectorAll("[data-device]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-device]")
        .forEach((item) => {
          item.classList.toggle(
            "active",
            item === button
          );
        });

      preview.classList.toggle(
        "mobile",
        button.dataset.device === "mobile"
      );
    });
  });

document
  .getElementById("checkoutButton")
  .addEventListener("click", () => {
    updatePreview();

    window.open(
      STRIPE_TEST_LINK,
      "_blank",
      "noopener"
    );
  });

document
  .getElementById("testUnlockButton")
  .addEventListener(
    "click",
    unlockDownload
  );

document
  .getElementById("downloadButton")
  .addEventListener(
    "click",
    downloadWebsite
  );

document
  .getElementById("startOverButton")
  .addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);

    sessionStorage.removeItem(
      "createYourWebsiteTestPaid"
    );

    form.reset();
    beforePayment.hidden = false;
    downloadBox.hidden = true;

    updatePreview();
  });

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("open")
    ) {
      closeBuilder();
    }
  }
);

restoreDraft();
updatePreview();

const returnedFromStripe =
  new URLSearchParams(
    window.location.search
  ).get("payment") === "success";

const paidThisSession =
  sessionStorage.getItem(
    "createYourWebsiteTestPaid"
  ) === "true";

if (returnedFromStripe || paidThisSession) {
  unlockDownload();
  openBuilder();
}
