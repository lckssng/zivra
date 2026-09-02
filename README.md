# ZIVRA dashboardprototype

Een klikbare proof of concept voor het maandelijkse voortgangsoverzicht van
CVA-patiënten. Het prototype helpt therapeuten om in één oogopslag te zien wie
vooruitgaat, gelijk blijft of extra aandacht nodig heeft.

## Wat is uitgewerkt

- een groot patiëntenoverzicht met zoeken en eenvoudige filters;
- een patiëntscherm met gecombineerde voortgang, ROM en recente sessies;
- een sessiedetail met doelen, pijn, energie, frustratie en behandeladvies;
- een demovenster voor het terugkijken van videobeelden in 3D;
- fictieve patiënten en dummydata voor demonstratie en gebruikerstests.

## Lokaal starten

Node.js 22.13 of nieuwer is vereist.

```bash
npm install
npm run dev
npm.cmd run dev
```

Open daarna `http://localhost:3000`.

## Controleren

```bash
npm test
```

De interface is primair ontworpen voor een desktopscherm. Alle gegevens zijn
fictief en worden uitsluitend in de browser gebruikt.
