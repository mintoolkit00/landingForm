import styles from "./DetailsSection.module.css";

const DetailsSection = () => {
  return (
    <section className={styles.details} id="features">
      <div className={styles.container}>
        <h3 className={styles.title}>Why use this template?</h3>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h4>No backend needed</h4>
            <p>
              Use Netlify Functions to collect and process feedback directly
              from your landing.
            </p>
          </div>
          <div className={styles.feature}>
            <h4>Quick to deploy</h4>
            <p>
              Built with Vite + React. Deploy to Netlify in minutes and start
              collecting insights.
            </p>
          </div>
          <div className={styles.feature}>
            <h4>Easy to customize</h4>
            <p>
              Modular CSS and a simple structure make it easy to adapt to your
              project.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
