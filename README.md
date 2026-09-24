# Zivra dashboardprototype

Zivra is een klikbaar dashboardprototype voor het bekijken van trainingsresultaten van CVA-patiënten. Het dashboard bevat een patiëntenoverzicht, patiëntdetails, sessiegrafieken en een gesynchroniseerde weergave van camera-, model- en VR-video.

## Projectstructuur

### Broncode

| Map | Uitleg |
| --- | --- |
| `app/` | Bevat de volledige gebruikersinterface, de voorbeelddata, de pagina-opbouw en alle dashboardstijlen. |
| `public/` | Bevat bestanden die rechtstreeks door de browser worden geladen, zoals het favicon en de drie demonstratievideo’s. |
| `public/videos/` | Bevat het camerabeeld, het bewegingsmodel en de VR-opname die synchroon worden afgespeeld. |
| `tests/` | Bevat controles voor de gerenderde pagina, sessiescores, dagtotalen en belangrijke interface-afspraken. |
| `worker/` | Bevat het startpunt voor de serveromgeving en de afhandeling van afbeeldingsoptimalisatie. |
| `db/` | Bevat de databasehelper en het Drizzle-databaseschema; de huidige dashboarddata staat nog rechtstreeks in `app/page.tsx`. |
| `drizzle/` | Bevat metadata voor toekomstige databasewijzigingen en migraties. |
| `examples/` | Bevat een los D1-databasevoorbeeld en maakt geen onderdeel uit van de actieve dashboardpagina. |
| `build/` | Is momenteel leeg en bevat geen actieve applicatiecode. |

### Automatisch aangemaakte mappen

Deze mappen hoef je normaal gesproken niet handmatig aan te passen:

| Map | Uitleg |
| --- | --- |
| `node_modules/` | Geïnstalleerde npm-pakketten; wordt opnieuw aangemaakt met `npm install`. |
| `dist/` | Productie-uitvoer van de build; wordt opnieuw aangemaakt met `npm run build`. |
| `.vinext/` | Tijdelijke Vinext-bestanden die tijdens ontwikkelen en bouwen worden gegenereerd. |
| `.wrangler/` | Lokale status en tijdelijke bestanden voor de Cloudflare-ontwikkelomgeving. |
| `.git/` | Lokale Git-geschiedenis en repository-instellingen. |

## Belangrijkste bestanden

| Bestand | Uitleg |
| --- | --- |
| `app/page.tsx` | Hoofdbestand van het dashboard met patiëntdata, sessiedata, grafieken, navigatie en videosynchronisatie. |
| `app/globals.css` | Alle kleuren, lettertypen, afmetingen, layouts, grafieken, tooltips en responsive stijlen. |
| `app/layout.tsx` | Algemene HTML-opbouw en metadata, waaronder de paginatitel en het favicon. |
| `public/favicon.svg` | Het paarse Zivra-favicon met de letter Z. |
| `public/videos/demo-2-camera.mp4` | Normaal camerabeeld van de training. |
| `public/videos/demo-2-model.mp4` | Animatie van het gemeten bewegingsmodel. |
| `public/videos/demo-2-vr.mp4` | Opname van de VR-omgeving. |
| `tests/rendered-html.test.mjs` | Controleert of het dashboard rendert en of scores, dagtotalen en grafiekdata consistent blijven. |
| `vite.config.ts` | Configureert Vinext, de lokale ontwikkelserver en de productiebuild. |
| `worker/index.ts` | Server-entrypoint dat verzoeken naar de Vinext-app doorstuurt. |
| `db/index.ts` | Maakt een Drizzle-verbinding wanneer later een D1-database wordt gekoppeld. |
| `db/schema.ts` | Definieert de databasetabellen. |
| `drizzle.config.ts` | Configuratie voor het genereren van databasemigraties. |
| `package.json` | Bevat de scripts, projectnaam en gebruikte dependencies. |
| `package-lock.json` | Legt de exacte dependencyversies vast en wordt door npm bijgewerkt. |
| `tsconfig.json` | TypeScript-instellingen en het `@/` importpad. |
| `next.config.ts` | Basisconfiguratie voor de Next/Vinext-app. |
| `eslint.config.mjs` | Regels voor statische codecontrole. |
| `postcss.config.mjs` | Verwerkt de CSS tijdens ontwikkelen en bouwen. |
| `.gitignore` | Bepaalt welke lokale en gegenereerde bestanden niet in Git terechtkomen. |
| `.gitattributes` | Houdt regeleinden van tekstbestanden consistent binnen Git. |

