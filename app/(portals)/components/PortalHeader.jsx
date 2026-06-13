"use client";

// Portal app shell header. The portal you're in is determined ONLY by the
// logged-in account's role — there is no free role switcher. To change role,
// log out and sign in with a different account.

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./PortalHeader.module.css";

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function AccountArea() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setUser(data?.user || null);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore — redirect regardless */
    }
    window.location.href = "/login";
  }

  if (!ready) {
    return <div className={styles.account} aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className={styles.account}>
        <Link href="/login" className={styles.loginLink}>
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.account}>
      <span className={styles.avatar} aria-hidden="true">
        {initials(user.name)}
      </span>
      <span className={styles.accountInfo}>
        <span className={styles.accountName}>{user.name}</span>
        <span className={styles.roleChip}>{user.role}</span>
      </span>
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default function PortalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={`p-display gradient-text ${styles.wordmark}`}>
          Thayya<span className={styles.tm}>™</span>
        </Link>
        <div className={styles.right}>
          <AccountArea />
        </div>
      </div>
      <div className={styles.strip}>
        <span>Move · Rise · Shine</span>
      </div>
    </header>
  );
}
