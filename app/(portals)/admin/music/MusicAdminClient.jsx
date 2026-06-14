"use client";

import { useRef, useState } from "react";
import { Music, Plus, Trash2, Play, Pause, Disc3, Upload, Check } from "lucide-react";
import styles from "./page.module.css";

const MOODS = ["Warm-up", "Groove", "Peak", "Cool-down"];

const MOOD_BADGE = {
  "Warm-up": "p-badge-warn",
  Groove: "p-badge-vip",
  Peak: "p-badge-hot",
  "Cool-down": "p-badge-cool",
};

function moodBadgeClass(mood) {
  return MOOD_BADGE[mood] || "p-badge-cool";
}

const EMPTY_FORM = { title: "", artist: "", duration: "", mood: "Groove", bpm: "" };

export default function MusicAdminClient({ instructors }) {
  const [instructorId, setInstructorId] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // audio player
  const audioRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);

  async function loadTracks(id) {
    if (!id) {
      setTracks([]);
      return;
    }
    setLoadingTracks(true);
    try {
      const res = await fetch(`/api/admin/tracks?instructorId=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.ok) setTracks(data.tracks || []);
      else setTracks([]);
    } catch {
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  }

  function onPickInstructor(e) {
    const id = e.target.value;
    setInstructorId(id);
    setError("");
    setPlayingId(null);
    if (audioRef.current) audioRef.current.pause();
    loadTracks(id);
  }

  function togglePlay(track) {
    if (!track || !track.audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId === track.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }
    audio.src = track.audioUrl;
    audio.play().catch(() => setPlayingId(null));
    setPlayingId(track.id);
  }

  async function uploadTrack(e) {
    e.preventDefault();
    setError("");
    if (!instructorId) {
      setError("Pick an instructor first.");
      return;
    }
    if (!form.title.trim()) {
      setError("Give the track a title first.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("instructorId", instructorId);
      fd.append("title", form.title.trim());
      fd.append("artist", form.artist.trim());
      fd.append("duration", form.duration.trim());
      fd.append("mood", form.mood);
      fd.append("bpm", form.bpm);
      if (file) fd.append("file", file);

      const res = await fetch("/api/admin/tracks", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not upload the track.");
        return;
      }
      setTracks((prev) => [data.track, ...prev]);
      setForm(EMPTY_FORM);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Network hiccup. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeTrack(id) {
    const snapshot = tracks;
    setTracks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(
        `/api/admin/tracks/${id}?instructorId=${encodeURIComponent(instructorId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) setTracks(snapshot);
    } catch {
      setTracks(snapshot);
    }
  }

  return (
    <div className="p-wrap">
      <audio ref={audioRef} preload="none" onEnded={() => setPlayingId(null)} />

      <div className={styles.head}>
        <div>
          <div className="p-overline">Studio Sound</div>
          <h1 className={`p-display ${styles.h1}`}>Music</h1>
        </div>
        <span className={`p-badge p-badge-cool ${styles.subBadge}`}>
          <Disc3 size={12} /> Upload tracks for any instructor
        </span>
      </div>

      <p className={styles.blurb}>
        Pick an instructor, then upload MP3 tracks straight into their library. Tracks appear in that
        instructor&apos;s Music shelf and can be added to their playlists.
      </p>

      {/* Instructor picker */}
      <section className={`p-card ${styles.pickerCard}`}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Instructor</span>
          <select className={styles.input} value={instructorId} onChange={onPickInstructor}>
            <option value="">Select an instructor…</option>
            {instructors.map((i) => (
              <option key={i.instructorId} value={i.instructorId}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {instructorId ? (
        <>
          {/* Upload form */}
          <section className={`p-card ${styles.formCard}`}>
            <div className={styles.sectionHead}>
              <Upload size={16} />
              <span className={styles.sectionLabel}>Upload a track</span>
            </div>
            <form className={styles.form} onSubmit={uploadTrack}>
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Title</span>
                  <input
                    className={styles.input}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Marigold Drums"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Artist</span>
                  <input
                    className={styles.input}
                    value={form.artist}
                    onChange={(e) => setForm({ ...form, artist: e.target.value })}
                    placeholder="Thayya Sessions"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Duration</span>
                  <input
                    className={styles.input}
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="3:45"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Mood</span>
                  <select
                    className={styles.input}
                    value={form.mood}
                    onChange={(e) => setForm({ ...form, mood: e.target.value })}
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>BPM</span>
                  <input
                    className={styles.input}
                    type="number"
                    value={form.bpm}
                    onChange={(e) => setForm({ ...form, bpm: e.target.value })}
                    placeholder="120"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Audio file (MP3)</span>
                  <input
                    ref={fileInputRef}
                    className={styles.fileInput}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {error ? <p className={styles.error}>{error}</p> : null}
              <button
                type="submit"
                className={`p-pill p-pill-primary ${styles.submit}`}
                disabled={busy}
              >
                <Plus size={16} /> {busy ? "Uploading…" : "Upload track"}
              </button>
            </form>
          </section>

          {/* Track list */}
          <div className={styles.sectionTitleRow}>
            <div className="p-overline">Tracks in this library</div>
          </div>

          {loadingTracks ? (
            <div className={`p-card ${styles.emptyRow}`}>Loading tracks…</div>
          ) : tracks.length === 0 ? (
            <div className={`p-card ${styles.emptyRow}`}>
              No tracks yet — upload the first one above.
            </div>
          ) : (
            <div className={`p-card ${styles.trackList}`}>
              {tracks.map((t, i) => (
                <div key={t.id} className={styles.track}>
                  <span className={`p-av-${(i % 6) + 1} ${styles.trackIcon}`}>
                    <Music size={16} />
                  </span>
                  <div className={styles.trackInfo}>
                    <div className={styles.trackTop}>
                      <span className={styles.trackName}>{t.title}</span>
                      <span className={`p-badge ${moodBadgeClass(t.mood)}`}>{t.mood}</span>
                    </div>
                    <div className={styles.trackMeta}>
                      <span>{t.artist}</span>
                      {t.bpm ? <span>· {t.bpm} BPM</span> : null}
                      <span>· {t.duration}</span>
                      {t.source ? <span>· {t.source}</span> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.playBtn} ${playingId === t.id ? styles.playBtnActive : ""}`}
                    onClick={() => togglePlay(t)}
                    disabled={!t.audioUrl}
                    aria-label={
                      !t.audioUrl
                        ? `No audio for ${t.title}`
                        : playingId === t.id
                          ? `Pause ${t.title}`
                          : `Play ${t.title}`
                    }
                    title={!t.audioUrl ? "No audio attached" : playingId === t.id ? "Pause" : "Play"}
                  >
                    {playingId === t.id ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => removeTrack(t.id)}
                    aria-label={`Remove ${t.title}`}
                    title="Remove track"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={`p-card ${styles.emptyRow}`}>
          Choose an instructor above to see and manage their tracks.
        </div>
      )}
    </div>
  );
}
