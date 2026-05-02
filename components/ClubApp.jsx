"use client";

import React, { useState } from "react";
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
// Graphite + Carrara marble • cobalt accents
// ───────────────────────────────────────────────────────────────────

const COBALT = "#2B6CB0";        // the accent — true royal blue, members'-club presence
const COBALT_DEEP = "#1A4A8C";
const GRAPHITE = "#1C1D20";      // primary surface
const GRAPHITE_2 = "#26282C";    // raised surface
const CHARCOAL = "#0F1012";      // deepest
const MARBLE = "#F4F1EA";        // off-white, warm
const MARBLE_2 = "#E8E3D8";      // veined shadow
const VEIN = "#9AA3AE";          // cool grey vein — borders, dividers, SVG strokes
const VEIN_TEXT = "#B8C2CC";     // brighter vein — text-only, ≈5.2:1 on GRAPHITE for WCAG AA
const TEXT_DIM = "#A4A8AE";      // bumped from #8B8E94 for AA contrast

const fontStack = {
  display: "'Canela', 'GT Super Display', 'Cormorant Garamond', Georgia, serif",
  body: "'Söhne', 'Inter Tight', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── Mock data ─────────────────────────────────────────────────────
const MEMBER = {
  name: "Dustin Powers",
  memberNo: "№ 0184",
  tier: "Founders",
  joined: "MMXXIII",
  cardCode: "OR-0184-FNDR",
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
    rsvp: false,
  },
];

const INITIAL_GUESTS = [
  { id: 1, name: "Julia Powers", phone: "+1 (360) ••• 4421", arriving: "Sat, May 3 · 11pm", status: "Notified", checked: false },
  { id: 2, name: "Eric A. Glassman", phone: "+1 (212) ••• 0917", arriving: "Sat, May 3 · 11pm", status: "Confirmed", checked: false },
];

