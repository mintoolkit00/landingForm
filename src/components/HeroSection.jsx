import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h2 className={styles.title}>Build fast. Get feedback faster.</h2>
        <p className={styles.subtitle}>
          A minimal landing page template with Netlify Functions to collect
          feedback — no backend needed.
        </p>
        <a href="#contact" className={styles.cta}>
          Leave Your Feedback
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
