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
} from "lucide-react";

// ───────────────────────────────────────────────────────────────────
// THE OAK ROOM HOUSTON — at The Post Oak Hotel, a Fertitta property
// Graphite + Carrara marble • cobalt accents
// ───────────────────────────────────────────────────────────────────

const COBALT = "#2E6B8A";        // the accent — sharp, electric, alive
const COBALT_DEEP = "#1E4D66";
const GRAPHITE = "#1C1D20";      // primary surface
const GRAPHITE_2 = "#26282C";    // raised surface
const CHARCOAL = "#0F1012";      // deepest
const MARBLE = "#F4F1EA";        // off-white, warm
const MARBLE_2 = "#E8E3D8";      // veined shadow
const VEIN = "#9AA3AE";          // cool grey vein
const TEXT_DIM = "#8B8E94";

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
        style={{ color: VEIN, fontFamily: fontStack.body }}
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
      <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
        <p className="mt-4 text-right text-[10px] tracking-[0.3em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
                <p className="text-[8px] tracking-[0.3em]" style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}>
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
          <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
          <p className="text-[9px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
            Upcoming
          </p>
          <h1
            className="text-3xl leading-none mt-1"
            style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            The book of <em style={{ color: COBALT }}>hours</em>
          </h1>
        </div>
        <span className="text-[9px] tracking-[0.3em] uppercase pb-1" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
                  className="text-[8px] tracking-[0.3em]"
                  style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}
                >
                  {e.date}
                </p>
                <p className="text-[8px] tracking-[0.3em] mt-0.5" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
                style={{ color: VEIN, border: `1px solid ${VEIN}55` }}
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
                    <span style={{ color: VEIN }}>Host</span>
                    <span style={{ color: MARBLE + "CC" }}>{expanded.host}</span>
                  </div>
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: fontStack.body }}>
                    <span style={{ color: VEIN }}>Details</span>
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
      <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
              <p className="text-[10px] tracking-[0.2em] mt-1" style={{ color: VEIN, fontFamily: fontStack.mono }}>
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

