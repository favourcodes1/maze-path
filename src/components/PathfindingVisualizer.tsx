"use client";

import React, { useState } from "react";
import GridEditor from "./GridEditor";
import MazeControls from "./MazeControls";
import { astar, Node } from "../utils/astar";

const ROWS = 15;
const COLS = 30;

type CellType = "empty" | "wall";

type Cell = {
  row: number;
  col: number;
  type: CellType;
};

export default function PathfindingVisualizer() {
  const createEmptyGrid = (): Cell[][] =>
    Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => ({ row: r, col: c, type: "empty" }))
    );

  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [start] = useState({ row: 0, col: 0 });
  const [end] = useState({ row: ROWS - 1, col: COLS - 1 });
  const [path, setPath] = useState<{ row: number; col: number }[] | null>(null);

  const clearWalls = () => {
    setGrid(createEmptyGrid());
    setPath(null);
  };

  const randomWalls = () => {
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          type: Math.random() < 0.3 ? "wall" : "empty",
        }))
      )
    );
    setPath(null);
  };

  const visualize = () => {
    const matrix = grid.map((row) => row.map((cell) => (cell.type === "wall" ? 1 : 0)));

    const nodesGrid: Node[][] = matrix.map((row, r) =>
      row.map((val, c) => ({
        x: r,
        y: c,
        walkable: val === 0,
        f: 0,
        g: 0,
        h: 0,
        parent: null,
      }))
    );

    const startNode = nodesGrid[start.row][start.col];
    const endNode = nodesGrid[end.row][end.col];

    const result = astar(nodesGrid, startNode, endNode);

    if (!result) {
      alert("No path found!");
      setPath(null);
      return;
    }

    setPath(result.map((node) => ({ row: node.x, col: node.y })));
  };

  return (
    <>
      <MazeControls
        onVisualize={visualize}
        onClear={clearWalls}
        onRandomWalls={randomWalls}
      />
      <GridEditor grid={grid} setGrid={setGrid} start={start} end={end} path={path} />
    </>
  );
}
