import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} LandingForm. Built with ❤️ for
          makers.
        </p>
        <a
          href="https://github.com/tuusuario/landing-form"
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
