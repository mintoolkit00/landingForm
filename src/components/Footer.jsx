import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} LandingForm. Built with ❤️ for
          makers.{" "}
          <a
            href="https://x.com/mintoolkit00"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Mintoolkit
          </a>
        </p>
        <a
          href="https://github.com/mintoolkit00/landingForm"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
