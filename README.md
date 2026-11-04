# Lakótársak

Közös háztartás-app lakótársaknak: bevásárlólista, otthoni készlet, tartozások és szabadidő (társasjáték-sorsoló + film/sorozat match).

React + Tailwind + Firebase Firestore. Élő címe: https://greativo13.github.io/lak-t-rsak/

## Fejlesztés
- A szerkesztendő forrás: `lakotarsak-kozos.html` (böngészőben fordul, így magában is megnyitható tesztre).
- Kiadás előtt: `npm install` (egyszer), majd `npm run build` → ez készíti el az `index.html`-t előre lefordítva (gyors indulás). Az `index.html`-t ne szerkeszd kézzel.
- Minden kiadásnál növeld az `APP_VERSION` konstanst — erről ismerik fel a telefonok az új verziót, és töltenek újra maguktól.
- `sw.js`: offline indulás (elmenti az oldalt és a külső programrészeket a telefonra).
- Adat: közös Firebase-háztartás; a kulcsok kliensoldaliak. Figyelem: a repó és az oldal nyilvános, így a háztartás-azonosító is látható.
- `lakotarsi-app.html`: régi, csak helyben tároló változat (nem része az aktuális appnak).

## Közzététel
- GitHub Pages: a `main`-re pusholt változás pár percen belül élesül.
