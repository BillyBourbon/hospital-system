/* eslint-disable capitalized-comments */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../scripts/auth';
import styles from './login.module.css';

export default function LoginPage(searchParams) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState('patient');

  const loginUser = async (e, { searchParams }) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    // const { accountType } = await searchParams;

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('password').value;

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    // Send login credentials to api
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, accountType }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.user);
        router.push('/dashboard');
        window.location.reload();
      } else {
        setErrors({ api: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Error: ', error);
      setErrors({ api: 'Network error. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <form className={styles.form}>
          <h2 className={styles.heading}>Login</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="userEmail">Email Address</label>
            <input
              type="text"
              id="userEmail"
              name="userEmail"
              placeholder="Email Address"
              required
            />
          </div>
          {errors.email && <div className="error">{errors.email}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Gender</label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={`${styles.toggleButton} ${accountType === 'patient' ? styles.active : ''}`}
                onClick={() => setAccountType('patient')}
              >
                Patient
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${accountType === 'staff' ? styles.active : ''}`}
                onClick={() => setAccountType('staff')}
              >
                Staff
              </button>
            </div>
          </div>

          {errors.password && <div className="error">{errors.password}</div>}

          <div className={styles.subHeading}>
            <a href="/forgotPassword">Forgot Password?</a>
          </div>
          {errors.api && <div className="error">{errors.api}</div>}

          <button
            className={styles.submitButton}
            disabled={isLoading}
            onClick={(e) => loginUser(e, searchParams)}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
