'use client';
import { useEffect, useState } from 'react';
import styles from '../dashboard.module.css';

export default function ManageAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState('Male');
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState(false);
  const [accountData, setAccountData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    age: '',
    phoneNumber: '',
    country: '',
    county: '',
    city: '',
    road_name: '',
    building_number: '',
    post_code: '',
  });
  const [password, setPassword] = useState(null);
  const [userId, setUserId] = useState(null);
  const [updateAccountMessage, setUpdateAccountMessage] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
      });

      const { session } = await response.json();

      return session?.user || null;
    };

    const fetchAccountDetails = async () => {
      const { id, role } = await fetchSession();
      const response = await fetch(`/api/user?userId=${id}`, {
        method: 'GET',
      });
      if (response.ok) {
        const { data } = await response.json();
        const newData = { ...accountData };

        Object.entries(data).forEach(([key, value]) => {
          insertArrayOfKeyValuesToObject([[key, value]], newData);
        });

        setGender(newData.gender);
        setAccountData(newData);
        setUserId(id);

        setIsLoaded(true);
      } else {
        setErrors('Unable to fetch account');
      }
    };

    fetchAccountDetails();
  }, []);

  const inputIntoObject = (e) => {
    const { value, name: key } = e.target;
    const newData = { ...accountData };
    insertArrayOfKeyValuesToObject([[key, value]], newData);

    setAccountData(newData);
  };

  const updateUsersAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const requestData = {
      accountData,
      password,
      userId,
    };

    const response = await fetch('/api/user/update', {
      method: 'POST',
      headers: {
        contentType: 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      setUpdateAccountMessage('Account Updated Successfully');
      setIsLoaded(true);
      setIsLoading(false);
    } else {
      const { message } = await response.json();
      setUpdateAccountMessage(message);
      setIsLoaded(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoaded && (
        <>
          <h2>Manage Account</h2>
          <form className={styles.form} onSubmit={updateUsersAccount}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={inputIntoObject}
                value={accountData.firstName || ''}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                onChange={inputIntoObject}
                value={accountData.middleName || ''}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={inputIntoObject}
                value={accountData.lastName || ''}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                onChange={inputIntoObject}
                value={accountData.phoneNumber || ''}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="age">Age</label>
              <select
                id="age"
                name="age"
                onChange={inputIntoObject}
                value={accountData.age || 0}
              >
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
            <div>
              {[
                'building_number',
                'road_name',
                'city',
                'county',
                'country',
                'post_code',
              ].map((field) => (
                <div className={styles.inputGroup} key={field}>
                  <label htmlFor={field}>
                    {field
                      .split('_')
                      .map(
                        (w) => `${w.charAt(0).toUpperCase()}${w.substring(1)} `,
                      )}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={accountData[field] || ''}
                    onChange={inputIntoObject}
                    required
                  />
                </div>
              ))}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Enter Password To Update Account</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Updating Account...' : 'Update Account'}
            </button>
            {updateAccountMessage && <p>{updateAccountMessage}</p>}
          </form>
        </>
      )}
      {errors && (
        <div>
          <p>{errors}</p>
        </div>
      )}
    </div>
  );
}

// Takes an array of [key, value] and inserts them into an object.
// Meant to make my life easier by letting me send it a key with a dot and it then split it and nest it properly
function insertArrayOfKeyValuesToObject(keyValueArray, object = {}) {
  keyValueArray.forEach(([key, value]) => {
    const parts = key.trim().split('.');
    let current = object;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = value;
      } else {
        if (!current[part] || typeof current[part] !== 'object')
          current[part] = {};
        current = current[part];
      }
    });
  });

  return object;
}