const HOUSE_RULES = [
  { n: "I.", rule: "Discretion above all. No photographs past the foyer." },
  { n: "II.", rule: "Dress with intention. Jacket required after 8pm." },
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
          color: COBALT,
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
        background: `linear-gradient(180deg, ${COBALT} 0%, ${VEIN} 100%)`,
        fontFamily: fontStack.body,
        boxShadow: `0 1px 0 ${COBALT}88 inset, 0 8px 24px -12px ${COBALT}55`,
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
        A quiet <em style={{ color: COBALT }}>welcome</em>
      </h1>

      {/* Note from the club */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mt-5 p-5 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${GRAPHITE_2} 0%, ${GRAPHITE} 100%)`,
          border: `1px solid ${COBALT}55`,
        }}
      >
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l" style={{ borderColor: COBALT }} />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r" style={{ borderColor: COBALT }} />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l" style={{ borderColor: COBALT }} />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r" style={{ borderColor: COBALT }} />

        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}>
          A note from the club
        </p>
        <p
          className="mt-3 text-base italic leading-relaxed"
          style={{ color: MARBLE + "EE", fontFamily: fontStack.display }}
        >
          {firstName} — the sommelier set aside a half-bottle of the '22 Tres Colline Pinot for Thursday's wine night. We'll have it waiting.
        </p>
        <p className="mt-4 text-right text-[10px] tracking-[0.3em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
          — Eli, head sommelier
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
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.3em]" style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}>
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
                  color: e.rsvp ? COBALT : MARBLE + "AA",
                  border: `1px solid ${e.rsvp ? COBALT : VEIN}`,
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

      <motion.button
        onClick={onQuickBook}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.99 }}
        className="w-full text-left p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(160deg, ${GRAPHITE_2} 0%, ${GRAPHITE} 100%)`,
          border: `1px solid ${VEIN}33`,
        }}
      >
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
            The pattern
          </p>
          <p
            className="text-base mt-1"
            style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
          >
            The Saloon · Friday · 7 PM · two
          </p>
        </div>
        <span
          className="text-[9px] tracking-[0.3em] uppercase px-2 py-1"
          style={{ color: COBALT, border: `1px solid ${COBALT}`, fontFamily: fontStack.body }}
        >
          Hold it
        </span>
      </motion.button>

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
            background: note.trim() ? COBALT : "transparent",
            border: `1px solid ${note.trim() ? COBALT : VEIN + "55"}`,
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
            The book of <em style={{ color: COBALT }}>hours</em>
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
              background: `linear-gradient(160deg, ${GRAPHITE_2} 0%, ${GRAPHITE} 100%)`,
              border: `1px solid ${VEIN}33`,
            }}
          >
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l" style={{ borderColor: COBALT }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r" style={{ borderColor: COBALT }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l" style={{ borderColor: COBALT }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r" style={{ borderColor: COBALT }} />

            {e.rsvp && (
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: COBALT, boxShadow: `0 0 8px ${COBALT}` }}
              />
            )}

            <div className="p-3 h-full flex flex-col justify-between">
              <div>
                <p
                  className="text-[10px] tracking-[0.3em]"
                  style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}
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
                border: `1px solid ${COBALT}`,
                boxShadow: `0 20px 60px -10px rgba(0,0,0,0.8)`,
              }}
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: COBALT }} />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: COBALT }} />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: COBALT }} />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: COBALT }} />

              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center z-10"
                style={{ color: VEIN_TEXT, border: `1px solid ${VEIN}55` }}
              >
                <X size={12} />
              </button>

              <div className="p-5">
                <p
                  className="text-[10px] tracking-[0.4em]"
                  style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}
                >
                  {expanded.date} · {expanded.time}
                </p>
                <h2
                  className="text-2xl mt-2 leading-tight"
                  style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}
                >
                  {expanded.title}
                </h2>

                <div className="my-4 h-px" style={{ background: `linear-gradient(to right, ${COBALT}, transparent)` }} />

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
                    color: expanded.rsvp ? COBALT : MARBLE,
                    background: expanded.rsvp ? "transparent" : COBALT,
                    border: `1px solid ${COBALT}`,
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
        Your <em style={{ color: COBALT }}>guests</em>
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
                color: g.status === "Confirmed" ? COBALT : MARBLE + "AA",
                border: `1px solid ${g.status === "Confirmed" ? COBALT : VEIN}`,
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
            style={{ background: GRAPHITE_2, border: `1px solid ${COBALT}` }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: COBALT, fontFamily: fontStack.body }}>
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
            color: COBALT,
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
      background: GRAPHITE,
      borderRadius: 18,
      color: MARBLE,
      boxShadow: `
        0 30px 60px -30px rgba(0,0,0,0.7),
        0 0 0 1px rgba(255,255,255,0.05),
        inset 0 1px 0 rgba(255,255,255,0.12)
      `,
    }}
  >
    {/* Top — header + NFC waves */}
    <div className="px-5 pt-5 flex items-start justify-between">
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: fontStack.body, color: COBALT, fontWeight: 500 }}>
          The Oak Room
        </p>
        <p className="text-[10px] mt-1 italic" style={{ fontFamily: fontStack.display, color: MARBLE + "AA" }}>
          The Post Oak Hotel · Houston
        </p>
      </div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ color: MARBLE + "99" }} aria-hidden="true">
        <path d="M6 6 Q 13 12 6 18" />
        <path d="M10 6 Q 17 12 10 18" />
        <path d="M14 6 Q 21 12 14 18" />
      </svg>
    </div>

    {/* Primary field — Member name */}
    <div className="px-5 mt-7">
      <p className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: fontStack.body, color: COBALT, fontWeight: 500 }}>
        Member
      </p>
      <p className="text-2xl mt-1 leading-tight" style={{ fontFamily: fontStack.display, fontWeight: 400, letterSpacing: "-0.01em", color: MARBLE }}>
        {MEMBER.name}
      </p>
    </div>

    {/* Secondary fields */}
    <div className="px-5 mt-5 flex gap-7">
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: fontStack.body, color: COBALT, fontWeight: 500 }}>
          Tier
        </p>
        <p className="text-base mt-1 italic" style={{ fontFamily: fontStack.display, color: MARBLE }}>
          {MEMBER.tier}
        </p>
      </div>
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: fontStack.body, color: COBALT, fontWeight: 500 }}>
          No.
        </p>
        <p className="text-base mt-1 italic" style={{ fontFamily: fontStack.display, color: MARBLE }}>
          {MEMBER.memberNo}
        </p>
      </div>
    </div>

    {/* Auxiliary — member since */}
    <div className="px-5 mt-4">
      <p className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: fontStack.body, color: COBALT, fontWeight: 500 }}>
        Member Since
      </p>
      <p className="text-sm mt-1 italic" style={{ fontFamily: fontStack.display, color: MARBLE + "DD" }}>
        {MEMBER.joined}
      </p>
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

