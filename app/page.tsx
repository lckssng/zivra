"use client";

import { CSSProperties, useMemo, useState } from "react";

type ProgressState = "progress" | "stable" | "attention";

type Patient = {
  id: number;
  name: string;
  initials: string;
  state: ProgressState;
  status: string;
  summary: string;
  lastSession: string;
  game: GameName;
  romDelta: number;
  scoreDelta: number;
  compensationDelta: number;
};

type GameName =
  | "Balloon Burst"
  | "Blokki"
  | "Butterfly Boost"
  | "Magische Ketel"
  | "Tafelbal";

type Session = {
  id: number;
  date: string;
  shortDate: string;
  game: GameName;
  movement: string;
  score: number;
  maximum: number;
  minRom: number;
  maxRom: number;
  pain: number;
  energy: number;
  frustration: number;
  compensation: "Laag" | "Gemiddeld" | "Hoog";
};

const patients: Patient[] = [
  {
    id: 1,
    name: "Saskia Groen",
    initials: "SG",
    state: "attention",
    status: "Aandacht nodig",
    summary: "Minder bereik en meer compensatie",
    lastSession: "Vandaag, 09:20",
    game: "Balloon Burst",
    romDelta: -8,
    scoreDelta: -11,
    compensationDelta: 18,
  },
  {
    id: 2,
    name: "Omar El Idrissi",
    initials: "OE",
    state: "progress",
    status: "Vooruitgang",
    summary: "Groter bereik met minder compensatie",
    lastSession: "Vandaag, 08:45",
    game: "Blokki",
    romDelta: 12,
    scoreDelta: 9,
    compensationDelta: -16,
  },
  {
    id: 3,
    name: "Iris Hoving",
    initials: "IH",
    state: "stable",
    status: "Gelijk gebleven",
    summary: "Beweging en score blijven stabiel",
    lastSession: "Gisteren, 15:10",
    game: "Butterfly Boost",
    romDelta: 2,
    scoreDelta: 1,
    compensationDelta: -2,
  },
  {
    id: 4,
    name: "Bram Kuiper",
    initials: "BK",
    state: "attention",
    status: "Aandacht nodig",
    summary: "Meer pijn en lagere bewegingsscore",
    lastSession: "Gisteren, 13:30",
    game: "Magische Ketel",
    romDelta: -5,
    scoreDelta: -8,
    compensationDelta: 12,
  },
  {
    id: 5,
    name: "Noor Dekker",
    initials: "ND",
    state: "progress",
    status: "Vooruitgang",
    summary: "Doelen vaker gehaald dan vorige maand",
    lastSession: "Ma 10 aug, 11:05",
    game: "Tafelbal",
    romDelta: 9,
    scoreDelta: 13,
    compensationDelta: -10,
  },
  {
    id: 6,
    name: "Pieter Aarts",
    initials: "PA",
    state: "stable",
    status: "Gelijk gebleven",
    summary: "Geen duidelijke verandering zichtbaar",
    lastSession: "Ma 10 aug, 09:40",
    game: "Blokki",
    romDelta: 1,
    scoreDelta: -1,
    compensationDelta: 1,
  },
  {
    id: 7,
    name: "Elsa Boers",
    initials: "EB",
    state: "attention",
    status: "Aandacht nodig",
    summary: "Energie daalt tijdens de laatste sessies",
    lastSession: "Vr 7 aug, 14:15",
    game: "Butterfly Boost",
    romDelta: -3,
    scoreDelta: -6,
    compensationDelta: 7,
  },
  {
    id: 8,
    name: "Joost Reinders",
    initials: "JR",
    state: "progress",
    status: "Vooruitgang",
    summary: "Rustiger bewegen en hoger maximaal bereik",
    lastSession: "Do 6 aug, 10:30",
    game: "Balloon Burst",
    romDelta: 7,
    scoreDelta: 8,
    compensationDelta: -12,
  },
];

