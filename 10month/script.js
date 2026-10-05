// ===== 1. HELPERS =====

const $ = (s) => [...document.querySelectorAll(s)],
  vh = () => innerHeight;
// ===== 2. HERO TITLE: SPLIT-LETTER ANIMATION =====

// split letters hero
const ht = document.getElementById("ht");
let i = 0;
[
  ["The ", 0],
  ["S", 1],
  ["alem", 0],
  ["<br>", 2],
  ["W", 1],
  ["itch Trials", 0],
].forEach(([t, k]) => {
  if (k == 2) {
    ht.insertAdjacentHTML("beforeend", "<br>");
    return;
  }
  [...t].forEach((c) => {
    const s = document.createElement("span");
    s.className = "l" + (k ? " sc" : "");
    s.textContent = c == " " ? "\u00a0" : c;
    s.style.animationDelay = 0.3 + i++ * 0.07 + "s";
    ht.appendChild(s);
  });
});
// ===== 3. INTRO: WORD-BY-WORD TEXT REVEAL =====

// scrub words
const sc = document.getElementById("scrub");
sc.innerHTML = sc.textContent
  .split(" ")
  .map((w) => `<span class="w">${w}</span>`)
  .join(" ");
const ws = $("#scrub .w");
// ===== 4. REVEAL-ON-SCROLL + COUNT-UP STATS =====

// reveal
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        if (e.target.dataset.to) count(e.target);
      }
    }),
  { threshold: 0.25 },
);
$(".rv,.pan,.card,.stat b,.slot").forEach((e) => io.observe(e));
function count(el) {
  if (el.done) return;
  el.done = 1;
  const to = +el.dataset.to,
    suf = el.dataset.suf || "",
    t0 = performance.now();
  (function f(t) {
    const p = Math.min(1, (t - t0) / 1800),
      v = Math.round(to * (1 - Math.pow(1 - p, 3)));
    el.textContent = (el.dataset.sep ? v.toLocaleString() : v) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
// ===== 5. SCROLL ENGINE: progress bar, hero zoom, pinned scenes, timeline line, chapter label =====

// scroll
const chap = document.getElementById("chap"),
  pg = document.querySelector("#pg b"),
  tl = document.getElementById("tl"),
  tf = document.getElementById("tf");
function onScroll() {
  const y = scrollY,
    H = document.documentElement.scrollHeight - vh();
  pg.style.height = (y / H) * 100 + "%";
  const hero = document.getElementById("hero"),
    p = Math.min(1, y / vh());
  ht.style.transform = `scale(${1 + p * 0.5})`;
  ht.style.opacity = 1 - p * 1.3;
  document.getElementById("moon").style.transform = `translateY(${p * -18}vh) scale(${1 + p * 0.6})`;
  const r = sc.getBoundingClientRect(),
    q = Math.min(1, Math.max(0, (vh() * 0.85 - r.top) / (vh() * 0.6)));
  ws.forEach((w, k) => w.classList.toggle("on", k / ws.length < q));
  $(".steps").forEach((s) => {
    const b = s.getBoundingClientRect(),
      n = +s.dataset.n,
      pr = Math.min(0.999, Math.max(0, -b.top / (b.height - vh()))),
      a = Math.floor(pr * n);
    s.querySelectorAll(".st").forEach((e, k) => {
      e.classList.toggle("on", k == a && b.top < vh() * 0.5);
      e.classList.toggle("past", k < a);
    });
    s.querySelectorAll(".dots i").forEach((d, k) => d.classList.toggle("on", k == a));
  });
  const tb = tl.getBoundingClientRect();
  tf.style.height = Math.max(0, Math.min(tb.height, vh() * 0.6 - tb.top)) + "px";
  let c = "";
  $("section[data-ch]").forEach((s) => {
    const b = s.getBoundingClientRect();
    if (b.top < vh() * 0.5 && b.bottom > vh() * 0.3) c = s.dataset.ch;
  });
  chap.textContent = c;
  chap.classList.toggle("on", !!c);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
// ===== 6. MENU OPEN / CLOSE =====

// menu
const mb = document.getElementById("mb");
mb.onclick = () => document.body.classList.toggle("open");
$("#menu a").forEach((a) => (a.onclick = () => document.body.classList.remove("open")));
// ===== 7. BACKGROUND EMBERS (canvas) =====

// embers
const cv = document.getElementById("cv"),
  x = cv.getContext("2d");
let P = [];
function rs() {
  cv.width = innerWidth;
  cv.height = innerHeight;
}
rs();
addEventListener("resize", rs);
for (let k = 0; k < 70; k++)
  P.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.8 + 0.4,
    v: Math.random() * 0.4 + 0.15,
    o: Math.random() * 0.5 + 0.1,
    p: Math.random() * 6,
  });
(function a(t) {
  x.clearRect(0, 0, cv.width, cv.height);
  P.forEach((e) => {
    e.y -= e.v;
    e.x += Math.sin(t / 1500 + e.p) * 0.3;
    if (e.y < -5) {
      e.y = cv.height + 5;
      e.x = Math.random() * cv.width;
    }
    x.fillStyle = `rgba(${e.r > 1.4 ? "216,205,175" : "190,40,40"},${e.o})`;
    x.beginPath();
    x.arc(e.x, e.y, e.r, 0, 7);
    x.fill();
  });
  requestAnimationFrame(a);
})(0);
// ===== 8. BACK TO HERO BUTTON (smooth scroll to top) =====

document.getElementById("btt").addEventListener("click", () => {
  const y0 = window.scrollY,
    t0 = performance.now(),
    D = 2400;
  (function f(t) {
    const p = Math.min(1, (t - t0) / D),
      e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    window.scrollTo(0, y0 * (1 - e));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
});