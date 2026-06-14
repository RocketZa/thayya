import styles from "./PortalLoading.module.css";

// Branded skeleton shown instantly during portal navigation (Next.js
// loading.jsx) while the dynamic page server-renders. No data, no DB —
// it paints immediately so a click never feels frozen.
export default function PortalLoading({ cards = 6 }) {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading">
      <div className={styles.head}>
        <div className={`${styles.block} ${styles.overline}`} />
        <div className={`${styles.block} ${styles.title}`} />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={`${styles.block} ${styles.cardBar} ${styles.w70}`} />
            <div className={`${styles.block} ${styles.grow}`} />
            <div className={`${styles.block} ${styles.cardBar} ${styles.w50}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