const sessions: Session[] = [
  {
    id: 821,
    date: "11 augustus 2026, 09:20",
    shortDate: "11 aug",
    game: "Balloon Burst",
    movement: "Reiken boven schouderhoogte",
    score: 24,
    maximum: 30,
    minRom: 42,
    maxRom: 104,
    pain: 3,
    energy: 2,
    frustration: 3,
    compensation: "Hoog",
  },
  {
    id: 817,
    date: "10 augustus 2026, 14:05",
    shortDate: "10 aug",
    game: "Blokki",
    movement: "Voorwaarts reiken en grijpen",
    score: 21,
    maximum: 28,
    minRom: 39,
    maxRom: 98,
    pain: 2,
    energy: 3,
    frustration: 2,
    compensation: "Gemiddeld",
  },
  {
    id: 810,
    date: "6 augustus 2026, 10:35",
    shortDate: "6 aug",
    game: "Magische Ketel",
    movement: "Draaien van de onderarm",
    score: 19,
    maximum: 26,
    minRom: 35,
    maxRom: 94,
    pain: 2,
    energy: 3,
    frustration: 2,
    compensation: "Gemiddeld",
  },
  {
    id: 804,
    date: "31 juli 2026, 13:15",
    shortDate: "31 jul",
    game: "Butterfly Boost",
    movement: "Zijwaarts reiken",
    score: 22,
    maximum: 28,
    minRom: 37,
    maxRom: 101,
    pain: 2,
    energy: 4,
    frustration: 1,
    compensation: "Laag",
  },
  {
    id: 799,
    date: "27 juli 2026, 09:50",
    shortDate: "27 jul",
    game: "Tafelbal",
    movement: "Strekken van de elleboog",
    score: 18,
    maximum: 24,
    minRom: 31,
    maxRom: 91,
    pain: 3,
    energy: 3,
    frustration: 2,
    compensation: "Gemiddeld",
  },
  {
    id: 793,
    date: "23 juli 2026, 11:20",
    shortDate: "23 jul",
    game: "Balloon Burst",
    movement: "Reiken boven schouderhoogte",
    score: 20,
    maximum: 30,
    minRom: 29,
    maxRom: 88,
    pain: 3,
    energy: 2,
    frustration: 3,
    compensation: "Hoog",
  },
];

const months = ["Juni 2026", "Juli 2026", "Augustus 2026"];

const stateMeta: Record<ProgressState, { icon: string; label: string }> = {
  progress: { icon: "↗", label: "Vooruitgang" },
  stable: { icon: "→", label: "Gelijk gebleven" },
  attention: { icon: "!", label: "Aandacht nodig" },
};

const gameIcons: Record<GameName, string> = {
  "Balloon Burst": "●",
  Blokki: "◆",
  "Butterfly Boost": "✦",
  "Magische Ketel": "✺",
  Tafelbal: "◉",
};

function StatusBadge({ state }: { state: ProgressState }) {
  const meta = stateMeta[state];
  return (
    <span className={`status-badge ${state}`}>
      <span className="status-symbol" aria-hidden="true">
        {meta.icon}
      </span>
      {meta.label}
    </span>
  );
}

function GameLabel({ game }: { game: GameName }) {
  return (
    <span className="game-label">
      <span className="game-icon" aria-hidden="true">
        {gameIcons[game]}
      </span>
      {game}
    </span>
  );
}

function Sidebar({ onHome }: { onHome: () => void }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={onHome} aria-label="Ga naar patiëntenoverzicht">
        <span>ZIVRA</span>
        <i aria-hidden="true"><b /><b /><b /></i>
      </button>

      <nav aria-label="Hoofdnavigatie">
        <button className="nav-item active" onClick={onHome}>
          <span className="nav-icon" aria-hidden="true">◎</span>
          Patiënten
        </button>
        <button className="nav-item" type="button">
          <span className="nav-icon" aria-hidden="true">?</span>
          Hulp
        </button>
      </nav>

      <div className="sidebar-note">
        <span className="sidebar-note-icon" aria-hidden="true">✓</span>
        <span><strong>Alle gegevens bijgewerkt</strong>Vandaag om 09:32</span>
      </div>
      <button className="logout" type="button"><span aria-hidden="true">↪</span> Uitloggen</button>
    </aside>
  );
}

