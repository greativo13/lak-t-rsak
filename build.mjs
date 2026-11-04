// Build: lakotarsak-kozos.html (forrás, böngészőben fordul) → index.html (előre lefordítva, gyorsan indul).
// A JSX-et itt fordítjuk le, a Tailwind osztályokból pedig kész CSS lesz, így a telefonnak nem kell
// minden indításkor letöltenie és futtatnia a Babelt és a Tailwind futtatót.
import fs from "node:fs";
import babel from "@babel/core";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

const SRC = "lakotarsak-kozos.html";
const OUT = "index.html";
let html = fs.readFileSync(SRC, "utf8");

const take = (re, what) => {
  const m = html.match(re);
  if (!m) throw new Error("Nem található a forrásban: " + what);
  return m;
};

// 1) JSX → sima JS
const jsx = take(/<script type="text\/babel" data-presets="react">([\s\S]*?)<\/script>/, "babel script");
const { code } = babel.transformSync(jsx[1], {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  babelrc: false, configFile: false, compact: false, comments: true,
});
if (!/const APP_VERSION = "[^"]+"/.test(code)) throw new Error("APP_VERSION eltűnt a fordításból");

// 2) Tailwind → kész CSS (ugyanaz a beállítás, mint a forrásban)
const css = (await postcss([tailwindcss({
  content: [{ raw: html, extension: "html" }],
  corePlugins: { preflight: false },
  theme: { extend: { fontFamily: {
    sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
    display: ["Fraunces", "Georgia", "serif"],
  } } },
})]).process("@tailwind components;\n@tailwind utilities;", { from: undefined })).css;

// 3) összerakás
html = html.replace(jsx[0], () => "<script>\n" + code + "\n</script>");
html = html.replace(take(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"[^>]*><\/script>/, "babel standalone")[0], "");
html = html.replace(take(/\s*<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>\s*<script>\s*tailwind\.config[\s\S]*?<\/script>/, "tailwind cdn")[0], "");
html = html.replace("</style>\n</head>", () => "</style>\n<style>/* Tailwind (build) */\n" + css + "\n</style>\n</head>");
html = html.replace("<!doctype html>", "<!doctype html>\n<!-- GENERÁLT FÁJL — ne szerkeszd! Forrás: lakotarsak-kozos.html, build: npm run build -->");

fs.writeFileSync(OUT, html);
console.log(`${OUT} kész: ${(html.length / 1024).toFixed(0)} KB (CSS ${(css.length / 1024).toFixed(0)} KB)`);