const MembershipScreen = () => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
        background: `
          linear-gradient(135deg, ${MARBLE} 0%, ${MARBLE_2} 100%)
        `,
        boxShadow: `
          0 30px 60px -30px rgba(0,0,0,0.6),
          0 0 0 1px rgba(0,0,0,0.08),
          inset 0 1px 0 rgba(255,255,255,0.6)
        `,
      }}
    >
      {/* marble veining — soft diagonal striations */}
      <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 252">
        <defs>
          <filter id="marbleBlur"><feGaussianBlur stdDeviation="1.2" /></filter>
        </defs>
        <g filter="url(#marbleBlur)" stroke={VEIN} fill="none" strokeWidth="0.6" opacity="0.5">
          <path d="M -20 60 Q 100 40 220 90 T 420 70" />
          <path d="M -20 130 Q 80 160 200 140 T 420 170" strokeWidth="0.4" />
          <path d="M 30 -10 Q 80 80 160 120 T 280 250" strokeWidth="0.3" />
          <path d="M 200 -10 Q 240 60 280 100 T 380 260" strokeWidth="0.4" />
        </g>
        <g stroke={VEIN} fill="none" strokeWidth="0.3" opacity="0.3">
          <path d="M 0 50 Q 100 55 200 50 T 400 60" />
          <path d="M 0 200 Q 100 195 200 200 T 400 195" />
        </g>
      </svg>

      {/* cobalt edge inlay — top + bottom hairlines */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: COBALT }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: COBALT }} />

      <div className="relative flex flex-col h-full justify-between p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[8px] tracking-[0.5em] uppercase" style={{ color: GRAPHITE, fontFamily: fontStack.body, fontWeight: 500 }}>
              The Oak Room
            </p>
            <p className="text-[8px] tracking-[0.4em] uppercase mt-0.5" style={{ color: TEXT_DIM, fontFamily: fontStack.body }}>
              The Post Oak Hotel · Houston
            </p>
          </div>
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ background: COBALT, color: MARBLE, fontFamily: fontStack.display, fontSize: 20, fontStyle: "italic" }}
          >
            O
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: COBALT, fontFamily: fontStack.body, fontWeight: 500 }}>
            {MEMBER.tier} · {MEMBER.memberNo}
          </p>
          <p
            className="text-2xl mt-1"
            style={{ fontFamily: fontStack.display, color: GRAPHITE, fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            {MEMBER.name}
          </p>
          <div className="flex items-end justify-between mt-3">
            <p className="text-[9px] tracking-[0.3em]" style={{ color: GRAPHITE, fontFamily: fontStack.mono }}>
              {MEMBER.cardCode}
            </p>
            <p className="text-[8px] tracking-[0.4em] uppercase" style={{ color: TEXT_DIM, fontFamily: fontStack.body }}>
              Mem. {MEMBER.joined}
            </p>
          </div>
        </div>
      </div>
    </motion.div>

    <p className="text-[10px] tracking-[0.3em] uppercase mt-3 text-center" style={{ color: VEIN, fontFamily: fontStack.body }}>
      Tap the card at reception
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

    <div className="mt-10 pt-6 text-center" style={{ borderTop: `1px solid ${VEIN}22` }}>
      <p className="text-[8px] tracking-[0.6em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
        A Fertitta property
      </p>
      <p className="text-[10px] mt-2 italic" style={{ color: TEXT_DIM, fontFamily: fontStack.display }}>
        Owned & operated by the Fertitta family
      </p>
    </div>
  </div>
);

const BillingScreen = () => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
      The ledger
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      Your <em style={{ color: COBALT }}>account</em>
    </h1>

    <div className="mt-6 p-5 text-center" style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}55` }}>
      <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
        Current balance · due May 31
      </p>
      <p className="text-5xl mt-2" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
        $1,284<span style={{ color: VEIN, fontSize: 28 }}>.50</span>
      </p>
      <div className="mt-4 flex gap-2 justify-center">
        <BrassButton>Settle now</BrassButton>
        <BrassButton variant="ghost">Auto-pay</BrassButton>
      </div>
    </div>

    <Divider label="Recent" />

    <div className="space-y-4">
      {[
        { d: "Apr 28", what: "Mastro's · party of 4", amt: "428.00" },
        { d: "Apr 24", what: "Post Oak Saloon · bar tab", amt: "186.50" },
        { d: "Apr 18", what: "Bouchée Patisserie · brunch", amt: "120.00" },
        { d: "Apr 12", what: "Founders' dues · monthly", amt: "850.00", credit: true },
        { d: "Apr 5", what: "House credit applied", amt: "−400.00", positive: true },
      ].map((t, i) => (
        <div key={i} className="flex justify-between items-baseline">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
  </div>
);

const ReserveScreen = () => (
  <div className="px-6 pt-3 pb-32">
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
      A table, a corner, a room
    </p>
    <h1 className="text-4xl mt-2 leading-none" style={{ fontFamily: fontStack.display, color: MARBLE, fontWeight: 400 }}>
      <em style={{ color: COBALT }}>Reserve</em>
    </h1>

    <div className="flex gap-2 mt-5 overflow-x-auto pb-2">
      {["Tonight", "Tomorrow", "Fri", "Sat", "Sun"].map((d, i) => (
        <button
          key={d}
          className="px-4 py-2.5 text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
          style={{
            color: i === 0 ? GRAPHITE : COBALT,
            background: i === 0 ? COBALT : "transparent",
            border: `1px solid ${VEIN}`,
            fontFamily: fontStack.body,
          }}
        >
          {d}
        </button>
      ))}
    </div>

    <Divider label="Available · party of 2" />

    <div className="space-y-4">
      {RESERVATIONS_AVAIL.map((r) => (
        <div key={r.room} className="p-4" style={{ background: GRAPHITE_2, border: `1px solid ${VEIN}33` }}>
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="text-xl" style={{ fontFamily: fontStack.display, color: MARBLE }}>{r.room}</h3>
              <p className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
    <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
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
    <p className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: VEIN, fontFamily: fontStack.body }}>
      — The Membership Committee
    </p>

    <div className="mt-10 pt-6 text-center" style={{ borderTop: `1px solid ${VEIN}22` }}>
      <p className="text-[8px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
        RSVP & Concierge
      </p>
      <p className="text-base mt-2" style={{ color: MARBLE, fontFamily: fontStack.mono, letterSpacing: "0.1em" }}>
        713.386.2500
      </p>
      <p className="text-[10px] mt-1" style={{ color: TEXT_DIM, fontFamily: fontStack.mono }}>
        Events@OakRoomHouston.com
      </p>
      <p className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: VEIN, fontFamily: fontStack.body }}>
        @TheOakRoomHouston
      </p>
    </div>
  </div>
);

// ─── App shell ─────────────────────────────────────────────────────
const TABS = [
  { id: "foryou", label: "For You", Icon: Sparkles },
  { id: "home", label: "Events", Icon: Calendar },
  { id: "guests", label: "Guests", Icon: UserPlus },
  { id: "reserve", label: "Reserve", Icon: Wine },
  { id: "card", label: "Member", Icon: Users },
  { id: "rules", label: "House", Icon: BookOpen },
  { id: "billing", label: "Ledger", Icon: CreditCard },
];

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
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, rsvp: !e.rsvp } : e))
    );
    const ev = events.find((e) => e.id === id);
    showToast(ev.rsvp ? "Reservation released" : "Reserved · check Ledger");
  };

  const handleAddGuest = (name, phone) => {
    setGuests((prev) => [
      ...prev,
      {
        id: Date.now(),
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
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, ${COBALT}18 0%, transparent 50%),
          radial-gradient(ellipse at bottom, ${GRAPHITE_2} 0%, ${CHARCOAL} 60%, #000 100%)
        `,
        fontFamily: fontStack.body,
      }}
    >
      {/* Google fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter+Tight:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />

      {/* Phone frame */}
      <div
        className="relative mx-auto"
        style={{
          width: "min(420px, 100%)",
          height: "min(880px, 95vh)",
          background: GRAPHITE,
          borderRadius: 44,
          padding: 12,
          boxShadow: `
            0 0 0 2px ${VEIN}44,
            0 40px 80px -20px ${COBALT}22,
            0 0 100px -20px ${COBALT}11
          `,
          border: `1px solid ${VEIN}66`,
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden flex flex-col"
          style={{
            background: GRAPHITE,
            borderRadius: 32,
          }}
        >
          {/* Status bar / header */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
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

          {/* Title bar */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${VEIN}22` }}>
            <div>
              <p className="text-[8px] tracking-[0.5em] uppercase" style={{ color: VEIN, fontFamily: fontStack.body }}>
                Member · {MEMBER.tier}
              </p>
              <p className="text-lg leading-none mt-1" style={{ fontFamily: fontStack.display, color: MARBLE, fontStyle: "italic" }}>
                Oak Room Houston
              </p>
            </div>
            <button className="relative" style={{ color: COBALT }}>
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
                {tab === "guests" && <GuestsScreen guests={guests} onAdd={handleAddGuest} />}
                {tab === "card" && <MembershipScreen />}
                {tab === "billing" && <BillingScreen />}
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

          {/* Tab bar */}
          <div
            className="flex-shrink-0 flex items-center justify-around px-2 pb-5 pt-3"
            style={{
              background: `linear-gradient(180deg, transparent, ${GRAPHITE} 30%)`,
              borderTop: `1px solid ${VEIN}33`,
            }}
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex flex-col items-center gap-1 py-1 px-1 transition-all"
                  style={{ color: active ? COBALT : MARBLE + "55" }}
                >
                  <Icon size={16} strokeWidth={active ? 2 : 1.5} />
                  <span
                    className="text-[8px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: fontStack.body, fontWeight: active ? 500 : 300 }}
                  >
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="tab-dot"
                      className="w-1 h-1 rounded-full"
                      style={{ background: COBALT }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
