import React, { useState, useRef, useEffect } from 'react'

type View = 'dashboard' | 'trainees' | 'assignments' | 'content-service' | 'certifications' | 'analytics'

// ─── CSS token shorthands ────────────────────────────────────────────────────
const T = {
  bgDeep: 'var(--bg-deep)',
  bgSurface: 'var(--bg-surface)',
  bgGlass: 'var(--bg-glass)',
  bgGlassHover: 'var(--bg-glass-hover)',
  border: 'var(--border)',
  borderSoft: 'var(--border-soft)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textTertiary: 'var(--text-tertiary)',
  flow: 'var(--accent-flow)',
  flowDim: 'var(--accent-flow-dim)',
  amber: 'var(--accent-amber)',
  amberDim: 'var(--accent-amber-dim)',
  green: 'var(--accent-green)',
  greenDim: 'var(--accent-green-dim)',
  red: 'var(--accent-red)',
  redDim: 'var(--accent-red-dim)',
  violet: 'var(--accent-violet)',
  violetDim: 'var(--accent-violet-dim)',
  cyan: 'var(--accent-cyan)',
  cyanDim: 'var(--accent-cyan-dim)',
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
type BadgeColor = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'gray' | 'cyan'

const BADGE_STYLES: Record<BadgeColor, [string, string]> = {
  green:  [T.greenDim,  T.green],
  amber:  [T.amberDim,  T.amber],
  red:    [T.redDim,    T.red],
  blue:   [T.flowDim,   T.flow],
  violet: [T.violetDim, T.violet],
  cyan:   [T.cyanDim,   T.cyan],
  gray:   ['rgba(148,163,184,0.12)', T.textSecondary],
}

function Badge({ color, children }: { color: BadgeColor; children: React.ReactNode }) {
  const [bg, fg] = BADGE_STYLES[color]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
      fontFamily: "'JetBrains Mono', monospace", background: bg, color: fg, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {children}
    </span>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: T.bgGlass, border: `1px solid ${T.borderSoft}`,
      borderRadius: 14, padding: 18, backdropFilter: 'blur(10px)', ...style,
    }}>
      {children}
    </div>
  )
}

function Avatar({ initials, size = 30 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: 'linear-gradient(135deg,#2A3346,#1A2130)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif", fontSize: size * 0.4, fontWeight: 600,
      color: T.textSecondary, border: `1px solid ${T.border}`,
    }}>{initials}</div>
  )
}

function ProgressBar({ pct, amber }: { pct: number; amber?: boolean }) {
  return (
    <div style={{ flex: 1, height: 5, background: T.bgSurface, borderRadius: 10, overflow: 'hidden', marginRight: 10 }}>
      <div style={{
        height: '100%', borderRadius: 10, width: `${pct}%`,
        background: amber
          ? 'linear-gradient(90deg, var(--accent-amber), #FFC98A)'
          : 'linear-gradient(90deg, var(--accent-flow), #7AB2FF)',
      }} />
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  dashboard:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  trainees:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.8-6 6-6s6 2.5 6 6"/><circle cx="17" cy="8.5" r="2.6"/><path d="M15.5 14.2c2.6.3 4.5 2.6 4.5 5.8"/></svg>,
  assignments:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  book:         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"/></svg>,
  cert:         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 2 8 3.6v6.1c0 5-3.4 8.3-8 10.3-4.6-2-8-5.3-8-10.3V5.6L12 2Z"/></svg>,
  analytics:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10M11 20V4M18 20v-7"/></svg>,
  plus:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>,
  search:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  bell:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>,
  caret:        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>,
  close:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  user:         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"/></svg>,
  settings:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9c.2.6.7 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></svg>,
  logout:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  appearance:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>,
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      background: '#0D1218', border: `1px solid ${T.border}`, borderRadius: 10,
      padding: '12px 16px', fontSize: 12.5, color: T.textPrimary,
      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: 8,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      transition: 'all .25s ease',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, flexShrink: 0 }} />
      {msg}
    </div>
  )
}

function useToast() {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(text: string) {
    setMsg(text)
    setVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 3200)
  }

  return { msg, visible, showToast }
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const CS_ITEMS = [
  { id: 'ai-de',      icon: '★',   label: 'AI vs Data Engineering', desc: 'Start here — the core distinction', color: T.violet, colorDim: T.violetDim, priority: true },
  { id: 'pyspark',    icon: 'PY',  label: 'PySpark',               desc: 'Distributed DataFrame processing', color: T.amber,  colorDim: T.amberDim },
  { id: 'kafka',      icon: 'KF',  label: 'Kafka',                 desc: 'Event streaming & topics',         color: T.red,    colorDim: T.redDim },
  { id: 'airflow',    icon: 'AF',  label: 'Airflow',               desc: 'DAG-based orchestration',          color: T.flow,   colorDim: T.flowDim },
  { id: 'dbt',        icon: 'DBT', label: 'DBT',                   desc: 'SQL transformation models',        color: T.green,  colorDim: T.greenDim },
  { id: 'delta',      icon: 'DL',  label: 'Delta Lake',            desc: 'ACID tables & time travel',        color: T.violet, colorDim: T.violetDim },
  { id: 'warehousing',icon: 'DW',  label: 'Data Warehousing',      desc: 'Star & snowflake schemas',         color: T.cyan,   colorDim: T.cyanDim },
]

