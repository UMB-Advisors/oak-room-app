"use client";

import React, { useState, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  UserPlus,
  CreditCard,
  BookOpen,
  Check,
  X,
  Plus,
  Bell,
  MapPin,
  Clock,
  Send,
  Wine,
  Users,
  Sparkles,
  Wallet,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────────
// THE OAK ROOM HOUSTON — at The Post Oak Hotel, a Fertitta property
// Graphite + Carrara marble • antique-brass accents
// ───────────────────────────────────────────────────────────────────

const BRASS = "#B8945A";        // antique brass — single accent, echoes the brushed-steel pass
const BRASS_DEEP = "#8E6E3F";   // deeper brass for gradients, hover, pressed states
const GRAPHITE = "#1C1D20";      // primary surface
const GRAPHITE_2 = "#26282C";    // raised surface
const CHARCOAL = "#0F1012";      // deepest
const MARBLE = "#F4F1EA";        // off-white, warm
const MARBLE_2 = "#E8E3D8";      // veined shadow
const VEIN = "#9AA3AE";          // cool grey vein — borders, dividers, SVG strokes
const VEIN_TEXT = "#B8C2CC";     // brighter vein — text-only, ≈5.2:1 on GRAPHITE for WCAG AA
const TEXT_DIM = "#A4A8AE";      // bumped from #8B8E94 for AA contrast

// Wallet pass — matches the physical Oak Room metal card: brushed warm
// silver, dark engraved oak, framed "OAK ROOM PRIVATE" wordmark. Different
// from the in-app brass accent so the wallet card reads as a separate
// (collectible) object.
const STEEL_HI = "#D8D2C4";      // warm silver highlight
const STEEL_MID = "#B0A89C";     // brushed mid-tone
const STEEL_LO = "#8C8478";      // shadow / engraved depth
const ENGRAVED = "#1F1D1A";      // tree silhouette + wordmark — near-black warm
const CLUB_GREEN = "#4F8C5E";    // confirmed guest — muted, not stoplight-green
const CLUB_AMBER = "#B8533F";    // pending GM approval — warm, not alarm-red

const fontStack = {
  display: "'Canela', 'GT Super Display', 'Cormorant Garamond', Georgia, serif",
  body: "'Söhne', 'Inter Tight', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── Mock data ─────────────────────────────────────────────────────
const MEMBER = {
  name: "Taylor Fertitta",
  memberNo: "№ 0024",
  tier: "Founders",
  joined: "MMXXIII",
  cardCode: "OR-0024-FNDR",
};

const EVENTS = [
  {
    id: 1,
    title: "Tres Colline Wine Night",
    date: "THU · APR 30",
    time: "6 PM",
    host: "Tres Colline Vineyards",
    spots: "Complimentary",
    note: "Elegant selections from Oregon's Willamette Valley.",
    teaser: "Willamette Valley · complimentary",
    image: "/events/tres-colline.jpg",
    rsvp: false,
  },
  {
    id: 2,
    title: "Annual Derby Watch Party",
    date: "SAT · MAY 2",
    time: "4 PM",
    host: "Bouchée Patisserie patio",
    spots: "Hat contest · live viewing",
    note: "Woodford Reserve cocktails. Wear the hat.",
    teaser: "Woodford cocktails · hat contest",
    image: "/events/derby.jpg",
    rsvp: true,
  },
  {
    id: 3,
    title: "Mother's Day at Bloom & Bee",
    date: "SUN · MAY 10",
    time: "11 AM",
    host: "Bloom & Bee",
    spots: "Interactive brunch",
    note: "Bouquet station, signature cocktails, scent bar by Maison Francis Kurkdjian.",
    teaser: "Brunch · bouquet & scent bar",
    image: "/events/mothers-day.jpg",
    rsvp: false,
  },
  {
    id: 4,
    title: "Poolside with Christy Lynn",
    date: "THU · MAY 14",
    time: "6 PM",
    host: "29° North Boutique",
    spots: "RSVP required",
    note: "First look at the new capsule, poolside.",
    teaser: "Capsule preview · poolside",
    image: "/events/poolside.jpg",
    rsvp: false,
  },
  {
    id: 5,
    title: "Crown Royal Tasting",
    date: "WED · MAY 21",
    time: "4 PM",
    host: "The Post Oak Saloon",
    spots: "Complimentary",
    note: "Signature smoothness across the Crown Royal lineup.",
    teaser: "Saloon · complimentary",
    image: "/events/crown-royal.jpg",
    rsvp: false,
  },
  {
    id: 6,
    title: "A Night with Whistlepig",
    date: "FRI · MAY 30",
    time: "5 PM",
    host: "The Post Oak Saloon",
    spots: "Exclusive tasting",
    note: "Bold craftsmanship across the Whistlepig signature ryes.",
    teaser: "Rye flight · Saloon",
    image: "/events/whistlepig.jpg",
    rsvp: false,
  },
];

const INITIAL_GUESTS = [
  { id: 1, name: "Julia Powers", phone: "+1 (360) ••• 4421", arriving: "Sat, May 3 · 11pm", status: "Notified", checked: false },
  { id: 2, name: "Eric A. Glassman", phone: "+1 (212) ••• 0917", arriving: "Sat, May 3 · 11pm", status: "Confirmed", checked: false },
];

const HOUSE_RULES = [
  { n: "I.", rule: "Discretion above all. No photographs past the foyer." },
  { n: "II.", rule: "Dress with intention." },
  { n: "III.", rule: "Phones silenced. Calls taken in the antechamber only." },
  { n: "IV.", rule: "Members are responsible for their guests, in conduct and in tab." },
  { n: "V.", rule: "What is said at the bar stays at the bar." },
];

const RESERVATIONS_AVAIL = [
  { room: "The Post Oak Saloon", desc: "Whiskey bar, seats 6", times: ["7:00", "9:30"] },
  { room: "Bloom & Bee", desc: "Garden room, seats 4", times: ["6:00", "8:00", "9:30"] },
  { room: "Mastro's · House Table", desc: "Private dining, seats 10", times: ["7:30"] },
];

// ─── Helpers ───────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-5">
    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${VEIN}55, transparent)` }} />
    {label && (
      <span
        className="text-[10px] tracking-[0.4em] uppercase"
        style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
      >
        {label}
      </span>
    )}
    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${VEIN}55, transparent)` }} />
  </div>
);

