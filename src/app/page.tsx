import PathfindingVisualizer from "../components/PathfindingVisualizer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>🧭 Maze Pathfinder</h1>
      <PathfindingVisualizer />
    </main>
  );
}
