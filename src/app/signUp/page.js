'use client';
import { useState } from 'react';
import styles from './signup.module.css';
import { useRouter } from 'next/navigation';
import { login } from '../scripts/auth';

export default function SignupPage() {
  const [gender, setGender] = useState('Male');
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const signupUser = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const password = document.getElementById('password').value;
    const passwordConfirmation =
      document.getElementById('confirmPassword').value;

    if (password.length <= 8)
      newErrors.password = 'Password Must Be Longer Than 8 Character';

    if (password !== passwordConfirmation)
      newErrors.password = 'Passwords Do Not Match';

    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName')?.value || null;
    const lastName = document.getElementById('lastName').value;

    const age = document.getElementById('age').value;

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    const user = {
      roleId: 1,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      age: age,
      gender: gender,
      email: email,
      phone: phone,
      password: passwordConfirmation,
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      await login(data);
      router.push('/dashboard');
      window.location.reload();
    } catch (error) {
      console.error('Error: ', error);
      setErrors({ api: 'Network error. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={signupUser}>
        <h2 className={styles.heading}>Sign Up</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="firstName">First Name*</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="middleName">Middle Name</label>
          <input type="text" id="middleName" name="middleName" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lastName">Last Name*</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address*</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number*</label>
          <input type="tel" id="phone" name="phone" required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="age">Age*</label>
          <select id="age" name="age" required>
            {Array.from({ length: 121 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Gender</label>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleButton} ${gender === 'Male' ? styles.active : ''}`}
              onClick={() => setGender('Male')}
            >
              Male
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${gender === 'Female' ? styles.active : ''}`}
              onClick={() => setGender('Female')}
            >
              Female
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password*</label>
          <input type="password" id="password" name="password" required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        {errors.password && <div className="error">{errors.password}</div>}

        {errors.api && <div className="error">{errors.api}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