const MembershipScreen = ({ guests = [] }) => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      Bona fides
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      Your <em style={{ color: COBALT }}>standing</em>
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

      {/* Oak tree silhouette */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 252"
        preserveAspectRatio="xMidYMid meet"
      >
        <g fill="#1a1a1a" opacity="0.42">
          {/* Trunk */}
          <path d="M188,252 L188,148 Q194,140 200,142 Q206,140 212,148 L212,252 Z"/>
          {/* Root flare */}
          <ellipse cx="200" cy="250" rx="26" ry="6"/>
          {/* Main canopy — overlapping organic clusters */}
          <ellipse cx="200" cy="82"  rx="88"  ry="72"/>
          <ellipse cx="115" cy="105" rx="68"  ry="52"/>
          <ellipse cx="285" cy="100" rx="72"  ry="56"/>
          <ellipse cx="160" cy="50"  rx="58"  ry="46"/>
          <ellipse cx="242" cy="46"  rx="62"  ry="48"/>
          <ellipse cx="72"  cy="128" rx="52"  ry="40"/>
          <ellipse cx="328" cy="120" rx="55"  ry="43"/>
          <ellipse cx="200" cy="36"  rx="48"  ry="40"/>
          <ellipse cx="345" cy="148" rx="42"  ry="33"/>
          <ellipse cx="55"  cy="148" rx="44"  ry="34"/>
          <ellipse cx="130" cy="142" rx="42"  ry="30"/>
          <ellipse cx="270" cy="138" rx="44"  ry="32"/>
          <ellipse cx="20"  cy="152" rx="30"  ry="24"/>
          <ellipse cx="380" cy="145" rx="28"  ry="22"/>
        </g>
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

    <WalletPassFace />

    <a
      href="/api/wallet-pass"
      className="mt-5 w-full py-3.5 flex items-center justify-center gap-2.5 text-[11px] tracking-[0.3em] uppercase no-underline transition-all"
      style={{
        color: MARBLE,
        background: GRAPHITE_2,
        border: `1px solid ${COBALT}`,
        fontFamily: fontStack.body,
        boxShadow: `0 8px 24px -12px ${COBALT}55, inset 0 1px 0 ${MARBLE}11`,
      }}
    >
      <Wallet size={14} strokeWidth={1.6} />
      Add to Apple Wallet
    </a>
    <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-center" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      Replace the metal card · works at the door
    </p>

    <Divider label="Privileges" />

    <div className="space-y-3">
      {[
        { k: "Guest allowance", v: "+4 per visit" },
        { k: "Reservation window", v: "30 days advance" },
        { k: "Cellar access", v: "Founders' list" },
        { k: "House credit", v: "$400 / month" },
        { k: "Sister venues", v: "Mastro's · Bloom & Bee · Bouchée" },
      ].map((p, i) => (
        <div key={i} className="flex justify-between items-baseline pb-2" style={{ borderBottom: `1px dashed ${VEIN}33` }}>
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: MARBLE + "AA", fontFamily: fontStack.body }}>
            {p.k}
          </span>
          <span className="text-sm" style={{ color: COBALT, fontFamily: fontStack.display, fontStyle: "italic" }}>
            {p.v}
          </span>
        </div>
      ))}
    </div>

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
          const accent = isConfirmed ? COBALT : isPending ? "#C04A4A" : VEIN_TEXT;
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

    <Divider label="The ledger · due May 31" />

    <div className="p-5 text-center" style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}55` }}>
      <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
        Current balance
      </p>
      <p className="text-5xl mt-2" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
        $1,284<span style={{ color: VEIN_TEXT, fontSize: 28 }}>.50</span>
      </p>
      <div className="mt-4 flex gap-2 justify-center">
        <BrassButton>Settle now</BrassButton>
        <BrassButton variant="ghost">Auto-pay</BrassButton>
      </div>
    </div>

    <div className="mt-5 space-y-3.5">
      {[
        { d: "Apr 28", what: "Mastro's · party of 4", amt: "428.00" },
        { d: "Apr 24", what: "Post Oak Saloon · bar tab", amt: "186.50" },
        { d: "Apr 18", what: "Bouchée Patisserie · brunch", amt: "120.00" },
        { d: "Apr 12", what: "Founders' dues · monthly", amt: "850.00", credit: true },
        { d: "Apr 5", what: "House credit applied", amt: "−400.00", positive: true },
      ].map((t, i) => (
        <div key={i} className="flex justify-between items-baseline">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
              {t.d}
            </p>
            <p className="text-sm mt-0.5" style={{ color: MARBLE, fontFamily: fontStack.display, fontStyle: t.credit ? "italic" : "normal" }}>
              {t.what}
            </p>
          </div>
          <span
            className="font-light"
            style={{
              color: t.positive ? COBALT : MARBLE,
              fontFamily: fontStack.mono,
              fontSize: 14,
            }}
          >
            {t.positive ? "" : "$"}{t.amt}
          </span>
        </div>
      ))}
    </div>

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

const ReserveScreen = () => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      A table, a corner, a room
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      <em style={{ color: COBALT }}>Reserve</em>
    </h1>

    <Divider label="Available · party of 2" />

    <div className="space-y-4">
      {RESERVATIONS_AVAIL.map((r) => (
        <div key={r.room} className="p-4" style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}33` }}>
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="text-xl" style={{ fontFamily: fontStack.display, color: MARBLE }}>{r.room}</h3>
              <p className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
                {r.desc}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {r.times.map((t) => (
              <button
                key={t}
                className="px-3 py-1.5 text-xs"
                style={{
                  color: COBALT,
                  border: `1px solid ${COBALT}`,
                  fontFamily: fontStack.mono,
                  background: "transparent",
                }}
              >
                {t} pm
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RulesScreen = () => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN_TEXT, fontFamily: fontStack.body }}>
      Of conduct & comportment
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      The <em style={{ color: COBALT }}>house</em>
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
            style={{ color: COBALT, fontFamily: fontStack.display, fontStyle: "italic" }}
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
      style={{ color: active ? COBALT : MARBLE + "55" }}
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
        style={{ background: COBALT }}
      />
    </button>
  );
};