const BrassButton = ({ children, onClick, variant = "solid", className = "" }) => {
  const base = "px-4 py-2.5 text-[11px] tracking-[0.3em] uppercase transition-all duration-300";
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={`${base} ${className}`}
        style={{
          color: BRASS,
          border: `1px solid ${VEIN}`,
          fontFamily: fontStack.body,
          background: "transparent",
        }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} ${className}`}
      style={{
        color: GRAPHITE,
        background: `linear-gradient(180deg, ${BRASS} 0%, ${VEIN} 100%)`,
        fontFamily: fontStack.body,
        boxShadow: `0 1px 0 ${BRASS}88 inset, 0 8px 24px -12px ${BRASS}55`,
      }}
    >
      {children}
    </button>
  );
};

// ─── Screens ───────────────────────────────────────────────────────

const ForYouScreen = ({ events, onRSVP, onConcierge, onQuickBook }) => {
  const firstName = MEMBER.name.split(" ")[0];

  // Hand-curated picks with rationale — feels staff-selected, not algorithmic
  const PICKS = [
    { id: 1, why: "A favorite vintage. A half-bottle is set aside." },
    { id: 5, why: "Last year's Crown Royal flight stayed with you." },
  ];
  const curated = PICKS
    .map((p) => ({ ...events.find((e) => e.id === p.id), why: p.why }))
    .filter((e) => e.id);

  const [note, setNote] = useState("");
  const submitNote = () => {
    if (!note.trim()) return;
    onConcierge(note);
    setNote("");
  };

  const chips = ["Reserve the Saloon", "Add a guest tonight", "Recommend a wine"];

  return (
    <div className="px-5 pt-3 pb-32">
      <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
        For you
      </p>
      <h1
        className="text-4xl mt-2 leading-none"
        style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400, letterSpacing: "-0.01em" }}
      >
        A quiet <em style={{ color: BRASS }}>welcome</em>
      </h1>

      {/* Note from the club */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mt-5 p-5 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${GRAPHITE_2} 0%, ${GRAPHITE} 100%)`,
          border: `1px solid ${BRASS}55`,
        }}
      >
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l" style={{ borderColor: BRASS }} />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r" style={{ borderColor: BRASS }} />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l" style={{ borderColor: BRASS }} />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r" style={{ borderColor: BRASS }} />

        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: BRASS, fontFamily: fontStack.body, fontWeight: 500 }}>
          A note from the club
        </p>
        <p
          className="mt-3 text-base italic leading-relaxed"
          style={{ color: MARBLE + "EE", fontFamily: fontStack.display }}
        >
          {firstName} — we saw your request and have your favorite tequila in. Fortaleza Reposado, waiting for you.
        </p>
        <p className="mt-4 text-right text-[10px] tracking-[0.3em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
          — The Oak Room
        </p>
      </motion.div>

      <Divider label="Curated for you" />

      <div className="space-y-2.5">
        {curated.map((e, i) => (
          <motion.button
            key={e.id}
            onClick={() => onRSVP(e.id)}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            whileTap={{ scale: 0.99 }}
            className="relative w-full text-left p-4 overflow-hidden"
            style={{
              background: GRAPHITE_2,
              border: `1px solid ${VEIN}33`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              {e.image && (
                <div
                  className="flex-shrink-0 overflow-hidden"
                  style={{ width: 72, height: 72, border: `1px solid ${BRASS}55` }}
                >
                  <img
                    src={e.image}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.3em]" style={{ color: BRASS, fontFamily: fontStack.body, fontWeight: 500 }}>
                  {e.date} · {e.time}
                </p>
                <h3
                  className="text-lg leading-tight mt-1"
                  style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
                >
                  {e.title}
                </h3>
                <p
                  className="text-[11px] italic leading-snug mt-1.5"
                  style={{ color: MARBLE + "AA", fontFamily: fontStack.display }}
                >
                  {e.why}
                </p>
              </div>
              <span
                className="text-[9px] tracking-[0.3em] uppercase px-2 py-1 flex-shrink-0 flex items-center gap-1"
                style={{
                  color: e.rsvp ? BRASS : MARBLE + "AA",
                  border: `1px solid ${e.rsvp ? BRASS : VEIN}`,
                  fontFamily: fontStack.body,
                }}
              >
                {e.rsvp && <Check size={10} />}
                {e.rsvp ? "Held" : "Reserve"}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <Divider label="Your usual" />

      <div className="space-y-3">
        {[
          { label: "The pattern", detail: "Bar Top · Friday · 7 PM", party: "You +3" },
          { label: "The pattern", detail: "Window View · Thursday · 8:30 PM", party: "You +1" },
        ].map((item, i) => (
          <motion.button
            key={i}
            onClick={onQuickBook}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.99 }}
            className="w-full text-left p-4 flex items-center justify-between"
            style={{
              background: `linear-gradient(160deg, ${GRAPHITE_2} 0%, ${GRAPHITE} 100%)`,
              border: `1px solid ${VEIN}33`,
            }}
          >
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                {item.label}
              </p>
              <p className="text-base mt-1" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
                {item.detail}
              </p>
              <p className="text-lg mt-1" style={{ fontFamily: fontStack.display, color: BRASS, fontWeight: 400, fontStyle: "italic" }}>
                {item.party}
              </p>
            </div>
            <span
              className="text-[9px] tracking-[0.3em] uppercase px-2 py-1"
              style={{ color: BRASS, border: `1px solid ${BRASS}`, fontFamily: fontStack.body }}
            >
              Hold it
            </span>
          </motion.button>
        ))}
      </div>

      <Divider label="Concierge" />

      <div
        className="p-4"
        style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}33` }}
      >
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitNote()}
          placeholder="What can we arrange?"
          className="w-full bg-transparent border-b py-2 outline-none"
          style={{
            borderColor: VEIN,
            color: MARBLE,
            fontFamily: fontStack.display,
            fontSize: 16,
          }}
        />

        <div className="flex flex-wrap gap-2 mt-4">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => onConcierge(c)}
              className="text-[10px] tracking-[0.25em] uppercase px-3 py-1.5"
              style={{
                color: MARBLE + "BB",
                border: `1px solid ${VEIN}55`,
                fontFamily: fontStack.body,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={submitNote}
          disabled={!note.trim()}
          className="w-full mt-4 py-3 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
          style={{
            color: note.trim() ? MARBLE : MARBLE + "55",
            background: note.trim() ? BRASS : "transparent",
            border: `1px solid ${note.trim() ? BRASS : VEIN + "55"}`,
            fontFamily: fontStack.body,
            transition: "all 0.2s",
          }}
        >
          <Send size={12} /> Send note
        </button>
      </div>
    </div>
  );
};

const HomeScreen = ({ events, onRSVP }) => {
  const [expandedId, setExpandedId] = useState(null);
  const expanded = events.find((e) => e.id === expandedId);

  return (
    <div className="px-5 pt-3 pb-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[9px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
            Upcoming
          </p>
          <h1
            className="text-3xl leading-none mt-1"
            style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            The book of <em style={{ color: BRASS }}>hours</em>
          </h1>
        </div>
        <span className="text-[9px] tracking-[0.3em] uppercase pb-1" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
          {events.length} ahead
        </span>
      </div>

      {/* 2-column grid that flows down */}
      <div className="grid grid-cols-2 gap-2">
        {events.map((e, i) => (
          <motion.button
            key={e.id}
            onClick={() => setExpandedId(e.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * Math.min(i, 5), duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            className="relative text-left overflow-hidden aspect-square"
            style={{
              background: GRAPHITE,
              border: `1px solid ${VEIN}33`,
            }}
          >
            {/* Event photo as backdrop, dimmed for legibility */}
            {e.image && (
              <img
                src={e.image}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.45 }}
              />
            )}
            {/* Graphite gradient over the image so text reads cleanly */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${GRAPHITE}AA 0%, ${GRAPHITE}66 50%, ${GRAPHITE}EE 100%)`,
              }}
            />

            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l z-10" style={{ borderColor: BRASS }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r z-10" style={{ borderColor: BRASS }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l z-10" style={{ borderColor: BRASS }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r z-10" style={{ borderColor: BRASS }} />

            {e.rsvp && (
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full z-10"
                style={{ background: BRASS, boxShadow: `0 0 8px ${BRASS}` }}
              />
            )}

            <div className="relative z-10 p-3 h-full flex flex-col justify-between">
              <div>
                <p
                  className="text-[10px] tracking-[0.3em]"
                  style={{ color: BRASS, fontFamily: fontStack.body, fontWeight: 500 }}
                >
                  {e.date}
                </p>
                <p className="text-[10px] tracking-[0.3em] mt-0.5" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                  {e.time}
                </p>
              </div>

              <h3
                className="text-base leading-tight"
                style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
              >
                {e.title}
              </h3>

              <p
                className="text-[10px] italic leading-snug"
                style={{ color: MARBLE + "88", fontFamily: fontStack.display }}
              >
                {e.teaser}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Expanded overlay — fixed to viewport so it stays put while page can't scroll behind */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(ev) => ev.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden flex flex-col"
              style={{
                background: `linear-gradient(160deg, ${GRAPHITE_2} 0%, ${GRAPHITE} 100%)`,
                border: `1px solid ${BRASS}`,
                boxShadow: `0 20px 60px -10px rgba(0,0,0,0.8)`,
              }}
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: BRASS }} />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: BRASS }} />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: BRASS }} />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: BRASS }} />

              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center z-10"
                style={{ color: VEIN_TEXT, border: `1px solid ${VEIN}55` }}
              >
                <X size={12} />
              </button>

              {expanded.image && (
                <div className="relative w-full" style={{ height: 160 }}>
                  <img
                    src={expanded.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 60%, ${GRAPHITE_2} 100%)`,
                    }}
                  />
                </div>
              )}

              <div className="p-5">
                <p
                  className="text-[10px] tracking-[0.4em]"
                  style={{ color: BRASS, fontFamily: fontStack.body, fontWeight: 500 }}
                >
                  {expanded.date} · {expanded.time}
                </p>
                <h2
                  className="text-2xl mt-2 leading-tight"
                  style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
                >
                  {expanded.title}
                </h2>

                <div className="my-4 h-px" style={{ background: `linear-gradient(to right, ${BRASS}, transparent)` }} />

                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: MARBLE + "DD", fontFamily: fontStack.display }}
                >
                  "{expanded.note}"
                </p>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: fontStack.body }}>
                    <span style={{ color: VEIN_TEXT }}>Host</span>
                    <span style={{ color: MARBLE + "CC" }}>{expanded.host}</span>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: fontStack.body }}>
                    <span style={{ color: VEIN_TEXT }}>Details</span>
                    <span style={{ color: MARBLE + "CC" }}>{expanded.spots}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRSVP(expanded.id);
                    setExpandedId(null);
                  }}
                  className="w-full py-3 mt-5 text-[10px] tracking-[0.3em] uppercase"
                  style={{
                    color: expanded.rsvp ? BRASS : MARBLE,
                    background: expanded.rsvp ? "transparent" : BRASS,
                    border: `1px solid ${BRASS}`,
                    fontFamily: fontStack.body,
                  }}
                >
                  {expanded.rsvp ? "Release reservation" : "Reserve a spot"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GuestsScreen = ({ guests, onAdd }) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name || !phone) return;
    onAdd(name, phone);
    setName("");
    setPhone("");
    setAdding(false);
  };

  return (
    <div className="px-6 pt-3 pb-32">
      <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
        Front desk register
      </p>
      <h1
        className="text-4xl mt-2 leading-none"
        style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
      >
        Your <em style={{ color: BRASS }}>guests</em>
      </h1>
      <p className="text-xs mt-3 leading-relaxed" style={{ color: MARBLE + "88", fontFamily: fontStack.body }}>
        Added guests receive a text with their name on the list and the address. The front desk sees this register the moment you send it.
      </p>

      <Divider label="On the list" />

      <div className="space-y-3">
        {guests.map((g) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 flex items-center justify-between"
            style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}33` }}
          >
            <div>
              <p
                className="text-lg leading-tight"
                style={{ fontFamily: fontStack.display, color: MARBLE }}
              >
                {g.name}
              </p>
              <p className="text-[10px] tracking-[0.2em] mt-1" style={{ color: VEIN_TEXT, fontFamily: fontStack.mono }}>
                {g.phone}
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase mt-1.5" style={{ color: MARBLE + "66", fontFamily: fontStack.body }}>
                {g.arriving}
              </p>
            </div>
            <span
              className="text-[9px] tracking-[0.3em] uppercase px-2 py-1 flex items-center gap-1"
              style={{
                color: g.status === "Confirmed" ? BRASS : MARBLE + "AA",
                border: `1px solid ${g.status === "Confirmed" ? BRASS : VEIN}`,
                fontFamily: fontStack.body,
              }}
            >
              {g.status === "Confirmed" && <Check size={10} />}
              {g.status === "Notified" && <Send size={10} />}
              {g.status}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 p-5 overflow-hidden"
            style={{ background: GRAPHITE_2, border: `1px solid ${BRASS}` }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: BRASS, fontFamily: fontStack.body }}>
              New guest
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-transparent border-b py-2 text-lg outline-none mb-4"
              style={{
                borderColor: VEIN,
                color: MARBLE,
                fontFamily: fontStack.display,
              }}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile · for the SMS pass"
              className="w-full bg-transparent border-b py-2 outline-none mb-5"
              style={{
                borderColor: VEIN,
                color: MARBLE,
                fontFamily: fontStack.mono,
                fontSize: 14,
              }}
            />
            <div className="flex gap-2">
              <BrassButton onClick={submit}>Send pass</BrassButton>
              <BrassButton variant="ghost" onClick={() => setAdding(false)}>Cancel</BrassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="mt-5 w-full py-4 flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] uppercase"
          style={{
            color: BRASS,
            border: `1px dashed ${VEIN}`,
            fontFamily: fontStack.body,
          }}
        >
          <Plus size={14} /> Add a guest
        </button>
      )}
    </div>
  );
};

