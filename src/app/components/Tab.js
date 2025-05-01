'use client';

import { useState } from 'react';
import styles from './Tabs.module.css';

export default function Tab({ title, children: tabChildren }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.tabSection}>
      <button className={styles.tabHeader} onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && tabChildren && (
        <div className={styles.tabContent}>{tabChildren}</div>
      )}
    </div>
  );
}
