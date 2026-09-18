"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import officeImage from "./imports/garvit-office-comic__1_.jpg";

const officeImageUrl =
  typeof officeImage === "string"
    ? officeImage
    : (officeImage as unknown as { src: string }).src;

type Panel = "contact" | "dossier" | "skills" | "journey" | "global" | null;
type ReactionState = "idle" | "talking" | "drinking" | "writing" | "thinking" | "confident";

// --- SELF-CONTAINED CHARACTER COMPONENT ---
interface CharacterProps {
  reaction: ReactionState;
  isWarm: boolean;
}

function CharacterAvatar({ reaction, isWarm }: CharacterProps) {
  return (
    <motion.div
      className={`character-component-wrapper reaction-${reaction} ${isWarm ? "warm-lit" : ""}`}
      animate={
        reaction === "drinking"
          ? { scale: 1.035, y: -6, rotate: 0.4 }
          : reaction === "confident"
          ? { scale: 1.02, y: -3 }
          : { scale: 1, y: 0, rotate: 0 }
      }
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      aria-hidden="true"
    >
      <div className="character-portrait-art" />
      <div className="character-facial-articulation">
        <span className="part-eyes" />
        <span className="part-mouth" />
      </div>
      <div className="character-props-articulation">
        <div className="drink-arm">
          <div className="drink-hand">
            <div className="drink-glass">
              <i className="liquid-surface" />
            </div>
          </div>
        </div>
      </div>
      {reaction === "drinking" && (
        <div className="comic-bubble-action">*Sipping Reserve*</div>
      )}
      {reaction === "writing" && (
        <div className="comic-bubble-action">*Logging Details*</div>
      )}
    </motion.div>
  );
}

const responses = {
  skills:
    "I build sharp digital experiences with React, TypeScript, product strategy, and an eye for motion. Clean code, cleaner alibis.",
  projects:
    "The dossier holds the evidence: product interfaces, immersive web experiences, and systems designed to make difficult work feel effortless.",
  background:
    "Garvit Chawla — designer, developer, and digital problem-solver. I turn ambitious ideas into products people remember.",
  contact:
    "For serious business, tap the telephone on my desk. The line is secure.",
  default:
    "Interesting question. Around here, every problem has an angle. I bring design, technology, and strategy together to find it.",
};

const projects = [
  {
    number: "01",
    title: "Florista",
    type: "PLANTS / AI / MARKETPLACE",
    copy: "A plant-focused platform combining monitoring, marketplace flows, and AI-assisted disease detection.",
  },
  {
    number: "02",
    title: "Leo",
    type: "OFFLINE AI / DESKTOP",
    copy: "An offline desktop assistant shaped around voice, retrieval, memory, and practical automation.",
  },
  {
    number: "03",
    title: "Systems in the Dark",
    type: "FULL-STACK / EXPERIMENTAL",
    copy: "Interactive software experiences where thoughtful architecture and clear interfaces meet.",
  },
];

function getReply(question: string) {
  const query = question.toLowerCase();
  if (/(skill|stack|technology|code|react)/.test(query)) return responses.skills;
  if (/(project|work|portfolio|built|case)/.test(query))
    return responses.projects;
  if (/(who|background|about|experience|garvit)/.test(query))
    return responses.background;
  if (/(contact|email|phone|hire|reach)/.test(query))
    return responses.contact;
  return responses.default;
}

