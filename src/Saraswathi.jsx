// Saraswathi Devi artwork (from the supplied EPS, background and title removed).
// Body parts are animated by CSS inside the SVG itself (blink, head tilt,
// earrings, japamala hand, plucking hand, halo dots, lotus petals, swan);
// this wrapper adds the aura and the notes rising from the veena.
import art from './assets/saraswathi.svg'

const NOTES = [
  { ch: '♪', delay: 0 },
  { ch: '♫', delay: -1.6 },
  { ch: '♪', delay: -3.2 },
]

export default function Saraswathi() {
  return (
    <div className="devi" aria-hidden="true">
      <span className="devi-aura" />
      <img className="devi-art" src={art} alt="" width="2180" height="2410" />
      {NOTES.map((n, i) => (
        <span key={i} className="devi-note" style={{ animationDelay: `${n.delay}s`, left: `${80 + i * 4}%` }}>
          {n.ch}
        </span>
      ))}
    </div>
  )
}
