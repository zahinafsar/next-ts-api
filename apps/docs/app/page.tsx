import styles from './hero.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>Next-TS-API</span>
            <span className={styles.titleLine}>Type-Safe API Routes</span>
          </h1>
          <p className={styles.subtitle}>
            End-to-end type safety for Next.js API routes with zero
            configuration
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/docs">
              <button className={`${styles.button} ${styles.primary}`}>
                Get Started
              </button>
            </Link>
            <a href="https://github.com/zahinafsar/next-ts-api">
              <button className={`${styles.button} ${styles.secondary}`}>
                View on GitHub
              </button>
            </a>
          </div>
        </div>
        <div className={styles.decorativeElements}>
          <div className={styles.circle}></div>
          <div className={styles.square}></div>
          <div className={styles.triangle}></div>
        </div>
      </section>
    </div>
  );
}
