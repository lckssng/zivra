"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Balloon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDotDashed,
  Crosshair,
  FlaskConical,
  Info,
  LogOut,
  Minus,
  Play,
  RotateCcw,
  Search,
  ToyBrick,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Arm,
  Body,
  ChartLine,
  Joints,
  PhysicalTherapy,
  RegularPatient,
} from "healthicons-react/outline";

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
  dateKey: string;
  shortDate: string;
  startTime: string;
  game: GameName;
  movement: string;
  romJoint: string;
  score: number;
  maximum: number;
  durationSeconds: number;
  activityMinutes: number;
  minRom: number;
  maxRom: number;
  pain: number | null;
  energy: number | null;
  frustration: number | null;
  compensation: boolean;
  feedback: string;
  nextStep: string;
};

type ActivityDay = {
  key: string;
  day: string;
  date: string;
  month: string;
  sessionIds: number[];
};

type ActivityWeek = {
  label: string;
  days: ActivityDay[];
};

type MetricKey = "forward" | "shoulder" | "return" | "touch";

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
    dateKey: "2026-08-11",
    shortDate: "11 aug",
    startTime: "09:20",
    game: "Balloon Burst",
    movement: "Reiken boven schouderhoogte",
    romJoint: "Schouderflexie rechterarm",
    score: 19,
    maximum: 26,
    durationSeconds: 134,
    activityMinutes: 12,
    minRom: 42,
    maxRom: 104,
    pain: null,
    energy: null,
    frustration: null,
    compensation: true,
    feedback: "De beweging begint rustig. Rond 01:15 beweegt de romp kort mee.",
    nextStep: "Train kortere reeksen en let op ontspannen schouders.",
  },
  {
    id: 822,
    date: "11 augustus 2026, 10:05",
    dateKey: "2026-08-11",
    shortDate: "11 aug",
    startTime: "10:05",
    game: "Blokki",
    movement: "Voorwaarts reiken en grijpen",
    romJoint: "Schouderflexie en elleboogstrekking",
    score: 32,
    maximum: 36,
    durationSeconds: 156,
    activityMinutes: 10,
    minRom: 38,
    maxRom: 98,
    pain: null,
    energy: null,
    frustration: null,
    compensation: false,
    feedback: "De reikafstand nam per poging toe zonder zichtbare rompbeweging.",
    nextStep: "Herhaal dezelfde afstand en voeg één extra doelpositie toe.",
  },
  {
    id: 823,
    date: "11 augustus 2026, 14:20",
    dateKey: "2026-08-11",
    shortDate: "11 aug",
    startTime: "14:20",
    game: "Tafelbal",
    movement: "Gericht aanraken en terugbrengen",
    romJoint: "Schouderflexie rechterarm",
    score: 21,
    maximum: 28,
    durationSeconds: 171,
    activityMinutes: 8,
    minRom: 34,
    maxRom: 92,
    pain: null,
    energy: null,
    frustration: null,
    compensation: true,
    feedback: "Bij de laatste twee doelen was kort schouderoptrekken zichtbaar.",
    nextStep: "Bouw na zes herhalingen een korte rustpauze in.",
  },
  {
    id: 817,
    date: "10 augustus 2026, 14:05",
    dateKey: "2026-08-10",
    shortDate: "10 aug",
    startTime: "14:05",
    game: "Blokki",
    movement: "Voorwaarts reiken en grijpen",
    romJoint: "Schouderflexie en elleboogstrekking",
    score: 21,
    maximum: 28,
    durationSeconds: 148,
    activityMinutes: 16,
    minRom: 39,
    maxRom: 98,
    pain: null,
    energy: null,
    frustration: null,
    compensation: true,
    feedback: "De laatste reeks was minder vloeiend dan de eerste twee reeksen.",
    nextStep: "Verlaag het tempo zodra de romp begint mee te bewegen.",
  },
  {
    id: 810,
    date: "6 augustus 2026, 10:35",
    dateKey: "2026-08-06",
    shortDate: "6 aug",
    startTime: "10:35",
    game: "Magische Ketel",
    movement: "Draaien van de onderarm",
    romJoint: "Onderarmrotatie rechterarm",
    score: 19,
    maximum: 26,
    durationSeconds: 162,
    activityMinutes: 18,
    minRom: 35,
    maxRom: 94,
    pain: null,
    energy: null,
    frustration: null,
    compensation: false,
    feedback: "De onderarmrotatie bleef gelijkmatig over de volledige reeks.",
    nextStep: "Voeg lichte weerstand toe als de beweging ontspannen blijft.",
  },
  {
    id: 804,
    date: "31 juli 2026, 13:15",
    dateKey: "2026-07-31",
    shortDate: "31 jul",
    startTime: "13:15",
    game: "Butterfly Boost",
    movement: "Zijwaarts reiken",
    romJoint: "Schouderabductie rechterarm",
    score: 22,
    maximum: 28,
    durationSeconds: 151,
    activityMinutes: 14,
    minRom: 37,
    maxRom: 101,
    pain: null,
    energy: null,
    frustration: null,
    compensation: false,
    feedback: "De arm bleef goed in het bewegingsvlak.",
    nextStep: "Vergroot de doelafstand met vijf centimeter.",
  },
  {
    id: 799,
    date: "27 juli 2026, 09:50",
    dateKey: "2026-07-27",
    shortDate: "27 jul",
    startTime: "09:50",
    game: "Tafelbal",
    movement: "Strekken van de elleboog",
    romJoint: "Elleboogstrekking rechterarm",
    score: 18,
    maximum: 24,
    durationSeconds: 139,
    activityMinutes: 11,
    minRom: 31,
    maxRom: 91,
    pain: null,
    energy: null,
    frustration: null,
    compensation: true,
    feedback: "De romp bewoog mee bij doelen aan de buitenzijde.",
    nextStep: "Plaats de buitenste doelen iets dichter bij het midden.",
  },
  {
    id: 793,
    date: "23 juli 2026, 11:20",
    dateKey: "2026-07-23",
    shortDate: "23 jul",
    startTime: "11:20",
    game: "Balloon Burst",
    movement: "Reiken boven schouderhoogte",
    romJoint: "Schouderflexie rechterarm",
    score: 20,
    maximum: 30,
    durationSeconds: 173,
    activityMinutes: 15,
    minRom: 29,
    maxRom: 88,
    pain: null,
    energy: null,
    frustration: null,
    compensation: true,
    feedback: "Na ongeveer twee minuten werd de beweging minder gecontroleerd.",
    nextStep: "Werk met reeksen van maximaal twee minuten.",
  },
];

