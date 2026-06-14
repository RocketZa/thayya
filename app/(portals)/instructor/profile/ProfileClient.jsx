"use client";

import { useRef, useState } from "react";
import { Camera, Check, AtSign, Play, Palette, Eye } from "lucide-react";
import Link from "next/link";
import Avatar from "../../../components/art/Avatar";
import styles from "./page.module.css";

const DEFAULT_ACCENT = "#e5816c";

export default function ProfileClient({ initial, instructorId, name }) {
  const [form, setForm] = useState(initial);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const accent = form.accentColor && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(form.accentColor)
    ? form.accentColor
    : DEFAULT_ACCENT;

  function set(key, value) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaved(false);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name || "");
      fd.append("tagline", form.tagline || "");
      fd.append("accentColor", form.accentColor || "");
      fd.append("bio", form.bio || "");
      fd.append("style", form.style || "");
      fd.append("city", form.city || "");
      fd.append("instagram", form.instagram || "");
      fd.append("youtube", form.youtube || "");
      if (photoFile) fd.append("photo", photoFile);

      const res = await fetch("/api/instructor/profile", { method: "PATCH", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save your profile.");
        return;
      }
      if (data.profile) {
        setForm(data.profile);
        setPhotoFile(null);
        setPhotoPreview("");
      }
      setSaved(true);
    } catch {
      setError("Network hiccup. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const avatarShown = photoPreview || form.avatarUrl;

  return (
    <div className="p-wrap" style={{ "--accent": accent }}>
      <header className={styles.head}>
        <div>
          <div className="p-overline">Your Portfolio</div>
          <h1 className={`p-display ${styles.title}`}>Edit Profile</h1>
        </div>
        <Link href="/instructor/public" className={`p-pill p-pill-ghost ${styles.previewLink}`}>
          <Eye size={14} /> Preview public page
        </Link>
      </header>
      <p className={styles.blurb}>
        Customise how members see you. Add a photo, a tagline, and an accent colour to make your
        public page your own.
      </p>

      <form className={styles.layout} onSubmit={onSubmit}>
        {/* Photo */}
        <section className={`p-card ${styles.photoCard}`}>
          <div className={styles.sectionHead}>
            <Camera size={16} />
            <span className={styles.sectionLabel}>Profile photo</span>
          </div>
          <div className={styles.photoRow}>
            <div className={styles.photoFrame} style={{ borderColor: accent }}>
              {avatarShown ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarShown} alt="Profile preview" className={styles.photoImg} />
              ) : (
                <Avatar fill seed={instructorId} name={name} rounded="circle" />
              )}
            </div>
            <div className={styles.photoActions}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPickPhoto}
                className={styles.hiddenFile}
              />
              <button
                type="button"
                className={`p-pill p-pill-ghost ${styles.smallPill}`}
                onClick={() => fileRef.current?.click()}
              >
                <Camera size={14} /> {avatarShown ? "Change photo" : "Upload photo"}
              </button>
              <p className={styles.hint}>
                A square image works best. If you skip this, we use your generated artwork.
              </p>
            </div>
          </div>
        </section>

        {/* Identity */}
        <section className={`p-card ${styles.formCard}`}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Identity</span>
          </div>
          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Display name</span>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Tagline</span>
              <input
                className={styles.input}
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Bharatanatyam, reimagined"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Dance style</span>
              <input
                className={styles.input}
                value={form.style}
                onChange={(e) => set("style", e.target.value)}
                placeholder="Kathak"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>City</span>
              <input
                className={styles.input}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Mumbai"
              />
            </label>
          </div>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Bio</span>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={4}
              placeholder="Tell members about your training, your floor, and what a class with you feels like."
            />
          </label>
        </section>

        {/* Styling + socials */}
        <section className={`p-card ${styles.formCard}`}>
          <div className={styles.sectionHead}>
            <Palette size={16} />
            <span className={styles.sectionLabel}>Accent &amp; socials</span>
          </div>
          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Accent colour</span>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={accent}
                  onChange={(e) => set("accentColor", e.target.value)}
                  aria-label="Accent colour picker"
                />
                <input
                  className={styles.input}
                  value={form.accentColor}
                  onChange={(e) => set("accentColor", e.target.value)}
                  placeholder={DEFAULT_ACCENT}
                />
              </div>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                <AtSign size={12} className={styles.inlineIcon} /> Instagram
              </span>
              <input
                className={styles.input}
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                placeholder="@yourhandle or full URL"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                <Play size={12} className={styles.inlineIcon} /> YouTube
              </span>
              <input
                className={styles.input}
                value={form.youtube}
                onChange={(e) => set("youtube", e.target.value)}
                placeholder="Channel URL"
              />
            </label>
          </div>
        </section>

        {error ? <p className={styles.error}>{error}</p> : null}
        {saved ? <p className={styles.success}>Saved. Your public page is updated.</p> : null}

        <button type="submit" className={`p-pill p-pill-primary ${styles.submit}`} disabled={busy}>
          <Check size={16} /> {busy ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
