import type { NextApiRequest, NextApiResponse } from "next";
import { astar, Node } from "../../utils/astar";

type RequestBody = {
  grid: number[][];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { grid, start, end }: RequestBody = req.body;

  if (!grid || !start || !end) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const nodesGrid: Node[][] = grid.map((row, r) =>
    row.map((cell, c) => ({
      x: r,
      y: c,
      walkable: cell === 0,
      f: 0,
      g: 0,
      h: 0,
      parent: null,
    }))
  );

  const startNode = nodesGrid[start.x][start.y];
  const endNode = nodesGrid[end.x][end.y];

  const path = astar(nodesGrid, startNode, endNode);

  if (!path) {
    res.status(200).json({ path: null });
    return;
  }

  res.status(200).json({
    path: path.map((node) => ({ x: node.x, y: node.y })),
  });
}