const months = ["Juni 2026", "Juli 2026", "Augustus 2026"];

const sessionById = (id: number) => sessions.find((session) => session.id === id)!;

const activityWeeks: ActivityWeek[] = [
  {
    label: "27 juli – 2 augustus",
    days: [
      { key: "2026-07-27", day: "Ma", date: "27", month: "jul", sessionIds: [799] },
      { key: "2026-07-28", day: "Di", date: "28", month: "jul", sessionIds: [] },
      { key: "2026-07-29", day: "Wo", date: "29", month: "jul", sessionIds: [] },
      { key: "2026-07-30", day: "Do", date: "30", month: "jul", sessionIds: [] },
      { key: "2026-07-31", day: "Vr", date: "31", month: "jul", sessionIds: [804] },
      { key: "2026-08-01", day: "Za", date: "1", month: "aug", sessionIds: [] },
      { key: "2026-08-02", day: "Zo", date: "2", month: "aug", sessionIds: [] },
    ],
  },
  {
    label: "3 – 9 augustus",
    days: [
      { key: "2026-08-03", day: "Ma", date: "3", month: "aug", sessionIds: [] },
      { key: "2026-08-04", day: "Di", date: "4", month: "aug", sessionIds: [] },
      { key: "2026-08-05", day: "Wo", date: "5", month: "aug", sessionIds: [] },
      { key: "2026-08-06", day: "Do", date: "6", month: "aug", sessionIds: [810] },
      { key: "2026-08-07", day: "Vr", date: "7", month: "aug", sessionIds: [] },
      { key: "2026-08-08", day: "Za", date: "8", month: "aug", sessionIds: [] },
      { key: "2026-08-09", day: "Zo", date: "9", month: "aug", sessionIds: [] },
    ],
  },
  {
    label: "10 – 16 augustus",
    days: [
      { key: "2026-08-10", day: "Ma", date: "10", month: "aug", sessionIds: [817] },
      { key: "2026-08-11", day: "Di", date: "11", month: "aug", sessionIds: [821, 822, 823] },
      { key: "2026-08-12", day: "Wo", date: "12", month: "aug", sessionIds: [] },
      { key: "2026-08-13", day: "Do", date: "13", month: "aug", sessionIds: [] },
      { key: "2026-08-14", day: "Vr", date: "14", month: "aug", sessionIds: [] },
      { key: "2026-08-15", day: "Za", date: "15", month: "aug", sessionIds: [] },
      { key: "2026-08-16", day: "Zo", date: "16", month: "aug", sessionIds: [] },
    ],
  },
];

const monthActivity = [
  {
    label: "Juni 2026",
    state: "progress" as ProgressState,
    reach: 88,
    weeks: [
      { label: "1 jun", minutes: 74, compensated: 18 },
      { label: "8 jun", minutes: 96, compensated: 21 },
      { label: "15 jun", minutes: 82, compensated: 16 },
      { label: "22 jun", minutes: 108, compensated: 19 },
      { label: "29 jun", minutes: 42, compensated: 8 },
    ],
  },
  {
    label: "Juli 2026",
    state: "stable" as ProgressState,
    reach: 96,
    weeks: [
      { label: "6 jul", minutes: 88, compensated: 22 },
      { label: "13 jul", minutes: 104, compensated: 24 },
      { label: "20 jul", minutes: 91, compensated: 27 },
      { label: "27 jul", minutes: 79, compensated: 25 },
    ],
  },
  {
    label: "Augustus 2026",
    state: "attention" as ProgressState,
    reach: 92,
    weeks: [
      { label: "3 aug", minutes: 18, compensated: 0 },
      { label: "10 aug", minutes: 46, compensated: 20 },
      { label: "17 aug", minutes: 0, compensated: 0 },
      { label: "24 aug", minutes: 0, compensated: 0 },
      { label: "31 aug", minutes: 0, compensated: 0 },
    ],
  },
];

const stateMeta: Record<ProgressState, { label: string }> = {
  progress: { label: "Vooruitgang" },
  stable: { label: "Gelijk gebleven" },
  attention: { label: "Aandacht nodig" },
};

function StatusIcon({ state, size = 14 }: { state: ProgressState; size?: number }) {
  if (state === "progress") return <TrendingUp width={size} height={size} strokeWidth={2.2} aria-hidden="true" />;
  if (state === "stable") return <Minus width={size} height={size} strokeWidth={2.2} aria-hidden="true" />;
  return <CircleAlert width={size} height={size} strokeWidth={2.2} aria-hidden="true" />;
}

