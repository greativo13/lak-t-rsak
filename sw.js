/* Offline indulás: az app oldalát és a külső programrészeket (React, Firebase, betűk) elmenti a telefonra,
   így térerő nélkül is elindul. Az adatokat a Firebase saját offline tára adja.
   - az oldal: előbb a netről (hogy a frissítés megérkezzen), ha nincs net vagy túl lassú → a mentett példány
   - a külső fájlok verziószámosak, ezért elég egyszer letölteni őket */
const CACHE = "lakotarsak-v1";
const CDN_HOSTS = ["unpkg.com", "www.gstatic.com", "fonts.googleapis.com", "fonts.gstatic.com", "cdn.tailwindcss.com"];
const PAGE_KEY = new URL("./", self.registration.scope).href;
const NET_TIMEOUT = 3500;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function pageFromNetwork(req) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), NET_TIMEOUT);
    fetch(req).then((res) => {
      clearTimeout(timer);
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(PAGE_KEY, copy)); }
      resolve(res);
    }, (err) => { clearTimeout(timer); reject(err); });
  });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (url.searchParams.has("nocache")) return; // az app frissítés-ellenőrzése mindig a netről menjen
    const scopePath = new URL(self.registration.scope).pathname;
    const isPage = req.mode === "navigate" || url.pathname === scopePath || url.pathname === scopePath + "index.html";
    if (!isPage) return;
    e.respondWith(
      pageFromNetwork(req).catch(() =>
        caches.match(PAGE_KEY).then((hit) => hit || fetch(req)))
    );
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
