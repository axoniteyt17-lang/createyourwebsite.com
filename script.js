


const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const modal = document.getElementById("builderModal");
const steps = [...document.querySelectorAll(".builder-step")];
const progressBar = document.getElementById("progressBar");
const planSelect = document.getElementById("customerPlan");

const order = {
  project: "",
  style: "",
  plan: "Starter"
};

document.getElementById("year").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.classList.toggle("active", open);
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("modal-open", open);
});

navLinks.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  });
});

function showStep(number) {
  steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === number);
  });
  progressBar.style.width = `${Math.min(number, 3) * 33.333}%`;
}

function openBuilder(plan = "Starter") {
  order.plan = plan;
  planSelect.value = plan;
  showStep(1);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => modal.querySelector(".modal-close").focus(), 20);
}

function closeBuilder() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".open-builder").forEach((button) => {
  button.addEventListener("click", () => openBuilder(button.dataset.plan || "Starter"));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeBuilder);
});

document.getElementById("projectChoices").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;
  order.project = button.dataset.value;
  showStep(2);
});

document.getElementById("styleChoices").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;
  order.style = button.dataset.value;
  showStep(3);
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = Number(button.closest(".builder-step").dataset.step);
    showStep(Math.max(1, current - 1));
  });
});

document.getElementById("orderForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const notes = document.getElementById("customerNotes").value.trim();
  order.plan = planSelect.value;

  const subject = encodeURIComponent(`Website request from ${name}`);
  const body = encodeURIComponent(
`Hi Create Your Website,

I'd like to enquire about a website.

Name: ${name}
Reply email: ${email}
Project type: ${order.project}
Preferred style: ${order.style}
Package: ${order.plan}

Extra details:
${notes || "None yet"}

Please confirm the details and next steps before sending a payment link.`
  );

  document.getElementById("emailRequest").href =
    `mailto:support.createyourwebsite@gmail.com?subject=${subject}&body=${body}`;

  showStep(4);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeBuilder();
});

document.querySelectorAll(".style-card").forEach((card) => {
  card.addEventListener("click", () => {
    openBuilder("Starter");
    order.style = card.dataset.style;
    showStep(3);
  });
});