// Hand-crafted QR-like SVG. Has the three real corner finder patterns so it
// reads as "QR code" at a glance; remaining modules are deterministic noise.
// Not a scannable QR — the real .pkpass (Workstream G) has the working code.
const QrPlaceholder = ({ size = 84 }) => {
  const cells = 21;
  const cell = size / cells;
  const inFinder = (r, c, rOff, cOff) => r >= rOff && r < rOff + 7 && c >= cOff && c < cOff + 7;
  const isFinderCell = (r, c) =>
    inFinder(r, c, 0, 0) || inFinder(r, c, 0, cells - 7) || inFinder(r, c, cells - 7, 0);
  const finderModule = (r, c) => {
    let lr, lc;
    if (r < 7 && c < 7) { lr = r; lc = c; }
    else if (r < 7) { lr = r; lc = c - (cells - 7); }
    else { lr = r - (cells - 7); lc = c; }
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };
  const rects = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      let on = false;
      if (isFinderCell(r, c)) on = finderModule(r, c);
      else on = (r * 31 + c * 17 + 7) % 100 < 46;
      if (on) rects.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1a1a1a" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {rects}
    </svg>
  );
};

// Apple Wallet pass face — rendered inline on the Member tab. Visual mockup
// of what the real signed .pkpass (Workstream G) looks like once added to
// Apple Wallet. Colors match scripts/pass-template/pass.json so the in-app
// preview matches what shows up in Wallet after "Add to Apple Wallet."
const WalletPassFace = () => (
  <div
    className="relative overflow-hidden mx-auto"
    style={{
      aspectRatio: "5 / 8",
      maxWidth: 260,
      background: `linear-gradient(160deg, ${STEEL_HI} 0%, ${STEEL_MID} 25%, ${STEEL_HI} 45%, ${STEEL_LO} 65%, ${STEEL_MID} 80%, ${STEEL_HI} 100%)`,
      borderRadius: 18,
      color: ENGRAVED,
      boxShadow: `
        0 30px 60px -30px rgba(0,0,0,0.7),
        0 0 0 1px rgba(0,0,0,0.18),
        inset 0 1px 0 rgba(255,255,255,0.45)
      `,
    }}
  >
    {/* Brushed-metal hairline texture */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 200 320" aria-hidden="true">
      {Array.from({ length: 110 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1={i * 3}
          x2="200"
          y2={i * 3}
          stroke="white"
          strokeWidth={i % 7 === 0 ? "0.6" : "0.2"}
          opacity={i % 7 === 0 ? "0.22" : "0.08"}
        />
      ))}
    </svg>

    {/* Oak canopy — the real silhouette extracted from The Post Oak Hotel
        logo. Anchored across the upper portion so the framed wordmark sits
        within the canopy (matches the physical card composition). */}
    <img
      src="/oak-canopy.png"
      alt=""
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{ top: "10%", left: "3%", width: "94%", opacity: 0.6 }}
    />

    {/* NFC waves — top right */}
    <svg
      className="absolute top-4 right-4 pointer-events-none"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ color: ENGRAVED, opacity: 0.6 }}
      aria-hidden="true"
    >
      <path d="M6 6 Q 13 12 6 18" />
      <path d="M10 6 Q 17 12 10 18" />
      <path d="M14 6 Q 21 12 14 18" />
    </svg>

    {/* Framed wordmark — sits over the canopy, matches the physical card */}
    <div
      className="absolute"
      style={{
        top: "22%",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 18px",
        border: `1px solid rgba(31,29,26,0.7)`,
        textAlign: "center",
        minWidth: 130,
      }}
    >
      <p
        style={{
          fontFamily: fontStack.display,
          fontStyle: "italic",
          fontSize: 12,
          color: ENGRAVED,
          lineHeight: 1.1,
          marginBottom: 1,
        }}
      >
        The
      </p>
      <p
        style={{
          fontFamily: fontStack.display,
          fontSize: 19,
          color: ENGRAVED,
          letterSpacing: "0.05em",
          lineHeight: 1.05,
          fontWeight: 400,
        }}
      >
        OAK ROOM
      </p>
      <p
        style={{
          fontFamily: fontStack.body,
          fontSize: 7.5,
          color: ENGRAVED,
          letterSpacing: "0.45em",
          marginTop: 4,
        }}
      >
        PRIVATE
      </p>
    </div>

    {/* Member fields — anchored just above the barcode strip */}
    <div className="absolute left-0 right-0 px-4" style={{ bottom: "32%" }}>
      <p
        className="text-[8px] tracking-[0.4em] uppercase text-center"
        style={{ fontFamily: fontStack.body, color: ENGRAVED, opacity: 0.65, fontWeight: 500 }}
      >
        Member
      </p>
      <p
        className="mt-1 text-center leading-tight"
        style={{
          fontFamily: fontStack.display,
          fontSize: 18,
          color: ENGRAVED,
          letterSpacing: "0.02em",
          fontWeight: 400,
        }}
      >
        {MEMBER.name}
      </p>
      <div className="flex justify-center gap-6 mt-2.5">
        <p
          style={{
            fontFamily: fontStack.body,
            fontSize: 8,
            letterSpacing: "0.3em",
            color: ENGRAVED,
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          {MEMBER.tier}
        </p>
        <p
          style={{
            fontFamily: fontStack.mono,
            fontSize: 8,
            letterSpacing: "0.2em",
            color: ENGRAVED,
            opacity: 0.7,
          }}
        >
          {MEMBER.memberNo}
        </p>
      </div>
    </div>

    {/* Barcode strip — white, like Apple Wallet */}
    <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-3 text-center" style={{ background: "#FFFFFF" }}>
      <div className="flex justify-center">
        <QrPlaceholder size={84} />
      </div>
      <p className="mt-1.5" style={{ fontFamily: fontStack.mono, fontSize: 9, letterSpacing: "0.18em", color: "#666" }}>
        {MEMBER.cardCode}
      </p>
    </div>
  </div>
);

// Smoothly tween a number to a target. Returns the current display value.
const useCountTo = (target, durationMs = 1100) => {
  const [value, setValue] = useState(target);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const from = value;
    const delta = target - from;
    if (delta === 0) return;
    // ease-out-quart — fast start, silky deceleration
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(from + delta * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);
  return value;
};

const LedgerCard = () => {
  const STARTING_BALANCE = 1284.5;
  const [target, setTarget] = useState(STARTING_BALANCE);
  const [settling, setSettling] = useState(false);
  const [settled, setSettled] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [billEmail, setBillEmail] = useState("");
  const [billSent, setBillSent] = useState(false);
  const live = useCountTo(target, 1100);

  const handleBillSend = () => {
    if (!billEmail.trim()) return;
    setBillSent(true);
  };

  const handleSettle = () => {
    if (settling || settled) return;
    setSettling(true);
    setTarget(0);
    // After the count-to-zero finishes, swap to the settled face.
    setTimeout(() => {
      setSettling(false);
      setSettled(true);
    }, 1150);
  };

  const dollars = Math.floor(Math.max(0, live));
  const cents = Math.round((Math.max(0, live) - dollars) * 100)
    .toString()
    .padStart(2, "0");
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      className="relative overflow-hidden p-5 text-center"
      style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}55` }}
      animate={{
        borderColor: settled ? BRASS + "AA" : VEIN + "55",
      }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Cobalt sweep — runs once during the settle, low opacity, no flash */}
      <AnimatePresence>
        {settling && (
          <motion.div
            initial={{ x: "-110%", opacity: 0 }}
            animate={{ x: "110%", opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-y-0 pointer-events-none"
            style={{
              width: "60%",
              background: `linear-gradient(90deg, transparent 0%, ${BRASS}55 50%, transparent 100%)`,
              filter: "blur(14px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Quiet pulse ring at the moment of full settle */}
      <AnimatePresence>
        {settled && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0.4 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `1px solid ${BRASS}88`,
              borderRadius: 2,
            }}
          />
        )}
      </AnimatePresence>

      <p
        className="text-[10px] tracking-[0.4em] uppercase relative"
        style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
      >
        {settled ? `Settled · ${today}` : "Current balance"}
      </p>

      <div className="relative mt-2 h-[58px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!settled ? (
            <motion.p
              key="amount"
              initial={false}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.35 } }}
              className="text-5xl"
              style={{
                fontFamily: fontStack.display,
                color: MARBLE,
                fontWeight: 400,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${dollars.toLocaleString()}
              <span style={{ color: VEIN_TEXT, fontSize: 28 }}>.{cents}</span>
            </motion.p>
          ) : (
            <motion.div
              key="settled"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
              className="flex items-center gap-3"
            >
              <motion.span
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.18 }}
                className="inline-flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  border: `1px solid ${BRASS}`,
                  color: BRASS,
                }}
              >
                <Check size={14} strokeWidth={2.2} />
              </motion.span>
              <span
                className="text-3xl"
                style={{
                  fontFamily: fontStack.display,
                  color: MARBLE,
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                Paid in full
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        <AnimatePresence mode="wait">
          {!settled ? (
            <motion.div
              key="actions"
              initial={false}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="flex gap-2"
            >
              <BrassButton onClick={handleSettle}>
                {settling ? "Settling…" : "Settle now"}
              </BrassButton>
              <BrassButton variant="ghost">Auto-pay</BrassButton>
            </motion.div>
          ) : (
            <motion.p
              key="receipt"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[9px] tracking-[0.45em] uppercase"
              style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
            >
              Statement on file · receipt sent
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bill request — inline, bottom of card */}
      <div className="relative mt-5 pt-4" style={{ borderTop: `1px solid ${VEIN}22` }}>
        <button
          onClick={() => { setBillOpen((o) => !o); setBillSent(false); }}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Send size={12} style={{ color: billSent ? BRASS : VEIN_TEXT }} />
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: billSent ? BRASS : VEIN_TEXT, fontFamily: fontStack.body }}
            >
              {billSent ? "Statement requested" : "Request for expenses"}
            </span>
          </div>
          {!billSent && (
            <motion.span
              animate={{ rotate: billOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: VEIN_TEXT, display: "inline-block", lineHeight: 1, fontSize: 12 }}
            >
              ▾
            </motion.span>
          )}
        </button>

        <AnimatePresence>
          {billOpen && !billSent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: "hidden" }}
            >
              <div className="pt-3 space-y-2.5">
                <p className="text-[11px] leading-relaxed text-left" style={{ color: TEXT_DIM, fontFamily: fontStack.body }}>
                  We'll email an itemized statement — ready for expense reporting.
                </p>
                <input
                  type="email"
                  value={billEmail}
                  onChange={(e) => setBillEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent px-3 py-2 text-[13px] outline-none"
                  style={{ border: `1px solid ${VEIN}44`, color: MARBLE, fontFamily: fontStack.body }}
                />
                <button
                  onClick={handleBillSend}
                  className="w-full py-2 text-[11px] tracking-[0.3em] uppercase"
                  style={{
                    background: billEmail.trim() ? BRASS : "transparent",
                    color: billEmail.trim() ? "#1a1a1a" : VEIN_TEXT,
                    border: `1px solid ${billEmail.trim() ? BRASS : VEIN + "33"}`,
                    fontFamily: fontStack.body,
                    opacity: billEmail.trim() ? 1 : 0.55,
                  }}
                >
                  Send statement
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const LEDGER_ENTRIES = [
  "May 4, 2026",
  "Apr 28, 2026",
  "Apr 19, 2026",
  "Apr 11, 2026",
  "Mar 29, 2026",
];

const ExpenseLedger = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [emails, setEmails] = useState({});
  const [sent, setSent] = useState({});

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? null : i));

  const handleSend = (i) => {
    if (!emails[i]?.trim()) return;
    setSent((s) => ({ ...s, [i]: true }));
    setOpenIdx(null);
  };

  return (
    <div style={{ border: `1px solid ${VEIN}33` }}>
      {LEDGER_ENTRIES.map((date, i) => (
        <React.Fragment key={i}>
          {/* Two-column row */}
          <div
            className="grid grid-cols-2"
            style={{
              borderBottom: `1px solid ${VEIN}22`,
            }}
          >
            {/* Left — date */}
            <div
              className="px-4 py-3.5 flex flex-col justify-center"
              style={{ borderRight: `1px solid ${VEIN}22` }}
            >
              {i === 0 && (
                <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                  Date
                </p>
              )}
              <p className="text-[13px]" style={{ color: i === 0 ? MARBLE : MARBLE + "BB", fontFamily: fontStack.display, fontWeight: 400 }}>
                {date}
              </p>
            </div>

            {/* Right — request */}
            <button
              onClick={() => !sent[i] && toggle(i)}
              className="px-4 py-3.5 text-left flex flex-col justify-center"
              style={{ background: openIdx === i ? GRAPHITE_2 : "transparent" }}
            >
              {i === 0 && (
                <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                  Expenses
                </p>
              )}
              {sent[i] ? (
                <p className="text-[13px]" style={{ color: BRASS, fontFamily: fontStack.display, fontStyle: "italic" }}>
                  Statement sent
                </p>
              ) : (
                <p className="text-[13px]" style={{ color: i === 0 ? MARBLE : MARBLE + "BB", fontFamily: fontStack.display, fontWeight: 400 }}>
                  Request Itemized <span style={{ color: BRASS }}>→</span>
                </p>
              )}
            </button>
          </div>

          {/* Expandable email form */}
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-4 py-4 space-y-3" style={{ background: GRAPHITE_2, borderBottom: `1px solid ${VEIN}22` }}>
                  <p className="text-[11px] leading-relaxed" style={{ color: TEXT_DIM, fontFamily: fontStack.body }}>
                    We'll email an itemized statement for {date} — ready for expense reporting.
                  </p>
                  <input
                    type="email"
                    value={emails[i] || ""}
                    onChange={(e) => setEmails((prev) => ({ ...prev, [i]: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full bg-transparent px-3 py-2 text-[13px] outline-none"
                    style={{ border: `1px solid ${VEIN}44`, color: MARBLE, fontFamily: fontStack.body }}
                  />
                  <button
                    onClick={() => handleSend(i)}
                    className="w-full py-2 text-[11px] tracking-[0.3em] uppercase"
                    style={{
                      background: emails[i]?.trim() ? BRASS : "transparent",
                      color: emails[i]?.trim() ? "#1a1a1a" : VEIN_TEXT,
                      border: `1px solid ${emails[i]?.trim() ? BRASS : VEIN + "33"}`,
                      fontFamily: fontStack.body,
                      opacity: emails[i]?.trim() ? 1 : 0.55,
                    }}
                  >
                    Send statement
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </React.Fragment>
      ))}
    </div>
  );
};

const MembershipScreen = ({ guests = [] }) => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      Bona fides
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      Your <em style={{ color: BRASS }}>standing</em>
    </h1>

    <Divider label="The card" />

    {/* Card */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative aspect-[1.586/1] overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #d8d8d8 0%, #b4b4b4 20%, #cecece 40%, #a8a8a8 60%, #c4c4c4 80%, #d0d0d0 100%)`,
        boxShadow: `
          0 30px 60px -30px rgba(0,0,0,0.65),
          0 0 0 1px rgba(0,0,0,0.18),
          inset 0 1px 0 rgba(255,255,255,0.45)
        `,
      }}
    >
      {/* Brushed metal texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 252">
        <defs>
          <linearGradient id="brushSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.25"/>
            <stop offset="35%"  stopColor="white" stopOpacity="0.04"/>
            <stop offset="55%"  stopColor="white" stopOpacity="0.14"/>
            <stop offset="75%"  stopColor="black" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.08"/>
          </linearGradient>
        </defs>
        <rect width="400" height="252" fill="url(#brushSheen)"/>
        {Array.from({ length: 84 }).map((_, i) => (
          <line
            key={i}
            x1="0" y1={i * 3} x2="400" y2={i * 3}
            stroke="white"
            strokeWidth={i % 7 === 0 ? "0.8" : "0.3"}
            opacity={i % 7 === 0 ? "0.18" : "0.06"}
          />
        ))}
      </svg>

      {/* Real Post Oak silhouette — canopy + trunk live in the PNG itself,
          so we just composite it once at full card height, anchored bottom. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 252"
        preserveAspectRatio="xMidYMax meet"
      >
        <image
          href="/oak-canopy.png"
          x="0" y="0"
          width="400" height="252"
          preserveAspectRatio="xMidYMax meet"
          opacity="0.55"
        />
      </svg>

      {/* Branding box — centered, matching physical card */}
      <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "10%" }}>
        <div style={{ border: "1px solid rgba(12,12,12,0.55)", padding: "12px 20px", minWidth: 140 }}>
          <p style={{ fontFamily: fontStack.display, fontStyle: "italic", fontSize: 13, color: "#111", lineHeight: 1.3, marginBottom: 1 }}>
            The
          </p>
          <p style={{ fontFamily: fontStack.display, fontSize: 24, fontWeight: 400, color: "#111", letterSpacing: "0.07em", lineHeight: 1.1 }}>
            OAK ROOM
          </p>
          <p style={{ fontFamily: fontStack.body, fontSize: 8.5, letterSpacing: "0.42em", color: "#222", marginTop: 5 }}>
            PRIVATE
          </p>
        </div>
      </div>

      {/* Member details — bottom right, discreet */}
      <div className="absolute bottom-4 right-5 text-right">
        <p style={{ fontFamily: fontStack.body, fontSize: 8, letterSpacing: "0.25em", color: "#1a1a1a", opacity: 0.65, textTransform: "uppercase" }}>
          {MEMBER.name}
        </p>
        <p style={{ fontFamily: fontStack.mono, fontSize: 8, letterSpacing: "0.25em", color: "#1a1a1a", opacity: 0.5, marginTop: 2 }}>
          {MEMBER.cardCode}
        </p>
      </div>
    </motion.div>

    <p className="text-[10px] tracking-[0.3em] uppercase mt-3 text-center" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      Tap the card at reception
    </p>

    <Divider label="Or carry it on your iPhone" />

    <a
      href="/api/wallet-pass"
      className="mt-5 w-full py-3.5 flex items-center justify-center gap-2.5 text-[11px] tracking-[0.3em] uppercase no-underline transition-all"
      style={{
        color: MARBLE,
        background: GRAPHITE_2,
        border: `1px solid ${BRASS}`,
        fontFamily: fontStack.body,
        boxShadow: `0 8px 24px -12px ${BRASS}55, inset 0 1px 0 ${MARBLE}11`,
      }}
    >
      <Wallet size={14} strokeWidth={1.6} />
      Add to Apple Wallet
    </a>

    <Divider label="Your guests this month" />

    {guests.length === 0 ? (
      <p className="text-sm italic" style={{ color: MARBLE + "88", fontFamily: fontStack.display }}>
        No invites yet this month.
      </p>
    ) : (
      <div className="space-y-2.5">
        {guests.slice(0, 3).map((g) => {
          const isConfirmed = g.status === "Confirmed";
          const isPending = g.status === "Pending";
          const accent = isConfirmed ? BRASS : isPending ? "#C04A4A" : VEIN_TEXT;
          return (
            <div
              key={g.id}
              className="flex items-center justify-between py-2 px-3"
              style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}33` }}
            >
              <div className="min-w-0">
                <p className="text-sm truncate" style={{ color: MARBLE, fontFamily: fontStack.display }}>
                  {g.name}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                  {g.arriving}
                </p>
              </div>
              <span
                className="text-[10px] tracking-[0.3em] uppercase px-2 py-1 flex items-center gap-1 flex-shrink-0"
                style={{ color: accent, border: `1px solid ${accent}`, fontFamily: fontStack.body }}
              >
                {isConfirmed && <Check size={10} />}
                {!isConfirmed && !isPending && <Send size={10} />}
                {g.status}
              </span>
            </div>
          );
        })}
      </div>
    )}

    <Divider label="The ledger" />

    <ExpenseLedger />

    <div className="mt-10 pt-6 text-center" style={{ borderTop: `1px solid ${VEIN}22` }}>
      <p className="text-[10px] tracking-[0.6em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
        A Fertitta property
      </p>
      <p className="text-[10px] mt-2 italic" style={{ color: TEXT_DIM, fontFamily: fontStack.display }}>
        Owned & operated by the Fertitta family
      </p>
    </div>
  </div>
);

// ─── Reserve flow — event picker → guest-slot detail sheet ──────────
//
// Intended Postgres shape (mirrors mock state below; see Workstream I):
//   table reservations (
//     id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     member_id       uuid NOT NULL REFERENCES members(id),
//     event_id        uuid NOT NULL REFERENCES events(id),
//     party_size      smallint NOT NULL,
//     status          reservation_status NOT NULL,           -- enum
//     created_at      timestamptz NOT NULL DEFAULT now()
//   )
//   table guest_invites (
//     id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     reservation_id  uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
//     name            text NOT NULL,
//     phone           text NOT NULL,
//     kind            guest_invite_kind NOT NULL,             -- 'free' | 'pending'
//     status          guest_invite_status NOT NULL,           -- PENDING_INFO | INVITED | CONFIRMED | DENIED
//     invited_at      timestamptz NOT NULL DEFAULT now()
//   )
const FREE_SLOTS_PER_RESERVATION = 3;

const makeFreeSlot = () => ({ id: crypto.randomUUID(), kind: "free", name: "", phone: "" });
const makePendingSlot = () => ({ id: crypto.randomUUID(), kind: "pending", name: "", phone: "" });
const makeInitialSlots = () =>
  Array.from({ length: FREE_SLOTS_PER_RESERVATION }, makeFreeSlot);

const initialReserveState = {
  open: false,
  reservationId: null,
  eventId: null,
  slots: [],
  status: "idle", // 'idle' | 'sending' | 'sent'
};

function reserveReducer(s, a) {
  switch (a.type) {
    case "OPEN":
      return {
        open: true,
        reservationId: crypto.randomUUID(),
        eventId: a.eventId,
        slots: makeInitialSlots(),
        status: "idle",
      };
    case "CLOSE":
      return initialReserveState;
    case "UPDATE":
      return {
        ...s,
        slots: s.slots.map((sl) =>
          sl.id === a.id ? { ...sl, [a.field]: a.value } : sl
        ),
      };
    case "REMOVE":
      return { ...s, slots: s.slots.filter((sl) => sl.id !== a.id) };
    case "ADD_PENDING":
      return { ...s, slots: [...s.slots, makePendingSlot()] };
    case "SUBMIT":
      // guard re-entrant double-submit
      return s.status === "sending" ? s : { ...s, status: "sending" };
    case "SUBMIT_DONE":
      return { ...s, status: "sent" };
    default:
      return s;
  }
}

const slotIsFilled = (sl) => sl.name.trim().length > 0 && sl.phone.trim().length > 0;

const GuestSlot = ({ slot, index, onChange, onRemove, removable }) => {
  const filled = slotIsFilled(slot);
  const accent = slot.kind === "pending" ? CLUB_AMBER : filled ? CLUB_GREEN : VEIN;
  const label =
    slot.kind === "pending"
      ? `GUEST №${index + 1} · PENDING APPROVAL`
      : `GUEST №${index + 1} · COMPLIMENTARY`;

  return (
    <div
      className="p-3"
      style={{
        background: GRAPHITE_2,
        borderLeft: `3px solid ${accent}`,
        border: `1px solid ${accent}44`,
        borderLeftWidth: 3,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-[9px] tracking-[0.32em] uppercase"
          style={{ color: accent, fontFamily: fontStack.body }}
        >
          {label}
        </p>
        {removable && (
          <button
            onClick={onRemove}
            aria-label="Remove guest"
            className="p-1"
            style={{ color: VEIN_TEXT }}
          >
            <X size={12} />
          </button>
        )}
      </div>
      <input
        type="text"
        value={slot.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Full name"
        className="w-full bg-transparent text-sm py-1 outline-none"
        style={{
          color: MARBLE,
          fontFamily: fontStack.body,
          borderBottom: `1px solid ${VEIN}33`,
        }}
      />
      <input
        type="tel"
        value={slot.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="Mobile number"
        className="w-full bg-transparent text-sm py-1 mt-2 outline-none"
        style={{
          color: MARBLE,
          fontFamily: fontStack.mono,
          borderBottom: `1px solid ${VEIN}33`,
        }}
      />
    </div>
  );
};

const SmsPassMockup = ({ guestName, event, totalCount }) => {
  const firstName = (guestName || "").trim().split(" ")[0] || "Friend";
  const others = totalCount > 1 ? ` (+${totalCount - 1} more)` : "";
  return (
    <div className="px-6 pt-4">
      <p
        className="text-[9px] tracking-[0.4em] uppercase mb-3 text-center"
        style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
      >
        Sent to {firstName}'s phone{others}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="mx-auto"
        style={{ maxWidth: 320 }}
      >
        <div
          className="px-4 py-3"
          style={{
            background: GRAPHITE_2,
            border: `1px solid ${VEIN}33`,
            borderRadius: 18,
            borderTopLeftRadius: 4,
          }}
        >
          <p
            className="text-[9px] tracking-[0.32em] uppercase mb-2"
            style={{ color: BRASS, fontFamily: fontStack.body }}
          >
            The Oak Room
          </p>
          <p
            className="text-[13px] leading-snug"
            style={{ color: MARBLE, fontFamily: fontStack.body }}
          >
            {firstName} — you're on the list for{" "}
            <em style={{ fontFamily: fontStack.display, color: MARBLE }}>
              {event.title}
            </em>
            , {event.date.toLowerCase()} at {event.time}. The Post Oak Hotel ·
            walk in, tap your pass.
          </p>
          <div
            className="flex items-center gap-2 mt-3 px-3 py-2"
            style={{
              background: BRASS + "22",
              border: `1px solid ${BRASS}55`,
              borderRadius: 10,
            }}
          >
            <Wallet size={14} style={{ color: BRASS }} />
            <p
              className="text-[11px] tracking-[0.18em] uppercase"
              style={{ color: BRASS, fontFamily: fontStack.body }}
            >
              Add to Apple Wallet
            </p>
          </div>
        </div>
      </motion.div>
      <p
        className="text-[9px] tracking-[0.32em] uppercase text-center mt-4"
        style={{ color: TEXT_DIM, fontFamily: fontStack.body }}
      >
        Their pass goes straight into Wallet. The doorman sees it on tap.
      </p>
    </div>
  );
};

const ReserveDetailSheet = ({ event, state, dispatch, onSubmit }) => {
  if (!event) return null;

  const filledSlots = state.slots.filter(slotIsFilled);
  const filledCount = filledSlots.length;
  const canSubmit = filledCount > 0 && state.status === "idle";
  const sent = state.status === "sent";

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch({ type: "SUBMIT" });
    // Simulate the round-trip — real wire would await an API call here.
    setTimeout(() => {
      const filled = state.slots.filter(slotIsFilled);
      onSubmit(event, filled);
      dispatch({ type: "SUBMIT_DONE" });
      // Hold the SMS preview long enough to read, then dismiss.
      setTimeout(() => dispatch({ type: "CLOSE" }), 2400);
    }, 500);
  };

  return (
    <AnimatePresence>
      {state.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={() => dispatch({ type: "CLOSE" })}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto"
            style={{
              background: GRAPHITE,
              borderTop: `1px solid ${VEIN}55`,
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
            }}
          >
            <div className="flex justify-center pt-3">
              <div style={{ width: 38, height: 4, background: VEIN + "55", borderRadius: 2 }} />
            </div>

            {event.image && (
              <div className="relative mx-4 mt-3 overflow-hidden" style={{ height: 140 }}>
                <img
                  src={event.image}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 50%, ${GRAPHITE} 100%)`,
                  }}
                />
              </div>
            )}

            <div className="px-6 pt-3 pb-2">
              <p
                className="text-[10px] tracking-[0.45em] uppercase"
                style={{ color: BRASS, fontFamily: fontStack.body }}
              >
                {event.date} · {event.time}
              </p>
              <h2
                className="text-2xl mt-1 leading-tight"
                style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
              >
                {event.title}
              </h2>
              <p
                className="text-[11px] tracking-[0.18em] uppercase mt-1"
                style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
              >
                {event.host}
              </p>
            </div>

            {sent ? (
              <SmsPassMockup
                guestName={filledSlots[0]?.name}
                event={event}
                totalCount={filledCount}
              />
            ) : (
              <>
                <div className="px-6 mt-4">
                  <p
                    className="text-[10px] tracking-[0.4em] uppercase mb-3"
                    style={{ color: BRASS, fontFamily: fontStack.body }}
                  >
                    Your guests
                  </p>
                  <p
                    className="text-[11px] mb-3"
                    style={{ color: TEXT_DIM, fontFamily: fontStack.body }}
                  >
                    Three complimentary slots are yours by tier. Beyond that, the GM
                    approves at his discretion.
                  </p>

                  <div className="space-y-3">
                    {state.slots.map((sl, i) => (
                      <GuestSlot
                        key={sl.id}
                        slot={sl}
                        index={i}
                        removable={i >= FREE_SLOTS_PER_RESERVATION}
                        onChange={(field, value) =>
                          dispatch({ type: "UPDATE", id: sl.id, field, value })
                        }
                        onRemove={() => dispatch({ type: "REMOVE", id: sl.id })}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => dispatch({ type: "ADD_PENDING" })}
                    className="mt-3 w-full py-2 text-[10px] tracking-[0.32em] uppercase"
                    style={{
                      color: VEIN_TEXT,
                      border: `1px dashed ${VEIN}66`,
                      fontFamily: fontStack.body,
                      background: "transparent",
                    }}
                  >
                    + Add another guest (pending approval)
                  </button>
                </div>

                <div className="px-6 mt-5">
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="w-full py-3 text-[11px] tracking-[0.32em] uppercase transition-opacity"
                    style={{
                      color: GRAPHITE,
                      background: `linear-gradient(180deg, ${BRASS} 0%, ${BRASS_DEEP} 100%)`,
                      fontFamily: fontStack.body,
                      opacity: canSubmit ? 1 : 0.4,
                      boxShadow: `0 1px 0 ${BRASS}88 inset, 0 12px 30px -16px ${BRASS}88`,
                    }}
                  >
                    {state.status === "sending"
                      ? "Sending…"
                      : `Send ${filledCount} invitation${filledCount === 1 ? "" : "s"}`}
                  </button>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase text-center mt-3"
                    style={{ color: TEXT_DIM, fontFamily: fontStack.body }}
                  >
                    Each guest receives an SMS with a one-tap pass.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ReserveScreen = ({ events, onSubmit, state, dispatch }) => {
  const event = events.find((e) => e.id === state.eventId);

  const [guestOpen, setGuestOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  return (
    <div className="px-6 pt-3 pb-32">
      <p
        className="text-[10px] tracking-[0.5em] uppercase"
        style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
      >
        Pick the night, fill the table
      </p>
      <h1
        className="text-4xl mt-2 leading-none"
        style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
      >
        <em style={{ color: BRASS }}>Reserve</em>
      </h1>

      {/* Guest reservation panel */}
      <div className="mt-5 mb-1" style={{ border: `1px solid ${VEIN}33`, background: GRAPHITE_2 }}>
        <button
          onClick={() => setGuestOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <UserPlus size={14} style={{ color: BRASS }} />
            <span
              className="text-[11px] tracking-[0.25em] uppercase"
              style={{ color: MARBLE, fontFamily: fontStack.body }}
            >
              Bring a Guest
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!guestOpen && guestCount > 0 && (
              <span
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: BRASS, fontFamily: fontStack.body }}
              >
                {guestCount} {guestCount === 1 ? "guest" : "guests"}
              </span>
            )}
            <motion.span
              animate={{ rotate: guestOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: VEIN_TEXT, display: "inline-block", lineHeight: 1 }}
            >
              ▾
            </motion.span>
          </div>
        </button>

        <AnimatePresence>
          {guestOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: "hidden", borderTop: `1px solid ${VEIN}22` }}
            >
              <div className="px-4 py-4 space-y-4">
                {/* Counter */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px]"
                    style={{ color: TEXT_DIM, fontFamily: fontStack.body }}
                  >
                    Number of guests
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ border: `1px solid ${VEIN}44`, color: MARBLE }}
                    >
                      –
                    </button>
                    <span
                      className="text-lg w-4 text-center"
                      style={{ color: MARBLE, fontFamily: fontStack.display, fontWeight: 400 }}
                    >
                      {guestCount}
                    </span>
                    <button
                      onClick={() => setGuestCount((c) => c + 1)}
                      className="w-7 h-7 flex items-center justify-center"
                      style={{ border: `1px solid ${VEIN}44`, color: MARBLE }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Name field */}
                <div className="space-y-1">
                  <label
                    className="text-[10px] tracking-[0.25em] uppercase block"
                    style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
                  >
                    Guest name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-transparent px-3 py-2 text-[13px] outline-none"
                    style={{
                      border: `1px solid ${VEIN}44`,
                      color: MARBLE,
                      fontFamily: fontStack.body,
                      "--tw-placeholder-color": TEXT_DIM,
                    }}
                  />
                </div>

                {/* Phone field */}
                <div className="space-y-1">
                  <label
                    className="text-[10px] tracking-[0.25em] uppercase block"
                    style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="(000) 000-0000"
                    className="w-full bg-transparent px-3 py-2 text-[13px] outline-none"
                    style={{
                      border: `1px solid ${VEIN}44`,
                      color: MARBLE,
                      fontFamily: fontStack.body,
                    }}
                  />
                </div>

                {/* Note */}
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: TEXT_DIM, fontFamily: fontStack.body }}
                >
                  Up to 3 guests are included with your membership. The club will follow up to confirm your request.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Divider label="Upcoming · open seats" />

      <div className="space-y-3">
        {events.map((e) => (
          <button
            key={e.id}
            onClick={() => dispatch({ type: "OPEN", eventId: e.id })}
            className="w-full text-left p-4 transition-colors flex items-stretch gap-4"
            style={{
              background: GRAPHITE_2,
              border: `1px solid ${e.rsvp ? BRASS + "66" : VEIN + "22"}`,
            }}
          >
            {e.image && (
              <div
                className="flex-shrink-0 overflow-hidden"
                style={{ width: 80, height: 80, border: `1px solid ${BRASS}55` }}
              >
                <img
                  src={e.image}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <p
                  className="text-[10px] tracking-[0.32em] uppercase"
                  style={{ color: e.rsvp ? BRASS : VEIN_TEXT, fontFamily: fontStack.body }}
                >
                  {e.date} · {e.time}
                </p>
                {e.rsvp && (
                  <p
                    className="text-[9px] tracking-[0.32em] uppercase"
                    style={{ color: BRASS, fontFamily: fontStack.body }}
                  >
                    Reserved
                  </p>
                )}
              </div>
              <h3
                className="text-xl mt-1 leading-tight"
                style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
              >
                {e.title}
              </h3>
              <p
                className="text-[11px] mt-1"
                style={{ color: TEXT_DIM, fontFamily: fontStack.body }}
              >
                {e.teaser}
              </p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

const RulesScreen = () => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      Of conduct & comportment
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      The <em style={{ color: BRASS }}>house</em>
    </h1>

    <Divider label="Five rules" />

    <div className="space-y-6">
      {HOUSE_RULES.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex gap-4"
        >
          <span
            className="text-3xl leading-none flex-shrink-0 w-10"
            style={{ color: BRASS, fontFamily: fontStack.display, fontStyle: "italic" }}
          >
            {r.n}
          </span>
          <p className="text-base leading-relaxed pt-1" style={{ color: MARBLE + "DD", fontFamily: fontStack.display }}>
            {r.rule}
          </p>
        </motion.div>
      ))}
    </div>

    <Divider label="A note on dress" />

    <p className="text-sm leading-relaxed italic" style={{ color: MARBLE + "AA", fontFamily: fontStack.display }}>
      "Smart, considered, and your own. We trust your judgment more than a checklist — but if in doubt, err toward the jacket."
    </p>
    <p className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      — The Membership Committee
    </p>

    <div className="mt-10 pt-6 text-center" style={{ borderTop: `1px solid ${VEIN}22` }}>
      <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
        RSVP & Concierge
      </p>
      <p className="text-base mt-2" style={{ color: MARBLE, fontFamily: fontStack.mono, letterSpacing: "0.1em" }}>
        713.386.2500
      </p>
      <p className="text-[10px] mt-1" style={{ color: TEXT_DIM, fontFamily: fontStack.mono }}>
        Events@OakRoomHouston.com
      </p>
      <p className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
        @TheOakRoomHouston
      </p>
    </div>
  </div>
);

// ─── App shell ─────────────────────────────────────────────────────
// Five tabs. TABS[2] (reserve) is rendered as the elevated CenterTab.
// Order matters — the tab bar slices into [0,2), [2], [3,5).
const TABS = [
  { id: "foryou", label: "For You", Icon: Sparkles },
  { id: "home", label: "Events", Icon: Calendar },
  { id: "reserve", label: "Reserve", Icon: Wine },
  { id: "card", label: "Member", Icon: Users },
  { id: "rules", label: "House", Icon: BookOpen },
];

// Flat tab — the four non-center tabs.
const FlatTab = ({ tab, active, onClick }) => {
  const { id, label, Icon } = tab;
  return (
    <button
      key={id}
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-1 px-1 transition-all"
      style={{ color: active ? BRASS : MARBLE + "55" }}
    >
      <Icon size={16} strokeWidth={active ? 2 : 1.5} />
      <span
        className="text-[10px] tracking-[0.2em] uppercase"
        style={{ fontFamily: fontStack.body, fontWeight: active ? 500 : 300 }}
      >
        {label}
      </span>
      <motion.div
        className="w-1 h-1 rounded-full"
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ background: BRASS }}
      />
    </button>
  );
};

// Reserve gets the Venmo-style center treatment — larger icon, brass ring,
// lifted upward when active. No shared dot — the lift IS the active indicator.
const CenterTab = ({ tab, active, onClick }) => {
  const { id, label, Icon } = tab;
  return (
    <button
      key={id}
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center -mt-3"
      style={{ width: 64 }}
    >
      <motion.div
        initial={false}
        animate={{ y: active ? -8 : 0, scale: active ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="flex items-center justify-center rounded-full"
        style={{
          width: 52,
          height: 52,
          background: active
            ? `linear-gradient(160deg, ${BRASS} 0%, ${BRASS_DEEP} 100%)`
            : GRAPHITE_2,
          border: `1px solid ${active ? BRASS : VEIN + "55"}`,
          boxShadow: active
            ? `0 12px 28px -10px ${BRASS}77, inset 0 1px 0 ${MARBLE}22`
            : `0 4px 12px -4px ${BRASS}22, inset 0 1px 0 ${MARBLE}11`,
          color: active ? MARBLE : BRASS,
        }}
      >
        <Icon size={22} strokeWidth={active ? 2 : 1.6} />
      </motion.div>
      <span
        className="text-[10px] tracking-[0.2em] uppercase mt-1"
        style={{
          fontFamily: fontStack.body,
          fontWeight: active ? 500 : 300,
          color: active ? BRASS : MARBLE + "66",
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default function ClubApp() {
  const [tab, setTab] = useState("foryou");
  const [events, setEvents] = useState(EVENTS);
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [toast, setToast] = useState(null);
  const [reserveState, reserveDispatch] = useReducer(
    reserveReducer,
    initialReserveState
  );

  // Pick a sensible event for shortcut entries (next un-RSVPed, fallback to first).
  const nextOpenEvent = () => events.find((e) => !e.rsvp) || events[0];

  const openReserveFor = (eventId) => {
    setTab("reserve");
    reserveDispatch({ type: "OPEN", eventId });
  };

  const handleConcierge = (msg) => {
    if (msg && /reserve|guest/i.test(msg)) {
      const e = nextOpenEvent();
      if (e) {
        openReserveFor(e.id);
        return;
      }
    }
    showToast("Note sent · concierge will reply by text");
  };
  const handleQuickBook = () => {
    const e = nextOpenEvent();
    if (e) openReserveFor(e.id);
    else showToast("No open events to hold");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleRSVP = (id) => {
    let wasReserved = false;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          wasReserved = e.rsvp;
          return { ...e, rsvp: !e.rsvp };
        }
        return e;
      })
    );
    showToast(wasReserved ? "Reservation released" : "Reserved · check Ledger");
  };

  const handleAddGuest = (name, phone) => {
    setGuests((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        phone,
        arriving: "Tonight · 11pm",
        status: "Notified",
        checked: false,
      },
    ]);
    showToast(`SMS pass sent to ${name.split(" ")[0]}`);
  };

  const handleReserveSubmit = (event, slots) => {
    const arriving = `${event.date} · ${event.time}`;
    setGuests((prev) => [
      ...prev,
      ...slots.map((sl) => ({
        id: sl.id,
        name: sl.name,
        phone: sl.phone,
        arriving,
        status: sl.kind === "pending" ? "Pending" : "Notified",
        checked: false,
      })),
    ]);
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, rsvp: true } : e))
    );
    const pendingN = slots.filter((s) => s.kind === "pending").length;
    showToast(
      pendingN > 0
        ? `${slots.length} invitation${slots.length === 1 ? "" : "s"} sent · ${pendingN} pending GM`
        : `${slots.length} invitation${slots.length === 1 ? "" : "s"} sent`
    );
  };

  return (
    <div
      // Desktop: brass-glow background + flex-center the phone-frame mockup.
      // Mobile / PWA standalone: outer wrapper just fills the viewport so the
      // inner div can go edge-to-edge under the real iOS status bar.
      className="min-h-screen w-full md:flex md:items-center md:justify-center md:p-4"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, ${BRASS}18 0%, transparent 50%),
          radial-gradient(ellipse at bottom, ${GRAPHITE_2} 0%, ${CHARCOAL} 60%, #000 100%)
        `,
        fontFamily: fontStack.body,
      }}
    >
      {/* Phone frame — chrome only on desktop. Mobile goes edge-to-edge. */}
      <div
        className="relative w-full h-screen md:h-[min(880px,95vh)] md:w-[min(420px,100%)] md:mx-auto md:rounded-[44px] md:p-3 md:border"
        style={{
          background: GRAPHITE,
          // Inline styles only kick in on md+ via Tailwind class composition.
          // Mobile gets none of these (no border, no shadow, no rounding).
        }}
      >
        {/* Apply the desktop-only frame chrome via a sibling overlay.
            Done as an absolutely-positioned div so we can hide it cleanly on mobile. */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none rounded-[44px]"
          style={{
            boxShadow: `
              0 0 0 2px ${VEIN}44,
              0 40px 80px -20px ${BRASS}22,
              0 0 100px -20px ${BRASS}11
            `,
            border: `1px solid ${VEIN}66`,
          }}
        />

        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden flex flex-col md:rounded-[32px]"
          style={{
            background: GRAPHITE,
          }}
        >
          {/* Fake status bar — only on desktop preview where there's no real one.
              On mobile/PWA the real iOS status bar shows through (theme_color is
              graphite to match). */}
          <div className="hidden md:flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
            <span className="text-[10px] tracking-[0.2em]" style={{ color: MARBLE + "88", fontFamily: fontStack.mono }}>
              11:42
            </span>
            <div className="flex items-center gap-1.5" style={{ color: MARBLE + "88" }}>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-1 rounded-full" style={{ height: 3 + i, background: "currentColor" }} />
                ))}
              </div>
              <span className="text-[9px]" style={{ fontFamily: fontStack.mono }}>5G</span>
              <div className="w-5 h-2.5 rounded-sm border flex items-center" style={{ borderColor: "currentColor" }}>
                <div className="w-3.5 h-1.5 ml-0.5 rounded-sm" style={{ background: "currentColor" }} />
              </div>
            </div>
          </div>

          {/* Safe-area padding for PWA standalone — content doesn't slide under
              the iPhone notch. Only applies on mobile. */}
          <div className="md:hidden flex-shrink-0" style={{ paddingTop: "env(safe-area-inset-top)" }} />

          {/* Title bar */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${VEIN}22` }}>
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                Members
              </p>
              <p className="text-lg leading-none mt-1" style={{ fontFamily: fontStack.display, color: MARBLE, fontStyle: "italic" }}>
                Oak Room Houston
              </p>
            </div>
            <button
              className="relative"
              style={{ color: BRASS }}
              aria-label="Notifications, 1 unread"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: BRASS }} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "foryou" && (
                  <ForYouScreen
                    events={events}
                    onRSVP={handleRSVP}
                    onConcierge={handleConcierge}
                    onQuickBook={handleQuickBook}
                  />
                )}
                {tab === "home" && <HomeScreen events={events} onRSVP={handleRSVP} />}
                {tab === "card" && <MembershipScreen guests={guests} />}
                {tab === "reserve" && (
                  <ReserveScreen
                    events={events}
                    onSubmit={handleReserveSubmit}
                    state={reserveState}
                    dispatch={reserveDispatch}
                  />
                )}
                {tab === "rules" && <RulesScreen />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Reserve detail sheet — mounted at shell level so its
              position:fixed escapes the tab-transition motion.div. */}
          <ReserveDetailSheet
            event={events.find((e) => e.id === reserveState.eventId)}
            state={reserveState}
            dispatch={reserveDispatch}
            onSubmit={handleReserveSubmit}
          />

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute left-4 right-4 px-4 py-3 text-center z-30"
                style={{
                  bottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
                  background: GRAPHITE_2,
                  border: `1px solid ${BRASS}`,
                  color: MARBLE,
                  fontFamily: fontStack.body,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  boxShadow: `0 20px 40px -10px ${BRASS}33`,
                }}
              >
                <span style={{ color: BRASS, marginRight: 8 }}>✦</span>
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab bar — three-section grid: [flat flat] [CENTER] [flat flat] */}
          <div
            role="tablist"
            aria-label="Oak Room navigation"
            className="flex-shrink-0 grid items-end px-3 pt-3"
            style={{
              gridTemplateColumns: "1fr 1fr auto 1fr 1fr",
              background: `linear-gradient(180deg, transparent, ${GRAPHITE} 30%)`,
              borderTop: `1px solid ${VEIN}33`,
              // Pad above the iPhone home indicator on standalone PWA.
              // env() resolves to 0 on desktop / non-PWA, so this is safe everywhere.
              paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
            }}
          >
            {TABS.slice(0, 2).map((t) => (
              <FlatTab key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
            ))}
            <CenterTab tab={TABS[2]} active={tab === TABS[2].id} onClick={() => setTab(TABS[2].id)} />
            {TABS.slice(3).map((t) => (
              <FlatTab key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
