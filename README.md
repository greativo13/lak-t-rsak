# Lakótársak

Közös háztartás-app lakótársaknak: bevásárlólista, otthoni készlet, tartozások és szabadidő (társasjáték-sorsoló + film/sorozat match).

Egyfájlos alkalmazás (React + Tailwind + Firebase Firestore). A közzétett fájl az **`index.html`**, élő címe: https://greativo13.github.io/lak-t-rsak/

## Fejlesztés
- A szerkesztendő forrás: `lakotarsak-kozos.html`. Változtatás után másold `index.html`-be (a kettő azonos), és commitold.
- Minden kiadásnál növeld az `APP_VERSION` konstanst — erről ismerik fel a telefonok az új verziót, és töltenek újra maguktól.
- Adat: közös Firebase-háztartás; a kulcsok kliensoldaliak. Figyelem: a repó és az oldal nyilvános, így a háztartás-azonosító is látható.
- `lakotarsi-app.html`: régi, csak helyben tároló változat (nem része az aktuális appnak).

## Közzététel
- GitHub Pages: a `main`-re pusholt változás pár percen belül élesül. Build nincs (statikus).