function GameIcon({ game, size = 18 }: { game: GameName; size?: number }) {
  const props = { width: size, height: size, strokeWidth: 1.9, "aria-hidden": true } as const;
  if (game === "Balloon Burst") return <Balloon {...props} />;
  if (game === "Blokki") return <ToyBrick {...props} />;
  if (game === "Butterfly Boost") return <Activity {...props} />;
  if (game === "Magische Ketel") return <FlaskConical {...props} />;
  return <CircleDotDashed {...props} />;
}

function MetricIcon({ metric, size = 18 }: { metric: MetricKey; size?: number }) {
  if (metric === "forward") return <PhysicalTherapy width={size} height={size} aria-hidden="true" />;
  if (metric === "shoulder") return <Joints width={size} height={size} aria-hidden="true" />;
  if (metric === "return") return <RotateCcw width={size} height={size} strokeWidth={1.9} aria-hidden="true" />;
  return <Crosshair width={size} height={size} strokeWidth={1.9} aria-hidden="true" />;
}

function StatusBadge({ state }: { state: ProgressState }) {
  const meta = stateMeta[state];
  return (
    <span className={`status-badge ${state}`}>
      <span className="status-symbol" aria-hidden="true">
        <StatusIcon state={state} />
      </span>
      {meta.label}
    </span>
  );
}

function GameLabel({ game }: { game: GameName }) {
  return (
    <span className="game-label">
      <span className="game-icon" aria-hidden="true">
        <GameIcon game={game} />
      </span>
      {game}
    </span>
  );
}

function Sidebar({ onHome }: { onHome: () => void }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={onHome} aria-label="Ga naar patiëntenoverzicht">
        <span>Zivra</span>
        <i aria-hidden="true"><b /><b /><b /></i>
      </button>

      <nav aria-label="Hoofdnavigatie">
        <button className="nav-item active" onClick={onHome}>
          <span className="nav-icon" aria-hidden="true"><RegularPatient width={19} height={19} /></span>
          Patiënten
        </button>
      </nav>

      <div className="sidebar-note">
        <span className="sidebar-note-icon" aria-hidden="true"><CircleCheck width={15} height={15} strokeWidth={2} /></span>
        <span><strong>Alle gegevens bijgewerkt</strong>Vandaag om 09:32</span>
      </div>
      <button className="logout" type="button"><LogOut width={18} height={18} strokeWidth={1.8} aria-hidden="true" /> Uitloggen</button>
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
          <h1>Patiënten</h1>
          <p className="page-intro">Zie direct wie vooruitgaat en wie extra aandacht nodig heeft.</p>
        </div>
        <div className="month-switcher" aria-label="Kies een maand">
          <button
            aria-label="Vorige maand"
            onClick={() => setMonthIndex((current) => Math.max(0, current - 1))}
            disabled={monthIndex === 0}
          >
            <ChevronLeft width={18} height={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <span>{months[monthIndex]}</span>
          <button
            aria-label="Volgende maand"
            onClick={() => setMonthIndex((current) => Math.min(months.length - 1, current + 1))}
            disabled={monthIndex === months.length - 1}
          >
            <ChevronRight width={18} height={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="summary-strip" aria-label="Samenvatting van patiënten">
        <div className="summary-total"><strong>{patients.length}</strong><span>Patiënten in beeld</span></div>
        <button className="summary-state attention" onClick={() => setFilter("attention")}>
          <span className="summary-icon"><CircleAlert width={20} height={20} strokeWidth={2} aria-hidden="true" /></span>
          <span><strong>{counts.attention} aandacht nodig</strong><small>Bekijk deze patiënten eerst</small></span>
        </button>
        <button className="summary-state progress" onClick={() => setFilter("progress")}>
          <span className="summary-icon"><TrendingUp width={20} height={20} strokeWidth={2} aria-hidden="true" /></span>
          <span><strong>{counts.progress} vooruitgang</strong><small>Ontwikkelen zich positief</small></span>
        </button>
        <button className="summary-state stable" onClick={() => setFilter("stable")}>
          <span className="summary-icon"><Minus width={20} height={20} strokeWidth={2} aria-hidden="true" /></span>
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
            <Search width={17} height={17} strokeWidth={1.9} aria-hidden="true" />
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
                <span className="open-patient">Bekijk <ArrowRight width={15} height={15} strokeWidth={2} aria-hidden="true" /></span>
              </button>
            ))}
            {filteredPatients.length === 0 && (
              <div className="empty-state">Geen patiënten gevonden. Probeer een andere zoekterm.</div>
            )}
          </div>
        </div>
        <p className="panel-hint"><Info width={16} height={16} strokeWidth={1.9} aria-hidden="true" /> Kies een patiënt om eerst de week en daarna de langere ontwikkeling te bekijken.</p>
      </section>
    </main>
  );
}

