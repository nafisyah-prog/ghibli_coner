"use strict";

/* ===== 1. Mode gelap/terang (Event Handling + Style) ===== */
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
});

/* ===== 2. Animasi muncul saat scroll (Style & Animation) ===== */
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in").forEach(function (el) {
  observer.observe(el);
});

/* ===== 3. Sapaan sesuai waktu + kata semangat acak (DOM Manipulation) ===== */
const greeting = document.getElementById("greeting");
const quote = document.getElementById("quote");
const changeQuote = document.getElementById("changeQuote");

if (greeting) {
  const jam = new Date().getHours();
  let sapaan = "Good evening";
  if (jam < 11) {
    sapaan = "Good morning";
  } else if (jam < 15) {
    sapaan = "Good afternoon";
  } else if (jam < 18) {
    sapaan = "Good evening";
  }
  greeting.textContent = sapaan + "! Ready to find a movie to watch?";
}

if (changeQuote) {
  const daftarQuote = [
    "Every journey begins with a small step.",
    "Don't give up before you try.",
    "Hard work beats talent.",
    "Every meeting brings a new story.",
    "Today is better than yesterday."
  ];
  changeQuote.addEventListener("click", function () {
    const acak = Math.floor(Math.random() * daftarQuote.length);
    quote.textContent = '"' + daftarQuote[acak] + '"';
  });
}

/* ===== 4. Filter genre + tombol favorit (Event Handling + DOM) ===== */
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll("#animeGrid .card");

filters.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filters.forEach(function (f) {
      f.classList.remove("active");
    });
    btn.classList.add("active");

    const genre = btn.dataset.genre;
    cards.forEach(function (card) {
      const cocok = genre === "all" || card.dataset.genre === genre;
      card.classList.toggle("hide", !cocok);
    });
  });
});

const favCount = document.getElementById("favCount");
const favButtons = document.querySelectorAll(".fav");

favButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.classList.toggle("active");
    btn.textContent = btn.classList.contains("active") ? "★ Favorite" : "☆ Favorite";
    favCount.textContent = document.querySelectorAll(".fav.active").length;
  });
});

/* ===== 4b. Thumbnail fallback: show an emoji if an image fails to load ===== */
document.querySelectorAll(".thumb img").forEach(function (img) {
  img.addEventListener("error", function () {
    img.replaceWith(document.createTextNode(img.dataset.emoji || "🎬"));
  });
});

/* ===== 5. AJAX: ambil daftar film dari Studio Ghibli API ===== */
const loadTop = document.getElementById("loadTop");
const topGrid = document.getElementById("topGrid");
const statusEl = document.getElementById("status");

if (loadTop) {
  loadTop.addEventListener("click", async function () {
    statusEl.textContent = "Loading data...";
    topGrid.innerHTML = "";

    try {
      const response = await fetch("https://ghibliapi.vercel.app/films");
      if (!response.ok) {
        throw new Error("Invalid server response");
      }
      const films = await response.json();

      films.slice(0, 6).forEach(function (film) {
        const card = document.createElement("article");
        card.className = "card";

        const img = document.createElement("img");
        img.src = film.image;
        img.alt = film.title + " poster";
        img.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = film.title;

        const info = document.createElement("p");
        info.textContent = "📅 Released " + film.release_date + " · ⭐ Score " + film.rt_score;

        card.append(img, title, info);
        topGrid.appendChild(card);
      });
      statusEl.textContent = "";
    } catch (error) {
      statusEl.textContent = "Failed to load data. Check your internet connection and try again.";
    }
  });
}

/* ===== 6. Validasi form (Form Validation) ===== */
const form = document.getElementById("contactForm");

if (form) {
  const nama = document.getElementById("nama");
  const email = document.getElementById("email");
  const pesan = document.getElementById("pesan");
  const success = document.getElementById("formSuccess");

  function setError(input, errId, message) {
    document.getElementById(errId).textContent = message;
    input.classList.toggle("invalid", message !== "");
    return message === "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    success.textContent = "";

    const emailPola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const okNama = setError(nama, "errNama",
      nama.value.trim().length < 3 ? "Name must be at least 3 characters." : "");
    const okEmail = setError(email, "errEmail",
      emailPola.test(email.value.trim()) ? "" : "Invalid email format.");
    const okPesan = setError(pesan, "errPesan",
      pesan.value.trim().length < 10 ? "Suggestion must be at least 10 characters." : "");

    if (okNama && okEmail && okPesan) {
      success.textContent = "Thank you, " + nama.value.trim() + "! Your suggestion has been recorded 🎉";
      form.reset();
    }
  });
}
