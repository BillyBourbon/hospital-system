'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/navigation';
import { logout } from '../scripts/auth';

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
      });

      const { session } = await response.json();

      setRoleId(session?.user?.role || null);
    };

    fetchSession();
  }, []);

  const pagesSignedOut = [
    { link: '/login', title: 'Login' },
    { link: '/signup', title: 'Sign Up' },
  ];
  const pagesPatient = [
    { link: '/dashboard/appointment_history', title: 'Appointments' },
    { link: '/dashboard', title: 'Dashboard' },
  ];
  const pagesStaff = [
    { link: '/dashboard/appointment_history', title: 'Appointments' },
    { link: '/dashboard', title: 'Dashboard' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
    window.location.reload();
  };

  const buildNav = (pages) => {
    return pages.map((page, index) => (
      <li key={index}>
        <button className={styles.button}>
          <Link href={page.link} onClick={() => setMenuOpen(false)}>
            {page.title}
          </Link>
        </button>
      </li>
    ));
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/logos/downloadIcon.png"
            alt="HospitalSystemLogo"
            width={40}
            height={40}
          />
        </Link>
      </div>

      <button
        className={styles.burger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
        {/* {roleId === null &&
          pagesSignedOut.map((page, index) => (
            <li key={index}>
              <Link href={page.link} onClick={() => setMenuOpen(false)}>
                {page.title}
              </Link>
            </li>
          ))} */}

        {/* {roleId === 1 &&
          pagesPatient.map((page, index) => (
            <li key={index}>
              <Link href={page.link} onClick={() => setMenuOpen(false)}>
                {page.title}
              </Link>
            </li>
          ))} */}

        {roleId === null && buildNav(pagesSignedOut)}
        {roleId === 1 && buildNav(pagesPatient)}
        {roleId === 2 && buildNav(pagesStaff)}

        {roleId !== null && (
          <li>
            <button className={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