function WeeklyActivityChart({ onSelectSession }: { onSelectSession: (session: Session) => void }) {
  const [weekIndex, setWeekIndex] = useState(2);
  const [showRestDays, setShowRestDays] = useState(true);
  const week = activityWeeks[weekIndex];
  const visibleDays = showRestDays ? week.days : week.days.filter((day) => day.sessionIds.length > 0);

  return (
    <div className="activity-module">
      <div className="activity-controls">
        <div className="period-navigation" aria-label="Navigeer tussen weken">
          <button onClick={() => setWeekIndex((current) => Math.max(0, current - 1))} disabled={weekIndex === 0} aria-label="Vorige week"><ChevronLeft width={18} height={18} strokeWidth={2} aria-hidden="true" /></button>
          <span><strong>{week.label}</strong><small>Maandag t/m zondag</small></span>
          <button onClick={() => setWeekIndex((current) => Math.min(activityWeeks.length - 1, current + 1))} disabled={weekIndex === activityWeeks.length - 1} aria-label="Volgende week"><ChevronRight width={18} height={18} strokeWidth={2} aria-hidden="true" /></button>
        </div>
        <div className="day-toggle" role="group" aria-label="Toon actieve dagen of alle dagen">
          <button className={!showRestDays ? "active" : ""} onClick={() => setShowRestDays(false)}>Alleen activiteiten</button>
          <button className={showRestDays ? "active" : ""} onClick={() => setShowRestDays(true)}>Met rustdagen</button>
        </div>
      </div>

      <div className="activity-legend" aria-label="Legenda">
        <span><i className="legend-dot no-comp" /> Geen compensatie</span>
        <span><i className="legend-dot comp" /> Compensatie</span>
        <span><i className="legend-dot rest" /> Rustdag</span>
      </div>

      <div className="bar-chart weekly-bars" aria-label={`Trainingsactiviteiten in de week ${week.label}`}>
        <div className="bar-y-axis"><span>30m</span><span>20m</span><span>10m</span><span>0m</span></div>
        <div className={`bar-plot ${showRestDays ? "seven-days" : "active-days"}`}>
          {visibleDays.map((day) => {
            const daySessions = day.sessionIds.map(sessionById);
            const total = daySessions.reduce((sum, item) => sum + item.activityMinutes, 0);
            return (
              <div className={`activity-day ${day.sessionIds.length ? "has-activity" : "is-rest"}`} key={day.key}>
                <div className="day-bar-shell">
                  {daySessions.length > 0 ? (
                    <div className="activity-stack" style={{ height: `${Math.max(12, (total / 30) * 100)}%` }}>
                      {daySessions.map((item, index) => (
                        <button
                          key={item.id}
                          className={`activity-segment ${item.compensation ? "has-compensation" : "no-compensation"}`}
                          style={{ flex: item.activityMinutes }}
                          onClick={() => onSelectSession(item)}
                          aria-label={`${item.game}, ${item.activityMinutes} minuten, compensatie ${item.compensation ? "ja" : "nee"}. Open sessie.`}
                        >
                          <span>{daySessions.length > 1 ? `S${index + 1}` : item.activityMinutes >= 10 ? item.game : "Sessie"}</span>
                        </button>
                      ))}
                    </div>
                  ) : <div className="rest-bar" aria-label="Rustdag" />}
                </div>
                <div className="day-label"><strong>{day.day}</strong><span>{day.date} {day.month}</span></div>
                <div className="activity-tooltip" role="tooltip">
                  <strong>{day.day} {day.date} {day.month}</strong>
                  {daySessions.length ? (
                    <>
                      <span>{total} minuten · {daySessions.length} {daySessions.length === 1 ? "sessie" : "sessies"}</span>
                      {daySessions.map((item) => <small key={item.id}>{item.startTime} · {item.game} · compensatie {item.compensation ? "ja" : "nee"}</small>)}
                    </>
                  ) : <span>Geen activiteit geregistreerd</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="chart-footnote"><Info width={16} height={16} strokeWidth={1.9} aria-hidden="true" /> De schaal gebruikt minuten; per dag worden sessies op elkaar gestapeld. Klik op een kleurvlak om de sessie te openen.</p>
    </div>
  );
}

function MonthlyActivityChart({
  patient,
}: {
  patient: Patient;
}) {
  const [monthIndex, setMonthIndex] = useState(2);
  const month = monthActivity[monthIndex];
  const selectedState = monthIndex === 2 ? patient.state : month.state;

  return (
    <div className="macro-module">
      <div className="macro-summary">
        <StatusBadge state={selectedState} />
        <span><strong>{month.reach}°</strong> maximaal bewegingsbereik</span>
      </div>
      <div className="period-navigation month-navigation" aria-label="Navigeer tussen maanden">
        <button onClick={() => setMonthIndex((current) => Math.max(0, current - 1))} disabled={monthIndex === 0} aria-label="Vorige maand"><ChevronLeft width={18} height={18} strokeWidth={2} aria-hidden="true" /></button>
        <span><strong>{month.label}</strong><small>Weken starten op maandag</small></span>
        <button onClick={() => setMonthIndex((current) => Math.min(monthActivity.length - 1, current + 1))} disabled={monthIndex === monthActivity.length - 1} aria-label="Volgende maand"><ChevronRight width={18} height={18} strokeWidth={2} aria-hidden="true" /></button>
      </div>

      <div className="bar-chart month-bars" aria-label={`Trainingsactiviteiten in ${month.label}`}>
        <div className="bar-y-axis"><span>3u</span><span>2u</span><span>1u</span><span>0u</span></div>
        <div className="bar-plot month-plot">
          {month.weeks.map((week) => {
            const regular = Math.max(0, week.minutes - week.compensated);
            return (
              <div className="activity-day month-week" key={week.label}>
                <div className="day-bar-shell">
                  {week.minutes > 0 ? (
                    <div className="activity-stack" style={{ height: `${Math.max(8, (week.minutes / 180) * 100)}%` }}>
                      {regular > 0 && <span className="activity-segment no-compensation" style={{ flex: regular }} />}
                      {week.compensated > 0 && <span className="activity-segment has-compensation" style={{ flex: week.compensated }} />}
                    </div>
                  ) : <div className="rest-bar" />}
                </div>
                <div className="day-label"><strong>{week.label}</strong><span>{week.minutes} min</span></div>
                <div className="activity-tooltip" role="tooltip"><strong>Week van {week.label}</strong><span>{week.minutes} minuten totaal</span><small>{week.compensated} minuten met compensatie</small></div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
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
  return (
    <main className="main detail-page activity-detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={onBack}><ArrowLeft width={18} height={18} strokeWidth={2} aria-hidden="true" /> Alle patiënten</button>
        <div className="detail-title-row">
          <div className="patient-title">
            <span className="avatar large">{patient.initials}</span>
            <div><h1>{patient.name}</h1></div>
          </div>
          <span className="current-period">Deze week · 10–16 augustus</span>
        </div>
      </header>

      <div className="flow-grid data-flow-grid">
        <section className="flow-panel week-flow activity-flow-panel">
          <div className="flow-heading">
            <div><h2>Activiteiten per week</h2><span>Wanneer is er getraind, hoe lang en met compensatie?</span></div>
          </div>
          <div className={`week-conclusion ${patient.state}`}>
            <StatusBadge state={patient.state} />
            <p>{patient.summary}</p>
          </div>
          <WeeklyActivityChart onSelectSession={onSelectSession} />
        </section>

        <section className="flow-panel months-flow activity-flow-panel">
          <div className="flow-heading">
            <div><h2>Activiteiten per maand</h2><span>Hoe verandert het trainingsvolume over meerdere weken?</span></div>
          </div>
          <MonthlyActivityChart patient={patient} />
        </section>
      </div>
    </main>
  );
}

function Scale({ label, value, type }: { label: string; value: number | null; type: "pain" | "energy" | "frustration" }) {
  const empty = value === null;
  return (
    <div className={`scale-row ${empty ? "is-empty" : ""}`}>
      <span>{label}</span>
      <div className={`scale-dots ${type}`} aria-label={empty ? `${label}: niet ingevuld` : `${label}: ${value} van 5`}>
        {[1, 2, 3, 4, 5].map((step) => <i key={step} className={!empty && step <= value ? "filled" : ""}>{step}</i>)}
      </div>
      <strong>{empty ? "—" : `${value}/5`}</strong>
      {empty && <small>Niet ingevuld</small>}
    </div>
  );
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder.toString().padStart(2, "0")}s`;
}

function formatTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
}

function SessionSummaryCard({
  icon,
  tone,
  label,
  value,
  detail,
  more,
}: {
  icon: ReactNode;
  tone: "purple" | "green" | "blue" | "amber" | "red";
  label: string;
  value: string;
  detail: string;
  more: string;
}) {
  return (
    <div className="session-summary-card info-card" tabIndex={0} aria-label={`${label}: ${value}. ${detail}. ${more}`}>
      <span className={`summary-card-icon ${tone}`}>{icon}</span>
      <div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div>
      <span className="info-indicator" aria-hidden="true"><Info width={11} height={11} strokeWidth={2} /></span>
      <span className="summary-tooltip" role="tooltip">{more}</span>
    </div>
  );
}

const metricDefinitions: Record<MetricKey, {
  label: string;
  shortLabel: string;
  unit: string;
  valueLabel: string;
  maximum: number;
  chart: "bars" | "line";
  improvement: "higher" | "lower";
  description: string;
  values: number[];
  compensationValues?: number[];
}> = {
  forward: {
    label: "Voorwaarts reiken",
    shortLabel: "Reikafstand",
    unit: "cm",
    valueLabel: "centimeter",
    maximum: 60,
    chart: "bars",
    improvement: "higher",
    description: "Afstand van de romp tot het verste gecontroleerd bereikte punt.",
    values: [28, 33, 38, 43, 47, 51],
    compensationValues: [28, 34, 40, 44, 44, 46],
  },
  shoulder: {
    label: "Boven schouderhoogte",
    shortLabel: "Schouderflexie",
    unit: "°",
    valueLabel: "graden",
    maximum: 120,
    chart: "line",
    improvement: "higher",
    description: "Schouderflexie van de rechterarm gedurende de activiteit.",
    values: [44, 58, 72, 86, 98, 108],
    compensationValues: [44, 60, 76, 91, 91, 93],
  },
  return: {
    label: "Arm gecontroleerd terugbrengen",
    shortLabel: "Terugbrengtijd",
    unit: "s",
    valueLabel: "seconden",
    maximum: 4,
    chart: "line",
    improvement: "lower",
    description: "Tijd om de arm gecontroleerd naar de beginpositie terug te brengen.",
    values: [3.4, 3.1, 2.9, 2.7, 2.5, 2.3],
    compensationValues: [3.4, 3.1, 2.9, 2.8, 2.8, 2.9],
  },
  touch: {
    label: "Voorwerp gericht aanraken",
    shortLabel: "Aangeraakte voorwerpen",
    unit: "",
    valueLabel: "voorwerpen",
    maximum: 18,
    chart: "line",
    improvement: "higher",
    description: "Cumulatief aantal correct aangeraakte voorwerpen gedurende de sessie.",
    values: [0, 3, 6, 8, 12, 17],
  },
};

type MetricResult = { achieved: number; target: number };

const metricKeys: MetricKey[] = ["forward", "shoulder", "return", "touch"];

const sessionMetricSeries: Partial<Record<number, Record<MetricKey, number[]>>> = {
  821: {
    forward: [27, 32, 38, 43, 42, 46],
    shoulder: [42, 58, 74, 91, 99, 104],
    return: [3.6, 3.3, 3.1, 2.9, 3.0, 2.8],
    touch: [0, 1, 4, 5, 6, 8],
  },
  822: {
    forward: [25, 33, 41, 48, 54, 57],
    shoulder: [38, 52, 68, 82, 91, 98],
    return: [3.3, 3.0, 2.7, 2.4, 2.2, 2.0],
    touch: [0, 2, 3, 6, 7, 9],
  },
  823: {
    forward: [23, 29, 35, 41, 39, 43],
    shoulder: [34, 48, 63, 77, 86, 92],
    return: [3.8, 3.5, 3.2, 3.1, 3.2, 3.0],
    touch: [0, 1, 2, 3, 5, 7],
  },
};

const dailyMetricResults: Record<string, Record<MetricKey, MetricResult>> = {
  "2026-08-11": {
    forward: { achieved: 6, target: 6 },
    shoulder: { achieved: 5, target: 6 },
    return: { achieved: 4, target: 6 },
    touch: { achieved: 17, target: 18 },
  },
  "2026-08-10": {
    forward: { achieved: 5, target: 6 },
    shoulder: { achieved: 4, target: 6 },
    return: { achieved: 4, target: 6 },
    touch: { achieved: 16, target: 18 },
  },
  "2026-08-06": {
    forward: { achieved: 5, target: 6 },
    shoulder: { achieved: 5, target: 6 },
    return: { achieved: 4, target: 6 },
    touch: { achieved: 17, target: 18 },
  },
  "2026-07-31": {
    forward: { achieved: 6, target: 6 },
    shoulder: { achieved: 5, target: 6 },
    return: { achieved: 5, target: 6 },
    touch: { achieved: 17, target: 18 },
  },
  "2026-07-27": {
    forward: { achieved: 4, target: 6 },
    shoulder: { achieved: 4, target: 6 },
    return: { achieved: 5, target: 6 },
    touch: { achieved: 16, target: 18 },
  },
  "2026-07-23": {
    forward: { achieved: 5, target: 6 },
    shoulder: { achieved: 5, target: 6 },
    return: { achieved: 4, target: 6 },
    touch: { achieved: 16, target: 18 },
  },
};

function MetricDetailChart({
  metric,
  session,
  onOpenMedia,
}: {
  metric: MetricKey;
  session: Session;
  onOpenMedia: (moment: string) => void;
}) {
  const definition = metricDefinitions[metric];
  const offset = (session.id % 3) - 1;
  const sourceValues = session.compensation && definition.compensationValues
    ? definition.compensationValues
    : definition.values;
  const values = sessionMetricSeries[session.id]?.[metric] ?? sourceValues.map((value, index) => {
    if (metric === "touch" && index === 0) return 0;
    const sessionOffset = metric === "touch"
      ? offset * Math.max(1, Math.round(index / 2))
      : metric === "return"
        ? offset * 0.1
        : offset * 2;
    const adjusted = value + sessionOffset;
    return Math.max(0, Math.min(definition.maximum, Number(adjusted.toFixed(1))));
  });
  const times = values.map((_, index) => formatTimestamp(Math.round((session.durationSeconds * index) / (values.length - 1))));
  const lastValue = values[values.length - 1];
  const trendThreshold = metric === "return" ? 0.05 : 0.5;
  const trendForSegment = (value: number, nextValue: number | undefined) => {
    if (nextValue === undefined) return "stable";
    if (metric === "touch") return nextValue - value >= 3 ? "improving" : "limited";
    const change = definition.improvement === "lower" ? value - nextValue : nextValue - value;
    if (change > trendThreshold) return "improving";
    if (change < -trendThreshold) return "declining";
    return "stable";
  };
  return (
    <section className="metric-detail-panel" aria-live="polite">
      <div className="metric-detail-heading">
        <div><h3>{definition.label}</h3><span>Sessie {session.id} · {definition.description}</span></div>
        <div className="metric-current-value"><strong>{lastValue}{definition.unit}</strong><small>{metric === "touch" ? "voorwerpen geraakt" : metric === "return" ? "laatste meting · lager is beter" : "laatste meting"}</small></div>
      </div>

      <div className={`metric-chart ${definition.chart}`} aria-label={`${definition.label} gedurende ${formatDuration(session.durationSeconds)}`}>
        <div className="metric-y-axis"><span>{definition.maximum}{definition.unit}</span><span>{definition.maximum / 2}{definition.unit}</span><span>0{definition.unit}</span></div>
        <div className="metric-plot">
          {values.map((value, index) => {
            const bottom = (value / definition.maximum) * 100;
            const next = values[index + 1];
            const nextBottom = next === undefined ? bottom : (next / definition.maximum) * 100;
            const lineDifference = nextBottom - bottom;
            const lineDirection = lineDifference > 0.01 ? "rising" : lineDifference < -0.01 ? "falling" : "level";
            const lineSize = Math.abs(lineDifference);
            const isCompensation = metric !== "touch" && session.compensation && (index === 3 || index === 4);
            const trend = trendForSegment(value, next);
            const barTrend = index === 0 ? "improving" : trendForSegment(values[index - 1], value);
            if (definition.chart === "bars") {
              return (
                <button key={times[index]} className={`metric-bar ${barTrend} ${isCompensation ? "comp-point" : ""}`} style={{ height: `${bottom}%` }} onClick={() => onOpenMedia(times[index])} aria-label={`${times[index]}: ${value} ${definition.valueLabel}${isCompensation ? ", compensatie zichtbaar" : ""}. Open beelden.`}>
                  <span>{value}{definition.unit}</span><small>{times[index]}</small>
                </button>
              );
            }
            return (
              <span className="line-point-wrap" key={times[index]} style={{ left: `${index * 20}%`, bottom: `${bottom}%` }}>
                {index < values.length - 1 && <i className={`metric-connector ${trend} ${lineDirection}`} style={{ "--line-rise": `${lineSize}cqh`, "--line-bottom": lineDirection === "falling" ? `-${lineSize}cqh` : "0cqh" } as CSSProperties} />}
                <button className={`metric-point ${isCompensation ? "comp-point" : ""}`} onClick={() => onOpenMedia(times[index])} aria-label={`${times[index]}: ${value} ${definition.valueLabel}${isCompensation ? ", compensatie zichtbaar" : ""}. Open beelden.`}><span>{value}{definition.unit}</span></button>
              </span>
            );
          })}
          {definition.chart === "line" && <div className="metric-line-ticks" aria-hidden="true">{times.map((time) => <span key={time}>{time}</span>)}</div>}
        </div>
        <div className="metric-x-axis-title">Tijd in sessie · {times[0]} tot {times[times.length - 1]}</div>
      </div>
    </section>
  );
}

function MediaTriptych({ session, moment, onClose }: { session: Session; moment: string; onClose: () => void }) {
  return (
    <div className="modal-backdrop media-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="media-modal" role="dialog" aria-modal="true" aria-labelledby="media-title">
        <div className="modal-header">
          <div><h2 id="media-title">Beweging vanuit drie bronnen</h2><span className="heading-context">Sessie {session.id} · {moment}</span></div>
          <button onClick={onClose} aria-label="Sluit beelden"><X width={16} height={16} strokeWidth={2} aria-hidden="true" /> Sluiten</button>
        </div>
        <div className="media-triptych">
          <section className="media-panel video-panel">
            <div className="media-panel-heading"><span>1</span><div><strong>Video</strong><small>Camerabeeld therapeut</small></div></div>
            <div className="video-visual">
              <div className="video-room-line" />
              <div className="stick-figure video-stick" aria-label="Stickfigure van de armbeweging in het videobeeld">
                <i className="stick-head" /><i className="stick-torso" /><i className="stick-hips" />
                <i className="stick-left-upper-arm" /><i className="stick-left-forearm" />
                <i className="stick-right-upper-arm" /><i className="stick-right-forearm" />
                <i className="stick-left-leg" /><i className="stick-right-leg" />
              </div>
              <span className="media-timecode">{moment}</span>
              {session.compensation && <span className="compensation-callout">Rompcompensatie</span>}
            </div>
          </section>
          <section className="media-panel model-panel">
            <div className="media-panel-heading"><span>2</span><div><strong>Model</strong><small>Gemeten armbeweging</small></div></div>
            <div className="model-visual">
              <div className="demo-grid-lines" />
              <div className="stick-figure model-stick" aria-label="Driedimensionaal stickfigure van de armbeweging">
                <i className="stick-head" /><i className="stick-torso" /><i className="stick-hips" />
                <i className="stick-left-upper-arm" /><i className="stick-left-forearm" />
                <i className="stick-right-upper-arm" /><i className="stick-right-forearm" />
                <i className="stick-left-leg" /><i className="stick-right-leg" />
              </div>
              <span className="movement-path">{session.maxRom}°</span>
            </div>
          </section>
          <section className="media-panel game-panel">
            <div className="media-panel-heading"><span>3</span><div><strong>Game</strong><small>{session.game}</small></div></div>
            <div className="game-visual">
              <span className="game-score">{session.score}/{session.maximum}</span>
              <i className="balloon one" /><i className="balloon two" /><i className="balloon three" />
              <div className="game-crosshair"><i /><i /></div>
              <span className="game-instruction">Reik naar het volgende doel</span>
            </div>
          </section>
        </div>
        <div className="triptych-controls">
          <button className="play-control" type="button"><Play width={15} height={15} fill="currentColor" strokeWidth={1.8} aria-hidden="true" /> Afspelen</button>
          <span>{moment}</span><div className="timeline"><i style={{ width: "58%" }} /></div><span>{formatDuration(session.durationSeconds)}</span>
          <strong>Compensatie: {session.compensation ? "ja" : "nee"}</strong>
        </div>
        <p className="demo-disclaimer">Demoweergave — video, model en game lopen in het uiteindelijke platform tijdsynchroon.</p>
      </div>
    </div>
  );
}

function SessionDetailRedesigned({
  patient,
  session,
  onBack,
}: {
  patient: Patient;
  session: Session;
  onBack: () => void;
}) {
  const [activeSession, setActiveSession] = useState(session);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("forward");
  const [showMedia, setShowMedia] = useState(false);
  const [mediaMoment, setMediaMoment] = useState("00:00");

  useEffect(() => setActiveSession(session), [session]);

  const daySessions = useMemo(
    () => sessions.filter((item) => item.dateKey === activeSession.dateKey),
    [activeSession.dateKey],
  );
  const dayResults = dailyMetricResults[activeSession.dateKey];
  const dayScore = metricKeys.reduce((sum, key) => sum + dayResults[key].achieved, 0);
  const dayMaximum = metricKeys.reduce((sum, key) => sum + dayResults[key].target, 0);
  const dayPercentage = Math.round((dayScore / dayMaximum) * 100);

  const openMedia = (moment = "00:00") => {
    setMediaMoment(moment);
    setShowMedia(true);
  };

  return (
    <main className="main session-page redesigned-session-page">
      <header className="detail-header session-header">
        <button className="back-button" onClick={onBack}><ArrowLeft width={18} height={18} strokeWidth={2} aria-hidden="true" /> Terug naar {patient.name}</button>
        <div className="session-title-row">
          <div className="patient-title"><span className="avatar large">{patient.initials}</span><div><h1>{activeSession.game}</h1><span className="heading-context">Sessie {activeSession.id} · vandaag</span></div></div>
          <div className="session-date"><CalendarDays width={17} height={17} strokeWidth={1.8} aria-hidden="true" /><strong>{activeSession.date}</strong></div>
        </div>
      </header>

      <section className="session-summary-grid four-columns" aria-label="Samenvatting van de geselecteerde sessie en dag">
        <SessionSummaryCard icon={<CircleCheck width={20} height={20} strokeWidth={2} aria-hidden="true" />} tone="green" label="Behaald" value={`${activeSession.score} van ${activeSession.maximum}`} detail={`in ${formatDuration(activeSession.durationSeconds)}`} more="Het aantal geslaagde doelen binnen deze geselecteerde activiteit, afgezet tegen het aantal geplande doelen." />
        <SessionSummaryCard icon={<Body width={22} height={22} aria-hidden="true" />} tone={activeSession.compensation ? "red" : "green"} label="Compensatie" value={activeSession.compensation ? "Ja" : "Nee"} detail={activeSession.compensation ? "2 momenten gemarkeerd" : "Niet waargenomen"} more="Compensatie is ja of nee. De tijdstippen zijn verderop gekoppeld aan het video- en modelbeeld." />
        <SessionSummaryCard icon={<Arm width={22} height={22} aria-hidden="true" />} tone="blue" label="Beweging & bereik" value={`${activeSession.minRom}° – ${activeSession.maxRom}°`} detail={activeSession.romJoint} more={`${activeSession.movement}. Dit bereik hoort specifiek bij ${activeSession.romJoint.toLowerCase()}.`} />
        <SessionSummaryCard icon={<ChartLine width={22} height={22} aria-hidden="true" />} tone="purple" label="Percentage getraind" value={`${dayPercentage}%`} detail={`${dayScore} van ${dayMaximum} doelen vandaag`} more={`Dit percentage telt de vier bewegingsdoelen op over ${daySessions.length} sessies: ${dayScore} behaald van ${dayMaximum} gepland.`} />
      </section>

      <div className="session-content-grid redesigned-session-grid">
        <section className="performance-panel day-overview-panel">
          <div className="section-heading day-overview-heading">
            <div><h2>Training van deze dag</h2><span>De vier bewegingsdoelen zijn bij elkaar opgeteld; de grafiek eronder volgt de geselecteerde sessie.</span></div>
            <strong className="score-percent"><span>{dayPercentage}%</span><small>getraind</small></strong>
          </div>
          <div className="training-progress" aria-label={`${dayPercentage} procent getraind; schaal tot 150 procent`}>
            <i style={{ width: `${Math.min(100, (dayPercentage / 150) * 100)}%` }}><span>{dayPercentage}%</span></i>
            <span className="target-marker" style={{ left: `${(100 / 150) * 100}%` }}><b>Doel 100%</b></span>
          </div>
          <div className="progress-scale"><span className="scale-zero">0%</span><span className="scale-goal">100%</span><span className="scale-max">150%</span></div>

          <div className="movement-results metric-buttons" role="group" aria-label="Kies een trainingsdoel voor detaildata">
            {metricKeys.map((key) => {
              const item = metricDefinitions[key];
              const result = dayResults[key];
              const percentage = Math.round((result.achieved / result.target) * 100);
              return (
                <button key={key} className={activeMetric === key ? "active" : ""} onClick={() => setActiveMetric(key)} aria-pressed={activeMetric === key}>
                  <span><i className={`metric-button-icon ${key === "forward" ? "purple" : key === "shoulder" ? "blue" : key === "return" ? "amber" : "green"}`}><MetricIcon metric={key} /></i>{item.label}</span>
                  <strong>{result.achieved}/{result.target}<small>{percentage}%</small></strong>
                  <b>Bekijk grafiek <ArrowRight width={12} height={12} strokeWidth={2} aria-hidden="true" /></b>
                </button>
              );
            })}
          </div>

          <MetricDetailChart metric={activeMetric} session={activeSession} onOpenMedia={openMedia} />
        </section>

        <aside className="session-side-panel redesigned-side-panel">
          <section className="wellbeing-card">
            <div className="section-heading"><div><h2>Na de sessie</h2><span>Niet ingevulde waarden blijven bewust grijs.</span></div></div>
            <Scale label="Pijn" value={activeSession.pain} type="pain" />
            <Scale label="Energie" value={activeSession.energy} type="energy" />
            <Scale label="Frustratie" value={activeSession.frustration} type="frustration" />
          </section>

          <section className="day-sessions-card">
            <div className="section-heading"><div><h2>Sessies van vandaag</h2><span>Kies een sessie; details en grafieken veranderen mee.</span></div></div>
            <div className="day-session-list">
              {daySessions.map((item) => (
                <button key={item.id} className={activeSession.id === item.id ? "active" : ""} onClick={() => setActiveSession(item)}>
                  <span className="session-game-icon" aria-hidden="true"><GameIcon game={item.game} size={17} /></span>
                  <span><strong>{item.startTime} · {item.game}</strong><small>{item.score}/{item.maximum} in {formatDuration(item.durationSeconds)}</small></span>
                  <span className={item.compensation ? "compensation-pill yes" : "compensation-pill no"}>{item.compensation ? "Comp. ja" : "Comp. nee"}</span>
                </button>
              ))}
            </div>
          </section>

        </aside>
      </div>

      {showMedia && <MediaTriptych session={activeSession} moment={mediaMoment} onClose={() => setShowMedia(false)} />}
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
      {view === "session" && <SessionDetailRedesigned patient={selectedPatient} session={selectedSession} onBack={() => setView("patient")} />}
    </div>
  );
}