const NOTIFS = [
  { color: T.red,    text: <><b style={{ color: T.textPrimary }}>Daniel Cho</b> missed the Kafka Routing Challenge deadline.</>, time: '12 minutes ago', view: 'trainees' as View },
  { color: T.violet, text: <><b style={{ color: T.textPrimary }}>Sana Khatri's</b> capstone is ready for your approval.</>, time: '1 hour ago', view: 'certifications' as View },
  { color: T.amber,  text: <>AI flagged a <b style={{ color: T.textPrimary }}>Kafka module</b> pass-rate drop across Batch B50.</>, time: '3 hours ago', view: 'content-service' as View },
  { color: T.green,  text: <><b style={{ color: T.textPrimary }}>Priya Nair</b> scored 92 on Airflow DAG Design.</>, time: 'Yesterday', view: 'trainees' as View },
  { color: T.flow,   text: <>Batch B50 skill heatmap updated with new assessment data.</>, time: 'Yesterday', view: 'analytics' as View },
]

function Navbar({ active, setActive, onNewAssignment, showToast }: {
  active: View
  setActive: (v: View) => void
  onNewAssignment: () => void
  showToast: (m: string) => void
}) {
  const [csOpen, setCsOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifsRead, setNotifsRead] = useState(false)
  const csRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick() { setCsOpen(false); setNotifOpen(false); setProfileOpen(false) }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  function navStyle(isActive: boolean): React.CSSProperties {
    return {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 11px', borderRadius: 8, cursor: 'pointer',
      fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
      border: `1px solid ${isActive ? 'rgba(59,130,246,0.25)' : 'transparent'}`,
      background: isActive ? T.flowDim : 'transparent',
      color: isActive ? T.flow : T.textSecondary,
      transition: 'all .15s ease',
      flexShrink: 0,
    }
  }

  return (
    <header style={{
      height: 60, flexShrink: 0,
      borderBottom: `1px solid ${T.borderSoft}`,
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 4,
      background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(14px)',
      position: 'relative', zIndex: 40,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginRight: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent-flow), var(--accent-violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#fff',
        }}>DE</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', lineHeight: 1.2 }}>Academy Console</div>
          <div style={{ fontSize: 10, color: T.textTertiary }}>Admin workspace</div>
        </div>
      </div>

      {/* Nav items — no overflow, compact */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
        {([
          { id: 'dashboard',    label: 'Dashboard',    icon: Icon.dashboard },
          { id: 'trainees',     label: 'Trainees',     icon: Icon.trainees },
          { id: 'assignments',  label: 'Assignments',  icon: Icon.assignments },
          { id: 'certifications', label: 'Certifications', icon: Icon.cert },
          { id: 'analytics',   label: 'Analytics',    icon: Icon.analytics },
        ] as { id: View; label: string; icon: JSX.Element }[]).map(item => (
          <div
            key={item.id}
            onClick={() => setActive(item.id)}
            style={navStyle(active === item.id)}
            onMouseEnter={e => { if (active !== item.id) { (e.currentTarget as HTMLDivElement).style.background = T.bgGlass; (e.currentTarget as HTMLDivElement).style.color = T.textPrimary } }}
            onMouseLeave={e => { if (active !== item.id) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = T.textSecondary } }}
          >
            {item.icon}{item.label}
          </div>
        ))}

        {/* Content Service dropdown */}
        <div ref={csRef} style={{ position: 'relative' }}>
          <div
            onClick={e => { e.stopPropagation(); setNotifOpen(false); setProfileOpen(false); setCsOpen(v => !v) }}
            style={{ ...navStyle(active === 'content-service' || csOpen), gap: 6 }}
            onMouseEnter={e => { if (active !== 'content-service' && !csOpen) { (e.currentTarget as HTMLDivElement).style.background = T.bgGlass; (e.currentTarget as HTMLDivElement).style.color = T.textPrimary } }}
            onMouseLeave={e => { if (active !== 'content-service' && !csOpen) { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = T.textSecondary } }}
          >
            {Icon.book} Content Service
            <span style={{ display: 'flex', transform: csOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>{Icon.caret}</span>
          </div>

          {csOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                width: 300, background: T.bgSurface, border: `1px solid ${T.border}`,
                borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
                zIndex: 60, padding: 6,
              }}
            >
              {CS_ITEMS.map(item => (
                <div
                  key={item.id}
                  onClick={() => { setActive('content-service'); setCsOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                    ...(item.priority ? { background: 'rgba(157,123,255,0.06)', border: `1px solid rgba(157,123,255,0.2)`, marginBottom: 6 } : {}),
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.bgGlass}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = item.priority ? 'rgba(157,123,255,0.06)' : 'transparent'}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600,
                    background: item.colorDim, color: item.color,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
                      {item.label}
                      {item.priority && <span style={{ fontSize: 9, color: T.violet, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginLeft: 6 }}>Priority</span>}
                    </div>
                    <div style={{ fontSize: 10.5, color: T.textTertiary, marginTop: 1 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: T.bgSurface, border: `1px solid ${T.border}`,
          borderRadius: 8, padding: '6px 11px', color: T.textTertiary, fontSize: 12.5,
        }}>
          {Icon.search}<span>Search…</span>
        </div>

        <button
          onClick={onNewAssignment}
          style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 13, padding: '7px 13px',
            borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${T.border}`, background: T.bgSurface, color: T.textPrimary,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {Icon.plus}<span>New Assignment</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <div
            onClick={e => { e.stopPropagation(); setCsOpen(false); setProfileOpen(false); setNotifOpen(v => !v) }}
            style={{
              width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.textSecondary, cursor: 'pointer', background: T.bgSurface, position: 'relative',
            }}
          >
            {Icon.bell}
            {!notifsRead && <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: T.red, boxShadow: `0 0 0 2px ${T.bgSurface}` }} />}
          </div>

          {notifOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 320, background: '#0D1218', border: `1px solid ${T.border}`,
                borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', zIndex: 50, overflow: 'hidden',
              }}
            >
              <div style={{ padding: '13px 16px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5 }}>Notifications</span>
                <span
                  onClick={() => setNotifsRead(true)}
                  style={{ fontSize: 11, color: T.flow, cursor: 'pointer', fontWeight: 600 }}
                >Mark all read</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {NOTIFS.map((n, i) => (
                  <div
                    key={i}
                    onClick={() => { setActive(n.view); setNotifOpen(false) }}
                    style={{
                      display: 'flex', gap: 10, padding: '12px 16px',
                      borderBottom: i < NOTIFS.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.bgGlass}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, marginTop: 5, flexShrink: 0, opacity: notifsRead ? 0.35 : 1 }} />
                    <div>
                      <div style={{ fontSize: 12.5, color: T.textSecondary, lineHeight: 1.45 }}>{n.text}</div>
                      <div style={{ fontSize: 10.5, color: T.textTertiary, marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={e => { e.stopPropagation(); setCsOpen(false); setNotifOpen(false); setProfileOpen(v => !v) }}
            style={{ cursor: 'pointer' }}
          >
            <Avatar initials="AR" />
          </div>

          {profileOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 230, background: '#0D1218', border: `1px solid ${T.border}`,
                borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', zIndex: 50, overflow: 'hidden',
              }}
            >
              <div style={{ padding: '10px 12px 12px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <Avatar initials="AR" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Aisha Rahman</div>
                  <div style={{ fontSize: 11, color: T.textTertiary }}>aisha.rahman@company.com</div>
                </div>
              </div>
              {[
                { icon: Icon.user,       label: 'My profile',         msg: 'Opening profile settings' },
                { icon: Icon.settings,   label: 'Account settings',   msg: 'Opening account settings' },
                { icon: Icon.appearance, label: 'Appearance',         msg: 'Appearance settings coming soon' },
              ].map(item => (
                <div key={item.label} onClick={() => { setProfileOpen(false); showToast(item.msg) }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', fontSize: 12.5, color: T.textSecondary, cursor: 'pointer', margin: '0 4px', borderRadius: 8 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = T.bgGlass; (e.currentTarget as HTMLDivElement).style.color = T.textPrimary }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = T.textSecondary }}
                >
                  {item.icon}{item.label}
                </div>
              ))}
              <div style={{ height: 1, background: T.borderSoft, margin: '6px 4px' }} />
              <div onClick={() => { setProfileOpen(false); showToast('Signed out (demo only)') }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', fontSize: 12.5, color: T.red, cursor: 'pointer', margin: '0 4px 8px', borderRadius: 8 }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.redDim}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                {Icon.logout} Log out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardView({ setActive }: { setActive: (v: View) => void }) {
  const stats = [
    { label: 'Active Trainees',   value: '128', delta: '↑ 6 new this week',       type: 'up',      onClick: () => setActive('trainees') },
    { label: 'Avg. Completion',   value: '67%', delta: '↑ 3.2% vs last week',     type: 'up',      onClick: () => setActive('analytics') },
    { label: 'At Risk',           value: '14',  delta: '⚠ Kafka module bottleneck', type: 'warn',  onClick: () => setActive('trainees') },
    { label: 'Pending Approvals', value: '7',   delta: '4 capstones, 3 certifications', type: 'neutral', onClick: () => setActive('certifications') },
  ]
  const deltaColor = (t: string) =>
    t === 'up' ? T.green : t === 'warn' ? T.amber : T.textTertiary

  const submissions = [
    { name: 'Rohit Menon',     assignment: 'Spark Optimization Lab',  badge: <Badge color="blue">Under review</Badge>, score: '—' },
    { name: 'Priya Nair',      assignment: 'Airflow DAG Design',       badge: <Badge color="green">Graded</Badge>,      score: '92' },
    { name: 'Daniel Cho',      assignment: 'Kafka Routing Challenge',  badge: <Badge color="red">Overdue</Badge>,       score: '—' },
    { name: 'Fatima Al-Sayed', assignment: 'DBT Lineage Model',        badge: <Badge color="green">Graded</Badge>,      score: '88' },
  ]

  const phases = [
    { num: '01', name: 'Foundations',          pct: 100, risk: false },
    { num: '02', name: 'Warehousing & ETL',    pct: 88,  risk: false },
    { num: '03', name: 'Distributed Systems',  pct: 41,  risk: true  },
    { num: '04', name: 'Enterprise Project',   pct: 6,   risk: false },
  ]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Program Overview</div>
        <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4 }}>Batch B50 · Week 6 of 16 · Last synced 4 minutes ago</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 0 }}>
        {stats.map(s => (
          <StatCard key={s.label} {...s} deltaColor={deltaColor(s.type)} />
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ display: 'flex', alignItems: 'stretch', margin: '22px 0 26px' }}>
        {phases.map((p, i) => (
          <React.Fragment key={p.num}>
            <div style={{
              flex: 1, background: T.bgGlass, borderRadius: 12, padding: '16px 18px',
              border: p.risk ? '1px solid rgba(240,169,78,0.4)' : `1px solid ${T.borderSoft}`,
              cursor: 'pointer', transition: 'border-color .15s',
            }}
              onMouseEnter={e => { if (!p.risk) (e.currentTarget as HTMLDivElement).style.borderColor = T.flow }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = p.risk ? 'rgba(240,169,78,0.4)' : T.borderSoft }}
            >
              <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textTertiary, fontWeight: 600 }}>Phase {p.num}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14.5, marginTop: 6 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
                <ProgressBar pct={p.pct} amber={p.risk} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{p.pct}%</span>
              </div>
            </div>
            {i < phases.length - 1 && (
              <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="2" style={{ overflow: 'visible' }}>
                  <line x1="0" y1="1" x2="40" y2="1" stroke="#2B3548" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14.5, marginBottom: 14 }}>Recent Submissions</div>
        <TableBase headers={['Trainee', 'Assignment', 'Status', 'Score']}>
          {submissions.map((r, i) => (
            <tr key={i} style={{ cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = T.bgGlass}
              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
            >
              <Td last={i === submissions.length - 1}>{r.name}</Td>
              <Td last={i === submissions.length - 1}>{r.assignment}</Td>
              <Td last={i === submissions.length - 1}>{r.badge}</Td>
              <Td last={i === submissions.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{r.score}</span></Td>
            </tr>
          ))}
        </TableBase>
      </Card>
    </div>
  )
}

function StatCard({ label, value, delta, deltaColor, onClick }: { label: string; value: string; delta: string; deltaColor: string; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: T.bgGlass, border: `1px solid ${hover ? T.flow : T.borderSoft}`,
        borderRadius: 14, padding: 18, backdropFilter: 'blur(10px)', cursor: 'pointer',
        transform: hover ? 'translateY(-2px)' : 'none', transition: 'all .15s ease',
      }}
    >
      <div style={{ fontSize: 12, color: T.textSecondary, fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 600, marginTop: 8, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11.5, marginTop: 6, fontFamily: "'JetBrains Mono', monospace", color: deltaColor }}>{delta}</div>
    </div>
  )
}

function TableBase({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={{ textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textTertiary, fontWeight: 600, padding: '10px 14px', borderBottom: `1px solid ${T.borderSoft}` }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

function Td({ children, last }: { children: React.ReactNode; last: boolean }) {
  return (
    <td style={{ padding: '12px 14px', borderBottom: last ? 'none' : `1px solid ${T.borderSoft}`, fontSize: 13 }}>{children}</td>
  )
}

// ─── Trainees ─────────────────────────────────────────────────────────────────
type TraineeId = 'rohit' | 'priya' | 'daniel' | 'fatima' | 'sana'

const TRAINEE_DATA: Record<TraineeId, {
  name: string; initials: string; dept: string; batch: string; batchRaw: string; group: string; sub: string;
  phase: string; completion: string; score: number; isRisk: boolean;
  badge: JSX.Element; skills: [string, number][]
}> = {
  rohit:  { name: 'Rohit Menon',      initials: 'RM', dept: 'Platform Engineering',  batch: 'B50-A-2', batchRaw: 'B50', group: 'A', sub: '2', phase: 'Phase 3', completion: '74%', score: 81, isRisk: false, badge: <Badge color="green">On track</Badge>,       skills: [['PySpark',78],['Kafka',65],['Airflow',72],['SQL',88]] },
  priya:  { name: 'Priya Nair',       initials: 'PN', dept: 'Analytics Engineering', batch: 'B50-A-1', batchRaw: 'B50', group: 'A', sub: '1', phase: 'Phase 3', completion: '91%', score: 94, isRisk: false, badge: <Badge color="green">On track</Badge>,       skills: [['PySpark',92],['Kafka',85],['Airflow',95],['SQL',97]] },
  daniel: { name: 'Daniel Cho',       initials: 'DC', dept: 'Platform Engineering',  batch: 'B49-B-4', batchRaw: 'B49', group: 'B', sub: '4', phase: 'Phase 3', completion: '38%', score: 52, isRisk: true,  badge: <Badge color="red">Falling behind</Badge>,   skills: [['PySpark',48],['Kafka',31],['Airflow',44],['SQL',66]] },
  fatima: { name: 'Fatima Al-Sayed',  initials: 'FA', dept: 'Data Platform',         batch: 'B50-C-1', batchRaw: 'B50', group: 'C', sub: '1', phase: 'Phase 2', completion: '63%', score: 76, isRisk: true,  badge: <Badge color="amber">At risk</Badge>,         skills: [['PySpark',70],['Kafka',58],['Airflow',68],['SQL',84]] },
  sana:   { name: 'Sana Khatri',      initials: 'SK', dept: 'Analytics Engineering', batch: 'B49-A-5', batchRaw: 'B49', group: 'A', sub: '5', phase: 'Phase 4', completion: '96%', score: 97, isRisk: false, badge: <Badge color="violet">Capstone review</Badge>, skills: [['PySpark',98],['Kafka',94],['Airflow',96],['SQL',99]] },
}

function TraineesView({ showToast, onNewAssignment }: { showToast: (m: string) => void; onNewAssignment: () => void }) {
  const [batchFilter, setBatchFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')
  const [chipFilter, setChipFilter] = useState('All')
  const [selected, setSelected] = useState<TraineeId | null>(null)

  const all = Object.entries(TRAINEE_DATA) as [TraineeId, typeof TRAINEE_DATA[TraineeId]][]
  const filtered = all.filter(([, t]) => {
    let show = true
    if (batchFilter !== 'all') show = show && t.batchRaw === batchFilter
    if (groupFilter !== 'all') show = show && t.group === groupFilter
    if (subFilter !== 'all') show = show && t.sub === subFilter
    if (chipFilter === 'At risk only') show = show && t.isRisk
    else if (chipFilter === 'Phase 3') show = show && t.phase === 'Phase 3'
    return show
  })

  const sel = selected ? TRAINEE_DATA[selected] : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Trainees</div>
          <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4 }}>128 trainees across 4 active cohorts</div>
        </div>
        <button onClick={onNewAssignment} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', border: `1px solid ${T.border}`, background: T.bgSurface, color: T.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
          {Icon.plus} Add Trainee
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Batch dropdowns */}
        {[
          { label: 'Batch', value: batchFilter, set: setBatchFilter, options: ['all', 'B49', 'B50'] },
          { label: 'Group', value: groupFilter, set: setGroupFilter, options: ['all', 'A', 'B', 'C', 'D'] },
          { label: 'Sub-batch', value: subFilter, set: setSubFilter, options: ['all', '1', '2', '3', '4', '5'] },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, padding: '6px 8px' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.textTertiary, paddingLeft: 4, whiteSpace: 'nowrap' }}>{f.label}</span>
            <select value={f.value} onChange={e => f.set(e.target.value)} style={{ background: T.bgGlass, border: `1px solid ${T.borderSoft}`, borderRadius: 7, padding: '5px 24px 5px 9px', color: T.textPrimary, fontSize: 12.5, fontFamily: 'Inter', fontWeight: 500, cursor: 'pointer', appearance: 'none', outline: 'none' }}>
              {f.options.map(o => <option key={o} value={o}>{o === 'all' ? 'All' : o}</option>)}
            </select>
          </div>
        ))}
        {['All', 'At risk only', 'Phase 3'].map(chip => (
          <button key={chip} onClick={() => setChipFilter(chip)} style={{
            padding: '7px 13px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer',
            border: `1px solid ${chipFilter === chip ? T.flow : T.border}`,
            background: chipFilter === chip ? T.flowDim : T.bgSurface,
            color: chipFilter === chip ? T.flow : T.textSecondary,
          }}>{chip === 'All' ? 'All trainees' : chip}</button>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <TableBase headers={['Trainee', 'Batch', 'Phase', 'Completion', 'Skill score', 'Status']}>
          {filtered.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: T.textTertiary, fontSize: 13 }}>No trainees match this filter.</td></tr>
          ) : filtered.map(([id, t], i) => (
            <tr key={id}
              onClick={() => setSelected(id)}
              style={{ cursor: 'pointer', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = T.bgGlass}
              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
            >
              <Td last={i === filtered.length - 1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={t.initials} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize: 11.5, color: T.textTertiary }}>{t.dept}</div>
                  </div>
                </div>
              </Td>
              <Td last={i === filtered.length - 1}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, color: T.flow, background: T.flowDim, padding: '3px 9px', borderRadius: 6 }}>{t.batch}</span>
              </Td>
              <Td last={i === filtered.length - 1}>{t.phase}</Td>
              <Td last={i === filtered.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t.completion}</span></Td>
              <Td last={i === filtered.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{t.score}</span></Td>
              <Td last={i === filtered.length - 1}>{t.badge}</Td>
            </tr>
          ))}
        </TableBase>
      </Card>

      {/* Trainee detail modal */}
      {selected && sel && (
        <Modal onClose={() => setSelected(null)} title="Trainee Profile"
          footer={<>
            <Btn onClick={() => { setSelected(null); showToast('Message sent to trainee') }}>Send message</Btn>
            <BtnPrimary onClick={() => { setSelected(null); onNewAssignment() }}>Assign new task</BtnPrimary>
          </>}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Avatar initials={sel.initials} size={44} />
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16 }}>{sel.name}</div>
              <div style={{ fontSize: 12, color: T.textTertiary, marginTop: 2 }}>{sel.dept} · {sel.batch} · {sel.phase}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
            {[['Completion', sel.completion], ['Skill score', String(sel.score)], ['Status', sel.isRisk ? 'At risk' : 'On track']].map(([lbl, val]) => (
              <div key={lbl} style={{ background: T.bgSurface, border: `1px solid ${T.borderSoft}`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lbl}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 16, marginTop: 4 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '16px 0 8px' }}>Skill breakdown</div>
          {sel.skills.map(([sk, v]) => (
            <div key={sk} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 80, fontSize: 12, color: T.textSecondary, flexShrink: 0 }}>{sk}</div>
              <ProgressBar pct={v} amber={v < 60} />
              <div style={{ width: 30, textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{v}</div>
            </div>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '16px 0 8px' }}>Recent activity</div>
          <div style={{ fontSize: 12.5, color: T.textSecondary, lineHeight: 1.9 }}>
            • Submitted last assignment 2 days ago<br />
            • Last mentor session: 5 days ago<br />
            • Lab environment last active: today
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Assignments ──────────────────────────────────────────────────────────────
function AssignmentsView({ onNewAssignment, showToast }: { onNewAssignment: () => void; showToast: (m: string) => void }) {
  const [tab, setTab] = useState<'assignments' | 'assessments'>('assignments')
  const [selected, setSelected] = useState<string | null>(null)

  const kanbanCols = [
    { title: 'Draft',        count: 2,  cards: [{ id: 'delta-draft',     title: 'Delta Lake Time Travel Exercise', tags: ['Databricks','Phase 3'], foot: 'Not scheduled', avatars: 0 }] },
    { title: 'Published',    count: 3,  cards: [{ id: 'airflow-dag',     title: 'Airflow DAG Dependency Design',   tags: ['Airflow','B50'],        foot: 'Due Aug 8',      avatars: 3 }] },
    { title: 'In Progress',  count: 6,  cards: [
      { id: 'kafka-routing', title: 'Kafka Event Routing Challenge', tags: ['Kafka','Phase 3'], foot: 'Due Aug 10', avatars: 2 },
      { id: 'dbt-lineage',   title: 'DBT Lineage Builder Sprint',    tags: ['DBT','B49'],       foot: 'Due Aug 6',  avatars: 1 },
    ]},
    { title: 'Under Review', count: 2,  cards: [{ id: 'spark-opt',       title: 'Spark Optimization Challenge',    tags: ['PySpark','Manual'],     foot: 'Submitted Aug 1', avatars: 0 }] },
    { title: 'Completed',    count: 18, cards: [{ id: 'warehouse-model', title: 'Warehouse Modeling Studio',       tags: ['Modeling','Avg 89'],    foot: 'Closed Jul 28',   avatars: 0 }] },
  ]

  const assessments = [
    { id: 'sql-foundations', title: 'SQL Fundamentals Assessment', type: <Badge color="blue">SQL challenge</Badge>,      batch: 'B50', avg: 86, pass: '92%', status: <Badge color="green">Closed</Badge> },
    { id: 'pyspark-coding',  title: 'PySpark Coding Assessment',   type: <Badge color="violet">Coding assessment</Badge>, batch: 'B50', avg: 74, pass: '68%', status: <Badge color="blue">Open</Badge> },
    { id: 'kafka-case',      title: 'Kafka Architecture Case Study',type: <Badge color="amber">Case study</Badge>,         batch: 'B49', avg: 61, pass: '54%', status: <Badge color="blue">Open</Badge> },
    { id: 'airflow-debug',   title: 'Airflow Debugging Exercise',  type: <Badge color="red">Debugging</Badge>,            batch: 'B49', avg: 79, pass: '88%', status: <Badge color="green">Closed</Badge> },
    { id: 'capstone-design', title: 'Capstone Design Review',      type: <Badge color="gray">Scenario-based</Badge>,      batch: 'B49', avg: 91, pass: '96%', status: <Badge color="violet">In review</Badge> },
  ]

  const ASSIGNMENT_DETAILS: Record<string, { title: string; statusColor: BadgeColor; statusLabel: string; tags: string[]; due: string; desc: string; submissions: string }> = {
    'delta-draft':     { title: 'Delta Lake Time Travel Exercise',  statusColor: 'gray',   statusLabel: 'Draft',        tags: ['Databricks','Phase 3'], due: 'Not scheduled',    desc: 'Explore Delta Lake time travel and versioned reads/writes on a simulated retail dataset.', submissions: '0 of 0 (not yet published)' },
    'airflow-dag':     { title: 'Airflow DAG Dependency Design',    statusColor: 'blue',   statusLabel: 'Published',    tags: ['Airflow','B50'],        due: 'Aug 8, 2026',      desc: 'Design a multi-stage DAG with correct upstream/downstream dependencies and retry policies.', submissions: '6 of 34 trainees submitted' },
    'kafka-routing':   { title: 'Kafka Event Routing Challenge',    statusColor: 'blue',   statusLabel: 'In Progress',  tags: ['Kafka','Phase 3'],      due: 'Aug 10, 2026',     desc: 'Configure producers and consumers to correctly route events across three topics under simulated load.', submissions: '12 of 34 trainees submitted' },
    'dbt-lineage':     { title: 'DBT Lineage Builder Sprint',       statusColor: 'blue',   statusLabel: 'In Progress',  tags: ['DBT','B49'],            due: 'Aug 6, 2026',      desc: 'Build a chain of DBT models with correct lineage, tests, and documentation.', submissions: '19 of 28 trainees submitted' },
    'spark-opt':       { title: 'Spark Optimization Challenge',     statusColor: 'amber',  statusLabel: 'Under Review', tags: ['PySpark','AI-graded'],  due: 'Submitted Aug 1, 2026', desc: 'Reduce job runtime on a skewed dataset using partitioning and broadcast join strategies.', submissions: '28 of 28 trainees submitted — AI grading in progress' },
    'warehouse-model': { title: 'Warehouse Modeling Studio',        statusColor: 'green',  statusLabel: 'Completed',    tags: ['Modeling','Avg 89'],    due: 'Closed Jul 28, 2026',   desc: 'Design a star schema for a retail sales warehouse, including SCD Type 2 handling.', submissions: '41 of 41 trainees submitted — avg score 89' },
  }

  const detail = selected ? ASSIGNMENT_DETAILS[selected] : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{tab === 'assignments' ? 'Assignments' : 'Assessments'}</div>
          <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4 }}>
            {tab === 'assignments' ? 'Track lab exercises and project sprints across batches' : 'Coding assessments, case studies, and scenario-based evaluations'}
          </div>
        </div>
        <BtnPrimary onClick={onNewAssignment}>{Icon.plus} New Assignment</BtnPrimary>
      </div>

      {/* Subtabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: `1px solid ${T.borderSoft}` }}>
        {(['assignments', 'assessments'] as const).map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding: '10px 4px', marginRight: 20, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', position: 'relative',
            color: tab === t ? T.textPrimary : T.textTertiary, transition: 'color .15s',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {tab === t && <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: T.flow, borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {tab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {kanbanCols.map(col => (
            <div key={col.title} style={{ background: T.bgSurface, border: `1px solid ${T.borderSoft}`, borderRadius: 12, padding: 12, minHeight: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 2px' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: T.textSecondary }}>{col.title}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.textTertiary, background: T.bgGlass, padding: '1px 7px', borderRadius: 20 }}>{col.count}</span>
              </div>
              {col.cards.map(card => (
                <KanbanCard key={card.id} card={card} onClick={() => setSelected(card.id)} />
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'assessments' && (
        <Card style={{ padding: 0 }}>
          <TableBase headers={['Assessment', 'Type', 'Batch', 'Avg. score', 'Pass rate', 'Status']}>
            {assessments.map((a, i) => (
              <tr key={a.id} style={{ cursor: 'pointer', transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = T.bgGlass}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
              >
                <Td last={i === assessments.length - 1}>{a.title}</Td>
                <Td last={i === assessments.length - 1}>{a.type}</Td>
                <Td last={i === assessments.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{a.batch}</span></Td>
                <Td last={i === assessments.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{a.avg}</span></Td>
                <Td last={i === assessments.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{a.pass}</span></Td>
                <Td last={i === assessments.length - 1}>{a.status}</Td>
              </tr>
            ))}
          </TableBase>
        </Card>
      )}

      {selected && detail && (
        <Modal onClose={() => setSelected(null)} title="Assignment Detail"
          footer={<>
            <Btn onClick={() => setSelected(null)}>Close</Btn>
            <BtnPrimary onClick={() => { setSelected(null); showToast('Reminder sent to assigned trainees') }}>Send reminder</BtnPrimary>
          </>}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17 }}>{detail.title}</div>
            <Badge color={detail.statusColor}>{detail.statusLabel}</Badge>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
            {detail.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: T.bgDeep, color: T.textTertiary, border: `1px solid ${T.borderSoft}` }}>{t}</span>)}
          </div>
          {[['Description', detail.desc], ['Due', detail.due], ['Submissions', detail.submissions]].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '14px 0 6px' }}>{lbl}</div>
              <div style={{ fontSize: 12.5, color: T.textSecondary, lineHeight: 1.6 }}>{val}</div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  )
}

function KanbanCard({ card, onClick }: { card: { title: string; tags: string[]; foot: string; avatars: number }; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: T.bgGlass, border: `1px solid ${hover ? T.flow : T.borderSoft}`, borderRadius: 9, padding: '11px 12px', marginBottom: 10, cursor: 'pointer', transition: 'border-color .15s' }}
    >
      <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8, lineHeight: 1.35 }}>{card.title}</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 9 }}>
        {card.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: T.bgDeep, color: T.textTertiary, border: `1px solid ${T.borderSoft}` }}>{t}</span>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: T.textTertiary }}>
        <span>{card.foot}</span>
        {card.avatars > 0 && (
          <div style={{ display: 'flex' }}>
            {Array.from({ length: card.avatars }).map((_, i) => (
              <div key={i} style={{ width: 18, height: 18, borderRadius: 5, background: '#232B3E', border: `2px solid ${T.bgGlass}`, marginLeft: i === 0 ? 0 : -6 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Content Service ──────────────────────────────────────────────────────────
const CS_TOPICS_DATA: Record<string, {
  name: string; tag: string; icon: string; color: string; colorDim: string; priority?: boolean;
  category?: string;
  what: string; why: string;
  how: { title: string; lang: string; code: string }[];
  compare?: { id: string; note: string }[]
}> = {
  'ai-de':      { name: 'AI vs Data Engineering', tag: 'Start here — the core distinction', icon: '★', color: T.violet, colorDim: T.violetDim, priority: true, what: 'Artificial Intelligence is the discipline of building models that learn patterns and generate predictions or content. Data Engineering is the discipline of building the pipelines, storage, and infrastructure that reliably move and prepare the data those models depend on. AI produces answers; data engineering makes sure the inputs are correct, complete, and on time.', why: 'Trainees increasingly use AI copilots to write PySpark or SQL, which can blur the line between "the AI wrote correct code" and "I understand why this pipeline is correct." This org needs engineers who can validate, debug, and own a pipeline — not just prompt a model and ship what it returns.', how: [{ title: 'Where AI genuinely helps', lang: 'text', code: `- Drafting boilerplate PySpark/SQL\n- Explaining unfamiliar stack traces\n- Suggesting a first-pass schema or DAG` }, { title: 'Where data engineering judgment is still required', lang: 'text', code: `- Partitioning strategy for a specific data volume\n- Reasoning about failure modes: late-arriving data, schema drift\n- Owning the tradeoff between cost, latency, and freshness` }], compare: [{ id: 'pyspark', note: 'PySpark is a tool an AI copilot can help you write — this topic is about the judgment you still need to apply.' }, { id: 'airflow', note: 'Airflow orchestration decisions are a good example of judgment AI can suggest but should not decide alone.' }] },
  pyspark:      { name: 'PySpark', tag: 'Distributed data processing', icon: 'PY', color: T.amber, colorDim: T.amberDim, category: 'processing', what: 'PySpark is the Python API for Apache Spark. It lets you process and transform large datasets across a distributed cluster using the DataFrame and RDD abstractions.', why: 'Most enterprise ETL and analytics pipelines at this scale run on Spark. Trainees need to understand partitioning, lazy evaluation, and DataFrame transformations.', how: [{ title: 'Read a dataset into a DataFrame', lang: 'python', code: `from pyspark.sql import SparkSession\n\nspark = SparkSession.builder.appName("SalesETL").getOrCreate()\ndf = spark.read.format("parquet").load("s3://raw/sales/2026/")\ndf.printSchema()` }, { title: 'Transform and aggregate', lang: 'python', code: `from pyspark.sql import functions as F\n\nresult = (\n    df.filter(F.col("status") == "completed")\n      .groupBy("region", "product_category")\n      .agg(F.sum("amount").alias("total_revenue"))\n      .orderBy(F.desc("total_revenue"))\n)` }], compare: [{ id: 'delta', note: 'Delta Lake sits on top of the files PySpark writes — use it when you need ACID guarantees or time travel.' }, { id: 'kafka', note: 'Kafka moves data in real time; PySpark processes data in batch once it has landed.' }] },
  kafka:        { name: 'Kafka', tag: 'Event streaming & topics', icon: 'KF', color: T.red, colorDim: T.redDim, category: 'streaming', what: 'Kafka is a distributed event streaming platform. Producers publish events to topics, and consumers subscribe to process events in real time, with partitions handling scale and ordering.', why: 'Enterprise pipelines rely on Kafka to decouple systems and move events reliably at scale. A misconfigured consumer group can silently drop or duplicate events.', how: [{ title: 'Produce events to a topic', lang: 'python', code: `from kafka import KafkaProducer\nimport json\n\nproducer = KafkaProducer(\n    bootstrap_servers=["broker1:9092"],\n    value_serializer=lambda v: json.dumps(v).encode("utf-8")\n)\nproducer.send("orders.events", {"order_id": 1042, "status": "created"})\nproducer.flush()` }, { title: 'Create a topic (CLI)', lang: 'bash', code: `kafka-topics.sh --create \\\n  --topic orders.events \\\n  --partitions 6 \\\n  --replication-factor 3 \\\n  --bootstrap-server broker1:9092` }], compare: [{ id: 'airflow', note: 'Kafka moves events continuously and in real time; Airflow triggers scheduled or interval-based batch jobs.' }, { id: 'pyspark', note: 'A Kafka consumer often hands events off to a PySpark structured streaming job for transformation at scale.' }] },
  airflow:      { name: 'Airflow', tag: 'DAG-based orchestration', icon: 'AF', color: T.flow, colorDim: T.flowDim, category: 'streaming', what: 'Apache Airflow orchestrates data pipelines as Directed Acyclic Graphs (DAGs) — sets of tasks with defined dependencies — and handles scheduling, retries, and monitoring.', why: 'Production pipelines rarely run as a single script. Airflow gives trainees the pattern every pipeline in this org relies on: expressing task dependencies explicitly and failing safely.', how: [{ title: 'Define a DAG with task dependencies', lang: 'python', code: `from airflow import DAG\nfrom airflow.operators.python import PythonOperator\nfrom datetime import datetime\n\nwith DAG(\n    dag_id="daily_sales_pipeline",\n    schedule="0 4 * * *",\n    start_date=datetime(2026, 1, 1),\n    catchup=False,\n) as dag:\n    extract   = PythonOperator(task_id="extract_sales",   python_callable=extract_sales)\n    transform = PythonOperator(task_id="transform_sales", python_callable=transform_sales)\n    load      = PythonOperator(task_id="load_warehouse",  python_callable=load_warehouse)\n    extract >> transform >> load` }], compare: [{ id: 'kafka', note: 'Airflow schedules discrete jobs; Kafka streams continuous events in real time.' }, { id: 'dbt', note: 'Airflow often triggers a dbt run as one task in a larger DAG.' }] },
  dbt:          { name: 'DBT', tag: 'SQL transformation models', icon: 'DBT', color: T.green, colorDim: T.greenDim, category: 'modeling', what: 'dbt (data build tool) lets data engineers define transformations as version-controlled SQL models, with built-in testing, documentation, and lineage tracking.', why: 'dbt is how this org manages the transformation layer of the warehouse. Trainees need to understand model layering — staging, intermediate, marts — and how to write tests.', how: [{ title: 'Define a staging model', lang: 'sql', code: `-- models/staging/stg_orders.sql\nselect\n    order_id,\n    customer_id,\n    status,\n    cast(amount as numeric(10,2)) as amount,\n    created_at\nfrom {{ source('raw', 'orders') }}\nwhere status is not null` }, { title: 'Build a mart model', lang: 'sql', code: `-- models/marts/fct_daily_revenue.sql\nselect\n    date_trunc('day', created_at) as order_date,\n    sum(amount)                   as total_revenue,\n    count(distinct order_id)      as order_count\nfrom {{ ref('stg_orders') }}\ngroup by 1` }], compare: [{ id: 'warehousing', note: 'Data warehousing is the schema you\'re designing toward; dbt builds and tests the models that populate it.' }, { id: 'airflow', note: 'dbt defines what a transformation does; Airflow usually decides when and in what order it runs.' }] },
  delta:        { name: 'Delta Lake', tag: 'ACID tables & time travel', icon: 'DL', color: T.violet, colorDim: T.violetDim, category: 'processing', what: 'Delta Lake adds ACID transactions, schema enforcement, and time travel to data lake storage, sitting on top of Parquet files that Spark already reads and writes.', why: 'Trainees need Delta Lake to safely handle concurrent writes and to recover or audit a previous version of a table without rebuilding a pipeline from scratch.', how: [{ title: 'Write and read a Delta table', lang: 'python', code: `df.write.format("delta").mode("overwrite").save("/lake/sales_delta")\n\ndf2 = spark.read.format("delta").load("/lake/sales_delta")` }, { title: 'Time travel to a previous version', lang: 'python', code: `df_yesterday = spark.read.format("delta") \\\n    .option("versionAsOf", 12) \\\n    .load("/lake/sales_delta")` }], compare: [{ id: 'pyspark', note: 'Delta Lake is a storage format PySpark reads and writes — it adds safety guarantees on top.' }, { id: 'warehousing', note: 'Delta Lake protects the lake layer; the warehouse schema is the modeled layer built on top of it.' }] },
  warehousing:  { name: 'Data Warehousing', tag: 'Star & snowflake schemas', icon: 'DW', color: T.cyan, colorDim: T.cyanDim, category: 'modeling', what: 'Data warehousing covers designing schemas — star and snowflake — that organize data into fact and dimension tables optimized for analytical queries rather than transactional ones.', why: 'Every downstream dashboard and report depends on a warehouse schema modeled correctly. Trainees who get this wrong create slow queries and inconsistent metrics across the org.', how: [{ title: 'Define a star schema fact table', lang: 'sql', code: `create table fct_sales (\n    sale_id       bigint primary key,\n    date_key      int references dim_date(date_key),\n    customer_key  int references dim_customer(customer_key),\n    product_key   int references dim_product(product_key),\n    amount        numeric(10,2),\n    quantity      int\n);` }], compare: [{ id: 'dbt', note: 'The warehouse schema is the target design; dbt models are the SQL that actually builds and tests it.' }, { id: 'delta', note: 'Delta Lake protects your raw/lake layer; warehousing is about modeling the cleaned layer for fast analytical queries.' }] },
}

const CS_CATEGORIES = [
  { label: 'Processing & Storage',         topics: ['pyspark', 'delta'] },
  { label: 'Streaming & Orchestration',    topics: ['kafka', 'airflow'] },
  { label: 'Transformation & Modeling',    topics: ['dbt', 'warehousing'] },
]

function ContentServiceView() {
  const [activeTopic, setActiveTopic] = useState('pyspark')
  const t = CS_TOPICS_DATA[activeTopic]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Content Service</div>
        <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4 }}>Learning content library — Data Engineering topics, explained as What / Why / How</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 190px', border: `1px solid ${T.borderSoft}`, borderRadius: 14, overflow: 'hidden', background: T.bgGlass, backdropFilter: 'blur(10px)' }}>
        {/* Sidebar */}
        <div style={{ padding: '16px 10px', borderRight: `1px solid ${T.borderSoft}` }}>
          {/* Priority item */}
          <div onClick={() => setActiveTopic('ai-de')} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px',
            borderRadius: 10, cursor: 'pointer', marginBottom: 16,
            border: `1px solid ${activeTopic === 'ai-de' ? T.violet : 'rgba(157,123,255,0.3)'}`,
            background: activeTopic === 'ai-de' ? 'rgba(157,123,255,0.16)' : 'rgba(157,123,255,0.08)',
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, background: T.violetDim, color: T.violet, flexShrink: 0 }}>★</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.textPrimary }}>AI vs Data Engineering</div>
              <span style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: T.violet, background: 'rgba(157,123,255,0.18)', padding: '1px 6px', borderRadius: 4, marginTop: 2, display: 'inline-block' }}>Priority</span>
            </div>
          </div>

          {CS_CATEGORIES.map(cat => (
            <div key={cat.label}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.textTertiary, padding: '14px 11px 7px' }}>{cat.label}</div>
              {cat.topics.map(id => {
                const topic = CS_TOPICS_DATA[id]
                const isActive = activeTopic === id
                return (
                  <div key={id} onClick={() => setActiveTopic(id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
                    borderRadius: 9, cursor: 'pointer',
                    border: `1px solid ${isActive ? 'rgba(59,130,246,0.25)' : 'transparent'}`,
                    background: isActive ? T.flowDim : 'transparent',
                    transition: 'all .15s',
                  }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = T.bgGlassHover }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, background: topic.colorDim, color: topic.color, flexShrink: 0 }}>{topic.icon}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: T.textPrimary }}>{topic.name}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Doc panel */}
        <div style={{ padding: '30px 34px', minHeight: 520, overflowY: 'auto' }}>
          <div style={{ fontSize: 11.5, color: T.textTertiary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ cursor: 'pointer' }}>Content Service</span>
            <span>/</span>
            <span style={{ color: T.textSecondary }}>{t.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, background: t.colorDim, color: t.color, flexShrink: 0 }}>{t.icon}</div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 600, letterSpacing: '-0.01em' }}>{t.name}</div>
              <div style={{ fontSize: 12.5, color: T.textTertiary, marginTop: 2 }}>{t.tag}</div>
            </div>
          </div>
          <div style={{ height: 1, background: T.borderSoft, margin: '20px 0 6px' }} />

          {[
            { id: 'sec-what', color: T.flow,  bg: T.flowDim,  marker: 'W', label: 'What', text: t.what },
            { id: 'sec-why',  color: T.amber, bg: T.amberDim, marker: '?', label: 'Why',  text: t.why },
          ].map(s => (
            <div key={s.id} id={s.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '28px 0 11px', color: s.color }}>
                <span style={{ width: 21, height: 21, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{s.marker}</span>
                {s.label}
              </div>
              <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.75 }}>{s.text}</p>
            </div>
          ))}

          <div id="sec-how">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '28px 0 11px', color: T.green }}>
              <span style={{ width: 21, height: 21, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, background: T.greenDim, color: T.green }}>H</span>
              How
            </div>
            {t.how.map((step, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.textPrimary, marginBottom: 9 }}>{step.title}</div>
                <div style={{ background: '#070A10', border: `1px solid ${T.borderSoft}`, borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: `1px solid ${T.borderSoft}`, background: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.lang}</span>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[0,1,2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: T.border, display: 'inline-block' }} />)}
                    </div>
                  </div>
                  <pre style={{ margin: 0, padding: '14px 16px', overflowX: 'auto' }}>
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.65, color: '#C9D6E8', whiteSpace: 'pre' }}>{step.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {t.compare && (
            <div id="sec-compare">
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '28px 0 11px', color: T.textSecondary }}>
                <span style={{ width: 21, height: 21, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, background: T.bgSurface, color: T.textTertiary }}>≈</span>
                Compare with related topics
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {t.compare.map(c => {
                  const ct = CS_TOPICS_DATA[c.id]
                  return (
                    <div key={c.id} onClick={() => setActiveTopic(c.id)} style={{ background: T.bgSurface, border: `1px solid ${T.borderSoft}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'border-color .15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = T.flow}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = T.borderSoft}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, background: ct.colorDim, color: ct.color, flexShrink: 0 }}>{ct.icon}</div>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.textPrimary }}>{ct.name}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: T.textSecondary, lineHeight: 1.5 }}>{c.note}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* TOC */}
        <div style={{ padding: '24px 18px', borderLeft: `1px solid ${T.borderSoft}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.textTertiary, marginBottom: 10 }}>On this page</div>
          {['What', 'Why', 'How', ...(t.compare ? ['Compare'] : [])].map(lbl => (
            <div key={lbl} style={{ display: 'block', fontSize: 12, color: T.textSecondary, padding: '5px 0 5px 10px', cursor: 'pointer', borderLeft: '2px solid transparent', marginLeft: -1, transition: 'all .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.color = T.textPrimary; (e.currentTarget as HTMLDivElement).style.borderLeftColor = T.flow }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.color = T.textSecondary; (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent' }}
            >{lbl}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Certifications ───────────────────────────────────────────────────────────
function CertificationsView({ showToast }: { showToast: (m: string) => void }) {
  const [approved, setApproved] = useState<Record<string, boolean>>({})
  const certs = [
    { id: 'sana',   initials: 'SK', name: 'Sana Khatri',   desc: 'Capstone: Fraud Detection Pipeline',    score: '97/100', aiEval: <Badge color="green">Passed</Badge>,    mentor: <Badge color="green">Excellent</Badge> },
    { id: 'jordan', initials: 'JW', name: 'Jordan Wells',  desc: 'Capstone: IoT Streaming Analytics',    score: '84/100', aiEval: <Badge color="green">Passed</Badge>,    mentor: <Badge color="blue">Good</Badge> },
  ]
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Certifications</div>
        <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4 }}>4 pending approvals · Digital credential issuance</div>
      </div>
      <Card style={{ padding: 0 }}>
        <TableBase headers={['Trainee', 'Certification', 'AI evaluation', 'Mentor review', 'Action']}>
          {certs.map((c, i) => (
            <tr key={c.id}>
              <Td last={i === certs.length - 1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={c.initials} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: T.textTertiary }}>{c.desc}</div>
                  </div>
                </div>
              </Td>
              <Td last={i === certs.length - 1}><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.score}</span></Td>
              <Td last={i === certs.length - 1}>{c.aiEval}</Td>
              <Td last={i === certs.length - 1}>{c.mentor}</Td>
              <Td last={i === certs.length - 1}>
                {approved[c.id] ? <Badge color="green">Approved</Badge> : (
                  <button onClick={() => { setApproved(p => ({ ...p, [c.id]: true })); showToast(`${c.name}'s certification approved and credential issued`) }} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'linear-gradient(135deg, var(--accent-flow), #3A6FE0)', border: 'none', color: '#fff' }}>Approve</button>
                )}
              </Td>
            </tr>
          ))}
        </TableBase>
      </Card>
    </div>
  )
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function AnalyticsView() {
  const bars = [
    { label: '<60',   h: 30, amber: false },
    { label: '60-70', h: 55, amber: false },
    { label: '70-80', h: 85, amber: false },
    { label: '80-90', h: 100,amber: false },
    { label: '90-95', h: 62, amber: true  },
    { label: '95+',   h: 40, amber: false },
  ]
  const depts = [
    { name: 'Platform Engineering',  pct: 78, amber: false },
    { name: 'Analytics Engineering', pct: 91, amber: false },
    { name: 'Data Platform',         pct: 64, amber: true  },
  ]
  const batches = [
    { name: 'Batch B47',         scores: [92,88,81,90,83,86] },
    { name: 'Batch B48',         scores: [85,68,58,79,65,80] },
    { name: 'Batch B49',         scores: [90,77,61,85,74,78] },
    { name: 'Batch B50 (current)', scores: [81,63,41,67,59,75] },
  ]
  const skills = ['SQL','Spark','Kafka','Airflow','DBT','Cloud']
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  function heatColor(v: number) {
    if (v >= 85) return '#2E8B57'
    if (v >= 70) return '#3a9d63'
    if (v >= 60) return '#C98A2E'
    return '#C9412E'
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Performance Analytics</div>
        <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 4 }}>Organization-wide training metrics · Batches B47–B50</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 16 }}>Assessment Score Distribution</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
            {bars.map(b => (
              <div key={b.label} style={{ flex: 1, height: `${b.h}%`, borderRadius: '6px 6px 0 0', background: b.amber ? 'linear-gradient(180deg, var(--accent-amber), transparent)' : 'linear-gradient(180deg, var(--accent-flow), transparent)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: T.textTertiary }}>
            {bars.map(b => <span key={b.label}>{b.label}</span>)}
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 16 }}>Certification Completion by Department</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {depts.map(d => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span>{d.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.pct}%</span>
                </div>
                <ProgressBar pct={d.pct} amber={d.amber} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>Organization Skill Heatmap</div>
          <div style={{ fontSize: 11.5, color: T.textTertiary }}>Average proficiency (0–100) by batch</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(6, 1fr)', gap: 4, marginTop: 18 }}>
          <div />
          {skills.map(s => <div key={s} style={{ fontSize: 10.5, color: T.textTertiary, textAlign: 'center', paddingBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s}</div>)}
          {batches.map(b => (
            <React.Fragment key={b.name}>
              <div style={{ fontSize: 11.5, color: T.textSecondary, display: 'flex', alignItems: 'center', padding: '8px 4px', fontWeight: 500 }}>{b.name}</div>
              {b.scores.map((v, i) => (
                <div key={i}
                  onMouseEnter={e => { const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); setTooltip({ x: r.left + r.width / 2 - 60, y: r.top - 44, text: `${b.name} — ${skills[i]}: ${v}` }) }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ aspectRatio: '2/1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: '#fff', background: heatColor(v), cursor: 'pointer', transition: 'transform .1s' }}
                  onMouseOver={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)'}
                  onMouseOut={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'}
                >{v}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {tooltip && (
        <div style={{ position: 'fixed', zIndex: 300, background: '#0D1218', border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 11.5, color: T.textPrimary, boxShadow: '0 10px 24px rgba(0,0,0,0.4)', pointerEvents: 'none', left: tooltip.x, top: tooltip.y, whiteSpace: 'nowrap' }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

// ─── Modal shell ──────────────────────────────────────────────────────────────
function Modal({ onClose, title, children, footer }: { onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(6,8,12,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ width: 560, maxHeight: '86vh', overflowY: 'auto', background: '#0D1218', border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textTertiary, cursor: 'pointer', display: 'flex' }}>{Icon.close}</button>
        </div>
        <div style={{ padding: '20px 22px' }}>{children}</div>
        {footer && <div style={{ padding: '16px 22px', borderTop: `1px solid ${T.borderSoft}`, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  )
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', border: `1px solid ${T.border}`, background: T.bgSurface, color: T.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>{children}</button>
}

function BtnPrimary({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', background: 'linear-gradient(135deg, var(--accent-flow), #3A6FE0)', border: 'none', color: '#fff', boxShadow: '0 4px 14px rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>{children}</button>
}

// ─── New Assignment Modal ─────────────────────────────────────────────────────
function NewAssignmentModal({ onClose }: { onClose: () => void }) {
  const [assignTo, setAssignTo] = useState('B50')
  const inputStyle: React.CSSProperties = { width: '100%', background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 12px', color: T.textPrimary, fontSize: 13, fontFamily: 'Inter', outline: 'none' }

  return (
    <Modal onClose={onClose} title="New Assignment" footer={<><Btn onClick={onClose}>Save as draft</Btn><BtnPrimary onClick={onClose}>Publish assignment</BtnPrimary></>}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= 2 ? T.flow : T.border }} />)}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Assignment title</label>
        <input defaultValue="Kafka Event Routing Challenge" style={inputStyle} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Description</label>
        <textarea defaultValue="Configure producers and consumers to correctly route events across three topics under simulated production load." style={{ ...inputStyle, minHeight: 70, resize: 'vertical' } as any} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Type</label>
          <select style={inputStyle}><option>Lab Exercise</option><option>Coding Assessment</option><option>Project Sprint</option><option>Capstone Milestone</option></select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Curriculum phase</label>
          <select style={inputStyle}><option>Phase 3 — Distributed Systems</option><option>Phase 2 — Warehousing & ETL</option><option>Phase 4 — Enterprise Project</option></select>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Assign to</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['B50','B49','Individual trainee','Entire org'].map(opt => (
            <button key={opt} onClick={() => setAssignTo(opt)} style={{ padding: '7px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1px solid ${assignTo === opt ? T.flow : T.border}`, color: assignTo === opt ? T.flow : T.textSecondary, background: assignTo === opt ? T.flowDim : T.bgSurface }}>{opt}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ marginBottom: 0 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Due date</label>
          <input defaultValue="Aug 10, 2026" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 0 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 7, display: 'block' }}>Evaluation mode</label>
          <select style={inputStyle}><option>AI auto-grading</option><option>Mentor review</option><option>Hybrid</option></select>
        </div>
      </div>
    </Modal>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const { msg, visible, showToast } = useToast()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Navbar active={view} setActive={setView} onNewAssignment={() => setModalOpen(true)} showToast={showToast} />

      <main style={{ flex: 1, overflowY: 'auto', padding: '26px 32px 60px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {view === 'dashboard'       && <DashboardView setActive={setView} />}
          {view === 'trainees'        && <TraineesView showToast={showToast} onNewAssignment={() => setModalOpen(true)} />}
          {view === 'assignments'     && <AssignmentsView onNewAssignment={() => setModalOpen(true)} showToast={showToast} />}
          {view === 'content-service' && <ContentServiceView />}
          {view === 'certifications'  && <CertificationsView showToast={showToast} />}
          {view === 'analytics'       && <AnalyticsView />}
        </div>
      </main>

      {modalOpen && <NewAssignmentModal onClose={() => setModalOpen(false)} />}
      <Toast msg={msg} visible={visible} />
    </div>
  )
}
