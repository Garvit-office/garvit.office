import React from "react";
import { motion } from "framer-motion";

export type ReactionState = "idle" | "talking" | "drinking" | "writing" | "thinking" | "confident";

interface CharacterProps {
  reaction: ReactionState;
  isWarm: boolean;
}

export default function CharacterAvatar({ reaction, isWarm }: CharacterProps) {
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