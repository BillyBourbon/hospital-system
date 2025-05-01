import Link from 'next/link';
import styles from './home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Hospital System</h1>
      <p className={styles.subtitle}>
        Empowering patients and staff with seamless access to healthcare
        management.
      </p>

      <div className={styles.loginMenu}>
        <Link href={{ pathname: '/login' }} className={styles.btn}>
          Login
        </Link>
        {/* <Link
          href={{ pathname: '/login', query: { accountType: 'staff' } }}
          className={styles.btn}
        >
          Login as Staff
        </Link> */}
        <Link
          href={{ pathname: '/signup', query: { accountType: 'patient' } }}
          className={styles.btnOutline}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