// Reserve gets the Venmo-style center treatment — larger icon, cobalt ring,
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
            ? `linear-gradient(160deg, ${COBALT} 0%, ${COBALT_DEEP} 100%)`
            : GRAPHITE_2,
          border: `1px solid ${active ? COBALT : VEIN + "55"}`,
          boxShadow: active
            ? `0 12px 28px -10px ${COBALT}77, inset 0 1px 0 ${MARBLE}22`
            : `0 4px 12px -4px ${COBALT}22, inset 0 1px 0 ${MARBLE}11`,
          color: active ? MARBLE : COBALT,
        }}
      >
        <Icon size={22} strokeWidth={active ? 2 : 1.6} />
      </motion.div>
      <span
        className="text-[10px] tracking-[0.2em] uppercase mt-1"
        style={{
          fontFamily: fontStack.body,
          fontWeight: active ? 500 : 300,
          color: active ? COBALT : MARBLE + "66",
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

  const handleConcierge = () => showToast("Note sent · concierge will reply by text");
  const handleQuickBook = () => showToast("Saloon · Fri 7 PM · held");

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

  return (
    <div
      // Desktop: cobalt-glow background + flex-center the phone-frame mockup.
      // Mobile / PWA standalone: outer wrapper just fills the viewport so the
      // inner div can go edge-to-edge under the real iOS status bar.
      className="min-h-screen w-full md:flex md:items-center md:justify-center md:p-4"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, ${COBALT}18 0%, transparent 50%),
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
              0 40px 80px -20px ${COBALT}22,
              0 0 100px -20px ${COBALT}11
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
                Member · {MEMBER.tier}
              </p>
              <p className="text-lg leading-none mt-1" style={{ fontFamily: fontStack.display, color: MARBLE, fontStyle: "italic" }}>
                Oak Room Houston
              </p>
            </div>
            <button
              className="relative"
              style={{ color: COBALT }}
              aria-label="Notifications, 1 unread"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: COBALT }} />
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
                {tab === "reserve" && <ReserveScreen />}
                {tab === "rules" && <RulesScreen />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute left-4 right-4 px-4 py-3 text-center"
                style={{
                  bottom: 90,
                  background: GRAPHITE_2,
                  border: `1px solid ${COBALT}`,
                  color: MARBLE,
                  fontFamily: fontStack.body,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  boxShadow: `0 20px 40px -10px ${COBALT}33`,
                }}
              >
                <span style={{ color: COBALT, marginRight: 8 }}>✦</span>
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