function Overview({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ProgressState>("all");
  const [monthIndex, setMonthIndex] = useState(2);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesQuery = patient.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" || patient.state === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const counts = {
    attention: patients.filter((patient) => patient.state === "attention").length,
    progress: patients.filter((patient) => patient.state === "progress").length,
    stable: patients.filter((patient) => patient.state === "stable").length,
  };

  return (
    <main className="main overview-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Maandelijkse voortgang</p>
          <h1>Patiënten</h1>
          <p className="page-intro">Zie direct wie vooruitgaat en wie extra aandacht nodig heeft.</p>
        </div>
        <div className="month-switcher" aria-label="Kies een maand">
          <button
            aria-label="Vorige maand"
            onClick={() => setMonthIndex((current) => Math.max(0, current - 1))}
            disabled={monthIndex === 0}
          >
            ←
          </button>
          <span>{months[monthIndex]}</span>
          <button
            aria-label="Volgende maand"
            onClick={() => setMonthIndex((current) => Math.min(months.length - 1, current + 1))}
            disabled={monthIndex === months.length - 1}
          >
            →
          </button>
        </div>
      </header>

      <section className="summary-strip" aria-label="Samenvatting van patiënten">
        <div className="summary-total"><strong>{patients.length}</strong><span>Patiënten in beeld</span></div>
        <button className="summary-state attention" onClick={() => setFilter("attention")}>
          <span className="summary-icon">!</span>
          <span><strong>{counts.attention} aandacht nodig</strong><small>Bekijk deze patiënten eerst</small></span>
        </button>
        <button className="summary-state progress" onClick={() => setFilter("progress")}>
          <span className="summary-icon">↗</span>
          <span><strong>{counts.progress} vooruitgang</strong><small>Ontwikkelen zich positief</small></span>
        </button>
        <button className="summary-state stable" onClick={() => setFilter("stable")}>
          <span className="summary-icon">→</span>
          <span><strong>{counts.stable} gelijk gebleven</strong><small>Geen duidelijke verandering</small></span>
        </button>
      </section>

      <section className="patient-panel">
        <div className="patient-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter patiënten op voortgang">
            {[
              ["all", "Alle patiënten"],
              ["attention", "Aandacht"],
              ["progress", "Vooruitgang"],
              ["stable", "Gelijk"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={filter === value ? "active" : ""}
                onClick={() => setFilter(value as "all" | ProgressState)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zoek een patiënt"
              aria-label="Zoek een patiënt"
            />
          </label>
        </div>

        <div className="patient-table" role="table" aria-label="Patiënten en maandelijkse voortgang">
          <div className="patient-table-head" role="row">
            <span>Patiënt</span>
            <span>Hoe gaat het deze maand?</span>
            <span aria-hidden="true" />
          </div>
          <div className="patient-rows">
            {filteredPatients.map((patient) => (
              <button
                className="patient-row"
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                aria-label={`Bekijk voortgang van ${patient.name}`}
              >
                <span className="patient-cell identity-cell">
                  <span className="avatar">{patient.initials}</span>
                  <span><strong>{patient.name}</strong></span>
                </span>
                <span className="patient-cell progress-cell">
                  <StatusBadge state={patient.state} />
                  <small>{patient.summary}</small>
                </span>
                <span className="open-patient">Bekijk <b aria-hidden="true">→</b></span>
              </button>
            ))}
            {filteredPatients.length === 0 && (
              <div className="empty-state">Geen patiënten gevonden. Probeer een andere zoekterm.</div>
            )}
          </div>
        </div>
        <p className="panel-hint"><span aria-hidden="true">i</span> Kies een patiënt om eerst de week en daarna de langere ontwikkeling te bekijken.</p>
      </section>
    </main>
  );
}

function PatientDetail({
  patient,
  onBack,
  onSelectSession,
}: {
  patient: Patient;
  onBack: () => void;
  onSelectSession: (session: Session) => void;
}) {
  const [monthIndex, setMonthIndex] = useState(2);
  const [showRomDetails, setShowRomDetails] = useState(false);
  const weekDays = [
    { day: "Wo", date: "5", session: null },
    { day: "Do", date: "6", session: sessions[2] },
    { day: "Vr", date: "7", session: null },
    { day: "Za", date: "8", session: null },
    { day: "Zo", date: "9", session: null },
    { day: "Ma", date: "10", session: sessions[1] },
    { day: "Di", date: "11", session: sessions[0] },
  ];
  const monthFlow: { label: string; state: ProgressState; reach: number; note: string }[] = [
    { label: "Juni", state: "progress", reach: 88, note: "Het bereik groeide rustig en de beweging werd zekerder." },
    { label: "Juli", state: "stable", reach: 96, note: "De resultaten bleven ongeveer gelijk aan de maand ervoor." },
    {
      label: "Augustus",
      state: patient.state,
      reach: Math.max(78, 100 + patient.romDelta),
      note: patient.summary,
    },
  ];
  const selectedMonth = monthFlow[monthIndex];

  return (
    <main className="main detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Alle patiënten</button>
        <div className="detail-title-row">
          <div className="patient-title">
            <span className="avatar large">{patient.initials}</span>
            <div><p className="eyebrow">Patiënt</p><h1>{patient.name}</h1></div>
          </div>
          <span className="current-period">Deze week · 5–11 augustus</span>
        </div>
      </header>

      <div className="flow-grid">
        <section className="flow-panel week-flow">
          <div className="flow-heading">
            <div><p className="flow-step">1 · Eerst bekijken</p><h2>Deze week</h2><span>Wat gebeurde er tijdens de laatste zeven dagen?</span></div>
            <span className="flow-type">MICRO</span>
          </div>

          <div className={`week-conclusion ${patient.state}`}>
            <StatusBadge state={patient.state} />
            <p>{patient.summary}</p>
          </div>

          <div className="week-days" aria-label="Sessies van 5 tot en met 11 augustus">
            {weekDays.map((item) => item.session ? (
              <button key={item.date} className="week-day has-session" onClick={() => onSelectSession(item.session!)} aria-label={`Bekijk sessie van ${item.day} ${item.date} augustus`}>
                <span>{item.day}</span><strong>{item.date}</strong><i /><small>Sessie</small>
              </button>
            ) : (
              <div key={item.date} className="week-day"><span>{item.day}</span><strong>{item.date}</strong><i /><small>—</small></div>
            ))}
          </div>

          <div className="week-session-list">
            {sessions.slice(0, 3).map((session) => (
              <button className="week-session-row" key={session.id} onClick={() => onSelectSession(session)}>
                <span className="session-game-icon" aria-hidden="true">{gameIcons[session.game]}</span>
                <span><strong>{session.game}</strong><small>{session.shortDate} · {session.movement}</small></span>
                <span className="simple-score"><strong>{session.score}/{session.maximum}</strong><small>behaald</small></span>
                <b aria-hidden="true">→</b>
              </button>
            ))}
          </div>
          <p className="simple-hint">Klik op een sessie voor pijn, energie, compensatie en behandeladvies.</p>
        </section>

        <section className="flow-panel months-flow">
          <div className="flow-heading">
            <div><p className="flow-step">2 · Daarna vergelijken</p><h2>Afgelopen maanden</h2><span>Is er een langere ontwikkeling zichtbaar?</span></div>
            <span className="flow-type">MACRO</span>
          </div>

          <div className="month-flow-list">
            {monthFlow.map((month, index) => (
              <button key={month.label} className={`month-flow-row ${monthIndex === index ? "active" : ""}`} onClick={() => setMonthIndex(index)}>
                <span className="month-name"><small>2026</small><strong>{month.label}</strong></span>
                <StatusBadge state={month.state} />
                <span className="month-reach"><strong>{month.reach}°</strong><small>max. bereik</small></span>
                <b aria-hidden="true">→</b>
              </button>
            ))}
          </div>

          <div className={`month-conclusion ${selectedMonth.state}`}>
            <p>Geselecteerd: {selectedMonth.label}</p>
            <h3>{stateMeta[selectedMonth.state].label}</h3>
            <span>{selectedMonth.note}</span>
            <button onClick={() => setShowRomDetails(true)}>Bekijk bewegingsdata <b aria-hidden="true">→</b></button>
          </div>
        </section>
      </div>

      {showRomDetails && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowRomDetails(false); }}>
          <section className="rom-detail-modal" role="dialog" aria-modal="true" aria-labelledby="rom-title">
            <div className="modal-header">
              <div><p className="eyebrow">{selectedMonth.label} 2026</p><h2 id="rom-title">Bewegingsbereik per sessie</h2></div>
              <button onClick={() => setShowRomDetails(false)}>Sluiten</button>
            </div>
            <div className="rom-modal-body">
              <div className="chart-legend"><span><i className="max-dot" /> Maximum</span><span><i className="range-line" /> Minimum–maximum</span></div>
              <div className="rom-chart" aria-label="Range of motion per sessie">
                <div className="y-axis"><span>120°</span><span>90°</span><span>60°</span><span>30°</span><span>0°</span></div>
                <div className="plot-area">
                  {sessions.map((session) => {
                    const style = {
                      "--min": `${(session.minRom / 120) * 100}%`,
                      "--max": `${(session.maxRom / 120) * 100}%`,
                    } as CSSProperties;
                    return (
                      <button className="rom-column" key={session.id} style={style} onClick={() => onSelectSession(session)} aria-label={`${session.shortDate}: minimum ${session.minRom} graden, maximum ${session.maxRom} graden`}>
                        <span className="rom-value">{session.maxRom}°</span>
                        <span className="rom-range"><i /></span>
                        <span className="chart-date">{session.shortDate}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="chart-note"><span aria-hidden="true">i</span> Klik op een meting om de sessie te openen.</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Scale({ label, value, type }: { label: string; value: number; type: "pain" | "energy" | "frustration" }) {
  const faces = type === "energy" ? ["—", "—", "•", "+", "+"] : ["•", "•", "—", "!", "!"];
  return (
    <div className="scale-row">
      <span>{label}</span>
      <div className={`scale-dots ${type}`} aria-label={`${label}: ${value} van 5`}>
        {[1, 2, 3, 4, 5].map((step) => <i key={step} className={step <= value ? "filled" : ""}>{faces[step - 1]}</i>)}
      </div>
      <strong>{value}/5</strong>
    </div>
  );
}

function SessionDetail({
  patient,
  session,
  onBack,
}: {
  patient: Patient;
  session: Session;
  onBack: () => void;
}) {
  const [showDemo, setShowDemo] = useState(false);
  const achieved = Math.round((session.score / session.maximum) * 100);

  return (
    <main className="main session-page">
      <header className="detail-header session-header">
        <button className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Terug naar {patient.name}</button>
        <div className="session-title-row">
          <div className="patient-title"><span className="avatar large">{patient.initials}</span><div><p className="eyebrow">Sessie {session.id}</p><h1>{session.game}</h1></div></div>
          <div className="session-date"><span aria-hidden="true">▣</span><strong>{session.date}</strong></div>
        </div>
      </header>

      <section className="session-summary-grid">
        <div className="session-summary-card"><span className="summary-card-icon purple">↗</span><div><p>Beweging</p><strong>{session.movement}</strong></div></div>
        <div className="session-summary-card"><span className="summary-card-icon green">✓</span><div><p>Behaald</p><strong>{session.score} van {session.maximum}</strong></div></div>
        <div className="session-summary-card"><span className="summary-card-icon blue">↔</span><div><p>Bewegingsbereik</p><strong>{session.minRom}° – {session.maxRom}°</strong></div></div>
        <div className="session-summary-card"><span className="summary-card-icon amber">◇</span><div><p>Compensatie</p><strong>{session.compensation}</strong></div></div>
      </section>

      <div className="session-content-grid">
        <section className="performance-panel">
          <div className="section-heading"><div><p className="eyebrow">Resultaat</p><h2>Doelen van deze training</h2></div><strong className="score-percent">{achieved}%</strong></div>
          <div className="score-bar"><i style={{ width: `${achieved}%` }} /></div>
          <div className="movement-results">
            <div><span><i className="result-dot purple" />Voorwaarts reiken</span><strong>6/6</strong></div>
            <div><span><i className="result-dot blue" />Boven schouderhoogte</span><strong>5/6</strong></div>
            <div><span><i className="result-dot amber" />Arm gecontroleerd terugbrengen</span><strong>4/6</strong></div>
            <div><span><i className="result-dot green" />Voorwerp gericht aanraken</span><strong>5/6</strong></div>
          </div>
          <button className="demo-button" onClick={() => setShowDemo(true)}>
            <span className="play-icon" aria-hidden="true">▶</span>
            <span><strong>Bekijk videobeelden in 3D</strong><small>Open alleen wanneer meer detail nodig is</small></span>
            <b aria-hidden="true">→</b>
          </button>
        </section>

        <aside className="session-side-panel">
          <section className="wellbeing-card">
            <div className="section-heading"><div><p className="eyebrow">Ervaring patiënt</p><h2>Na de sessie</h2></div></div>
            <Scale label="Pijn" value={session.pain} type="pain" />
            <Scale label="Energie" value={session.energy} type="energy" />
            <Scale label="Frustratie" value={session.frustration} type="frustration" />
          </section>
          <section className="feedback-card">
            <div><span className="feedback-icon">✓</span><p><strong>Feedback</strong>De beweging begint rustig. Aan het einde beweegt de romp vaker mee.</p></div>
            <div><span className="feedback-icon next">→</span><p><strong>Volgende keer</strong>Train kortere reeksen en let op ontspannen schouders.</p></div>
          </section>
        </aside>
      </div>

      {showDemo && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowDemo(false); }}>
          <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
            <div className="modal-header"><div><p className="eyebrow">Demo 3D-weergave</p><h2 id="demo-title">Beweging terugkijken</h2></div><button onClick={() => setShowDemo(false)} aria-label="Sluit 3D-demo">Sluiten</button></div>
            <div className="demo-stage">
              <div className="demo-grid-lines" />
              <div className="person-model" aria-label="Vereenvoudigd 3D-model van armbeweging">
                <i className="head" /><i className="body" /><i className="left-arm" /><i className="right-arm" /><i className="raised-hand" />
              </div>
              <span className="movement-path">104°</span>
            </div>
            <div className="demo-controls"><button className="play-control" type="button">▶ Afspelen</button><span>00:14</span><div className="timeline"><i /></div><span>00:48</span></div>
            <p className="demo-disclaimer">Demoweergave — in het uiteindelijke platform worden hier de echte 3D-beelden geladen.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ZivraDashboard() {
  const [view, setView] = useState<"overview" | "patient" | "session">("overview");
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
  const [selectedSession, setSelectedSession] = useState<Session>(sessions[0]);

  const goHome = () => setView("overview");
  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setView("patient");
  };
  const selectSession = (session: Session) => {
    setSelectedSession(session);
    setView("session");
  };

  return (
    <div className="app-shell">
      <Sidebar onHome={goHome} />
      {view === "overview" && <Overview onSelectPatient={selectPatient} />}
      {view === "patient" && <PatientDetail patient={selectedPatient} onBack={goHome} onSelectSession={selectSession} />}
      {view === "session" && <SessionDetail patient={selectedPatient} session={selectedSession} onBack={() => setView("patient")} />}
    </div>
  );
}
