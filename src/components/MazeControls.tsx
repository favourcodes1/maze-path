"use client";

import React from "react";
import styles from "./MazeControls.module.css";

type MazeControlsProps = {
  onVisualize: () => void;
  onClear: () => void;
  onRandomWalls: () => void;
};

export default function MazeControls({
  onVisualize,
  onClear,
  onRandomWalls,
}: MazeControlsProps) {
  return (
    <div className={styles.controls}>
      <button className={styles.btn} onClick={onVisualize}>
        Visualize A*
      </button>
      <button className={styles.btn} onClick={onClear}>
        Clear Walls
      </button>
      <button className={styles.btn} onClick={onRandomWalls}>
        Random Walls
      </button>
    </div>
  );
}
