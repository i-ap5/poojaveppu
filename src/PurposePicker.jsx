import { useEffect, useRef, useState } from 'react'

// Receipt-styled dropdown: a handwritten line that opens a small paper slip of options.
export default function PurposePicker({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  function pick(i) {
    onChange(i)
    setOpen(false)
  }

  return (
    <div className="row purpose" ref={ref}>
      <span>{label}</span>
      <button
        type="button"
        className={`fill purpose-btn ${open ? 'open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="purpose-val">{options[value]}</span>
        <span className="caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="purpose-list" role="listbox" aria-label={label}>
          {options.map((p, i) => (
            <li key={i} role="option" aria-selected={i === value}>
              <button type="button" className={i === value ? 'on' : ''} onClick={() => pick(i)}>
                {p}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