export default function App() {
  const [intro, setIntro] = useState(true);
  const [warm, setWarm] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [sipping, setSipping] = useState(false);
  const [reaction, setReaction] = useState<ReactionState>("idle");
  const [typedReply, setTypedReply] = useState("");
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [discovery, setDiscovery] = useState("Look around. The office keeps good records.");
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState(
    "Welcome to my office. Look around — everything on this desk has a story. Ask the right question, and I might tell you mine.",
  );
  const [thinking, setThinking] = useState(false);
  const sipTimer = useRef<number | undefined>(undefined);
  const typingTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.clearInterval(typingTimer.current);
    setTypedReply("");
    let index = 0;
    typingTimer.current = window.setInterval(() => {
      index += 1;
      setTypedReply(reply.slice(0, index));
      if (index >= reply.length) {
        window.clearInterval(typingTimer.current);
        setReaction((current: ReactionState) => (current === "drinking" ? current : "idle"));
      }
    }, 18);
    return () => window.clearInterval(typingTimer.current);
  }, [reply]);

  useEffect(() => {
    const idleTimer = window.setTimeout(() => {
      setDiscovery("You can click things, you know.");
    }, 6500);
    return () => window.clearTimeout(idleTimer);
  }, [reply, panel]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    const answer = getReply(question);
    setThinking(true);
    setReaction("thinking");
    setReply("");
    setQuestion("");
    window.setTimeout(() => {
      setReply(answer);
      setThinking(false);
      setReaction("talking");
    }, 420);
  }

  function takeSip() {
    window.clearTimeout(sipTimer.current);
    setSipping(true);
    setReaction("drinking");
    setDiscovery("A measured pour. Patience, then a decisive finish.");
    setReply(
      "A measured pour. Good work, like good whiskey, needs patience and a decisive finish.",
    );
    sipTimer.current = window.setTimeout(() => {
      setSipping(false);
      setReaction("idle");
    }, 2600);
  }

  function react(message: string, nextReaction: ReactionState = "thinking") {
    setDiscovery(message);
    setReply(message);
    setReaction(nextReaction);
  }

  function moveCamera(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setCamera({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.1,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.7,
    });
  }

  return (
    <main className={`office-app ${warm ? "is-warm" : ""}`}>
      <motion.div
        className="scene"
        style={{ backgroundImage: `url(${officeImageUrl})` }}
        onPointerMove={moveCamera}
        onPointerLeave={() => setCamera({ x: 0, y: 0 })}
        animate={
          sipping
            ? { scale: 1.035, x: "-0.5%", y: "-0.3%" }
            : { scale: 1, x: `${camera.x}%`, y: `${camera.y}%` }
        }
        transition={{ type: "spring", stiffness: 55, damping: 18, mass: 0.6 }}
        role="img"
        aria-label="Comic-noir executive office with Garvit Chawla seated behind a mahogany desk"
      >
        <div className="vignette" />
        <div className="grain" />
        <div className="smoke smoke-one" />
        <div className="smoke smoke-two" />

        {/* Character Component rendered inline */}
        <CharacterAvatar reaction={reaction} isWarm={warm} />

        <header className="topbar">
          <div className="monogram">GC</div>
          <div className="office-status">
            <span className="status-light" />
            OFFICE HOURS · OPEN
          </div>
        </header>

        <motion.div
          className="speech"
          aria-live="polite"
          initial={{ opacity: 0, x: -24, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: -1 }}
          transition={{ delay: 2.2, duration: 0.65, ease: "easeOut" }}
        >
          <span className="speech-kicker">A WORD FROM THE BOSS</span>
          <p>{thinking ? "Let me think..." : typedReply}</p>
        </motion.div>

        <button
          className="hotspot lamp-hotspot"
          onClick={() => {
            setWarm((value) => !value);
            const message =
              warm
                ? "Back to the shadows. Some ideas need the dark."
                : "A little light changes the whole story.";
            react(message, "idle");
          }}
          aria-label="Toggle the brass desk lamp"
        >
          <span>DESK LAMP</span>
        </button>

        <button
          className="hotspot phone-hotspot"
          onClick={() => {
            setPanel("contact");
            react("The secure line is open. Keep it professional.");
          }}
          aria-label="Open contact details"
        >
          <span>SECURE LINE</span>
        </button>

        <button
          className="hotspot glass-hotspot"
          onClick={takeSip}
          aria-label="Offer Garvit the whiskey glass"
        >
          <span>TAKE A SIP</span>
        </button>

        <button
          className="hotspot files-hotspot"
          onClick={() => {
            setPanel("dossier");
            react("The files are on the table. Read between the lines.");
          }}
          aria-label="Open the project dossier"
        >
          <span>OPEN DOSSIER</span>
        </button>

        <button className="hotspot pen-hotspot" onClick={() => react("Some things still deserve to be written by hand.", "writing")} aria-label="Pick up the fountain pen">
          <span>WRITE A NOTE</span>
        </button>
        <button className="hotspot nameplate-hotspot" onClick={() => react("GARVIT CHAWLA. SOFTWARE ENGINEER. BUILDER. AI ENTHUSIAST.", "confident")} aria-label="Inspect the nameplate">
          <span>THE BOSS</span>
        </button>
        <button className="hotspot globe-hotspot" onClick={() => setPanel("global")} aria-label="Open the global mindset note">
          <span>GLOBAL MINDSET</span>
        </button>
        <button className="hotspot books-hotspot" onClick={() => setPanel("skills")} aria-label="Open the technology stack">
          <span>TECH STACK</span>
        </button>
        <button className="hotspot map-hotspot" onClick={() => setPanel("journey")} aria-label="Open the builder journey">
          <span>THE JOURNEY</span>
        </button>

        <div className={`sip-note ${sipping ? "visible" : ""}`}>
          <span>THE BOSS TAKES A MOMENT</span>
        </div>

        <div className="discovery-note" aria-live="polite">{discovery}</div>

        <section className="dialogue" aria-label="Ask Garvit a question">
          <div className="speaker">
            <span>GARVIT CHAWLA</span>
            <small>DESIGNER · DEVELOPER · PROBLEM SOLVER</small>
          </div>
          <form onSubmit={submitQuestion}>
            <label htmlFor="question">ASK ME ANYTHING</label>
            <div className="input-wrap">
              <input
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What do you want to know?"
                autoComplete="off"
              />
              <button type="submit" aria-label="Send question">
                SEND
              </button>
            </div>
          </form>
        </section>
      </motion.div>

      <AnimatePresence>
        {panel && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPanel(null);
            }}
          >
            <motion.section
              className={`modal ${panel === "dossier" ? "dossier" : "contact"}`}
              initial={{ opacity: 0, y: 40, rotateX: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                className="modal-close"
                onClick={() => setPanel(null)}
                aria-label="Close"
              >
                CLOSE ×
              </button>

              {panel === "contact" ? (
                <>
                  <p className="eyebrow">THE SECURE LINE</p>
                  <h2 id="modal-title">Let&apos;s talk business.</h2>
                  <p className="modal-intro">
                    Have an ambitious idea? Put it on the table. The first
                    conversation is always off the record.
                  </p>
                  <div className="contact-list">
                    <div><span>EMAIL</span>Use the contact details supplied with your application.</div>
                    <div><span>AVAILABILITY</span>Software engineering, AI projects, and thoughtful collaborations.</div>
                  </div>
                  <p className="fine-print">
                    AVAILABLE FOR SELECT FREELANCE &amp; PRODUCT COLLABORATIONS
                  </p>
                </>
              ) : panel === "skills" ? (
                <>
                  <p className="eyebrow">THE BOOKS KEEP SECRETS</p>
                  <h2 id="modal-title">Technology Stack</h2>
                  <p className="modal-intro">Java, Python, JavaScript, React, Next.js, Spring Boot, Node.js, MongoDB, MySQL, PostgreSQL, LangGraph, RAG, Ollama, and LLM systems.</p>
                </>
              ) : panel === "journey" ? (
                <>
                  <p className="eyebrow">THE BUILDER&apos;S JOURNEY</p>
                  <h2 id="modal-title">Always moving forward.</h2>
                  <p className="modal-intro">From full-stack systems to AI assistants and interactive experiences, the work follows curiosity wherever it leads.</p>
                </>
              ) : panel === "global" ? (
                <>
                  <p className="eyebrow">GLOBAL MINDSET</p>
                  <h2 id="modal-title">Build beyond the room.</h2>
                  <p className="modal-intro">Good software travels. The goal is to make complex ideas feel immediate, useful, and human wherever they land.</p>
                </>
              ) : (
                <>
                  <p className="eyebrow">CONFIDENTIAL · CASE FILE 24-07</p>
                  <h2 id="modal-title">About Me &amp; Projects</h2>
                  <p className="modal-intro">
                    I design and build memorable digital products where strong
                    ideas, elegant systems, and precise execution meet.
                  </p>
                  <div className="project-grid">
                    {projects.map((project) => (
                      <article key={project.number}>
                        <div className="project-meta">
                          <span>{project.number}</span>
                          {project.type}
                        </div>
                        <h3>{project.title}</h3>
                        <p>{project.copy}</p>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {intro && (
          <motion.div
            className="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
          >
            <motion.div
              className="intro-bg"
              style={{ backgroundImage: `url(${officeImageUrl})` }}
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <div className="intro-mark">GC</div>
            <p>LOADING ENVIRONMENT...</p>
            <div className="loading-line">
              <span />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}