"use client";

import React, { useState, useEffect } from "react";
import styles from "./GridEditor.module.css";

type CellType = "empty" | "wall";

type Cell = {
  row: number;
  col: number;
  type: CellType;
};

type GridEditorProps = {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  start: { row: number; col: number };
  end: { row: number; col: number };
  path: { row: number; col: number }[] | null;
};

export default function GridEditor({
  grid,
  setGrid,
  start,
  end,
  path,
}: GridEditorProps) {
  const [isDrawing, setIsDrawing] = useState(false);

  const toggleCell = (row: number, col: number) => {
    if (
      (row === start.row && col === start.col) ||
      (row === end.row && col === end.col)
    )
      return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      newGrid[row][col].type =
        newGrid[row][col].type === "wall" ? "empty" : "wall";
      return newGrid;
    });
  };

  const handleMouseDown = (row: number, col: number) => {
    toggleCell(row, col);
    setIsDrawing(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
        if (
          (row === start.row && col === start.col) ||
          (row === end.row && col === end.col)
        )
          return newGrid;

        newGrid[row][col].type = "wall";
        return newGrid;
      });
    }
  };

  useEffect(() => {
    const stopDrawing = () => setIsDrawing(false);
    window.addEventListener("mouseup", stopDrawing);
    return () => window.removeEventListener("mouseup", stopDrawing);
  }, []);

  const isOnPath = (row: number, col: number) => {
    if (!path) return false;
    return path.some((p) => p.row === row && p.col === col);
  };

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateRows: `repeat(${grid.length}, 25px)`,
        gridTemplateColumns: `repeat(${grid[0].length}, 25px)`,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          let className = styles.cell;
          if (cell.type === "wall") className = `${styles.cell} ${styles.wall}`;
          if (r === start.row && c === start.col) className = `${styles.cell} ${styles.start}`;
          if (r === end.row && c === end.col) className = `${styles.cell} ${styles.end}`;
          if (isOnPath(r, c)) className = `${styles.cell} ${styles.path}`;

          return (
            <div
              key={`${r}-${c}`}
              className={className}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
            />
          );
        })
      )}
    </div>
  );
}
