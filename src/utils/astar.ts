export type Node = {
  x: number;
  y: number;
  f: number;
  g: number;
  h: number;
  parent: Node | null;
  walkable: boolean;
};

export function astar(grid: Node[][], start: Node, end: Node): Node[] | null {
  const openList: Node[] = [];
  const closedList: Set<string> = new Set();

  function nodeKey(n: Node) {
    return `${n.x},${n.y}`;
  }

  openList.push(start);

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;
    closedList.add(nodeKey(current));

    if (current.x === end.x && current.y === end.y) {
      const path: Node[] = [];
      let curr: Node | null = current;
      while (curr) {
        path.push(curr);
        curr = curr.parent;
      }
      return path.reverse();
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      if (!neighbor.walkable || closedList.has(nodeKey(neighbor))) continue;

      const tentativeG = current.g + 1;
      const inOpenList = openList.find((n) => n.x === neighbor.x && n.y === neighbor.y);

      if (!inOpenList || tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;

        if (!inOpenList) openList.push(neighbor);
      }
    }
  }

  return null;
}

function getNeighbors(grid: Node[][], node: Node): Node[] {
  const directions = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1],
  ];

  return directions
    .map(([dx, dy]) => {
      const x = node.x + dx;
      const y = node.y + dy;
      if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
        return grid[x][y];
      }
      return null;
    })
    .filter((n): n is Node => n !== null);
}

function heuristic(a: Node, b: Node) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