## Waar pas je wat aan?

- Nieuwe patiënten, sessies of grafiekwaarden: `app/page.tsx`.
- Kleuren, typografie, afmetingen of layout: `app/globals.css`.
- Camerabeeld, modelvideo of VR-video vervangen: `public/videos/` en indien nodig de bestandsnamen in `MediaTriptych` in `app/page.tsx`.
- Metadata of favicon aanpassen: `app/layout.tsx` en `public/favicon.svg`.
- Een controle toevoegen of bestaande rekenregels bewaken: `tests/rendered-html.test.mjs`.
- Een echte database aansluiten: `db/`, `drizzle.config.ts` en de bindings in `vite.config.ts`.

## Lokaal starten

Node.js 22.13 of nieuwer is vereist.

Gebruik in Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Gebruik in een andere terminal:

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

## Controleren

Voer de build en tests uit voordat je wijzigingen oplevert:

```powershell
npm.cmd run build
node --test tests/rendered-html.test.mjs
```

## Publiceren met GitHub Pages

Dit project wordt via de branch `github-pages` en een GitHub Actions-workflow gepubliceerd. Kies in GitHub dus **GitHub Actions** als publicatiebron en niet **Deploy from a branch**.

### Eenmalig instellen

1. Open de repository op GitHub.
2. Ga naar **Settings** en vervolgens naar **Pages**.
3. Kies onder **Build and deployment** bij **Source** voor **GitHub Actions**.
4. Controleer of de branch `github-pages` de volgende bestanden bevat:
   - `.github/workflows/deploy-pages.yml` voor het bouwen en publiceren;
   - `next.config.ts` met de instellingen voor een statische export en het pad `/zivra`.
5. Laat de workflow een eerste keer uitvoeren door iets naar de branch `github-pages` te pushen of start hem handmatig via **Actions**.

Meer uitleg staat in de officiële GitHub-documentatie over [het instellen van een publicatiebron](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) en [het publiceren met een aangepaste workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Nieuwe wijzigingen online zetten

1. Rond het werk af op de branch `main` en controleer het project lokaal:

   ```powershell
   npm.cmd install
   npm.cmd run build
   node --test tests/rendered-html.test.mjs
   ```

2. Commit en push de wijzigingen naar `main`:

   ```powershell
   git status
   git add .
   git commit -m "Beschrijf hier de wijziging"
   git push origin main
   ```

3. Voeg daarna `main` samen met de publicatiebranch en push die branch:

   ```powershell
   git switch github-pages
   git pull origin github-pages
   git merge main
   git push origin github-pages
   git switch main
   ```

4. Open op GitHub het tabblad **Actions** en kies de workflow **Publiceer Zivra op GitHub Pages**. De publicatie is gereed zodra de workflow groen is.
5. Open daarna [https://lckssng.github.io/zivra/](https://lckssng.github.io/zivra/). Het kan na een geslaagde workflow nog kort duren voordat de nieuwste versie zichtbaar is.

### Workflow handmatig starten

Open **Actions**, kies **Publiceer Zivra op GitHub Pages**, klik op **Run workflow**, selecteer de branch `github-pages` en bevestig met **Run workflow**.

### Problemen oplossen

- Controleer bij een rode workflow in **Actions** welke stap is mislukt en open daar de foutmelding.
- Geeft `npm ci` een fout over `package-lock.json`, voer dan op `main` `npm.cmd install` uit en commit ook het aangepaste lockbestand.
- Ontbreken de video’s online, controleer dan of de bestanden in `public/videos/` door Git worden gevolgd.
- Is de pagina leeg, ongestyled of geeft hij een 404, controleer dan of **Source** nog op **GitHub Actions** staat en of de GitHub Pages-instellingen in `next.config.ts` behouden zijn.
- Ontstaat tijdens `git merge main` een conflict in `next.config.ts` of `.github/workflows/deploy-pages.yml`, behoud dan de GitHub Pages-configuratie van de branch `github-pages`.

Gebruik niet `git push origin main:github-pages`: daarmee kunnen de speciale publicatiebestanden op de branch `github-pages` verloren gaan. Voeg `main` altijd samen via de stappen hierboven.

De interface is primair ontworpen voor een desktopscherm. Alle patiëntgegevens zijn fictief en worden uitsluitend voor demonstratie en gebruikerstests gebruikt.
