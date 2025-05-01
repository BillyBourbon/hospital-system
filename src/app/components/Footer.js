import styles from './footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>&copy; {new Date().getFullYear()}</p>
    </div>
  );
};

export default Footer;
