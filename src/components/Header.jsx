import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>LandingForm</h1>
        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <a href="#booking">Booking</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
