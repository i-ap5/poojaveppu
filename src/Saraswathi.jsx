// Saraswathi Devi artwork (from the supplied EPS, background and title removed).
// Body parts are animated by CSS inside the SVG itself (blink, head tilt,
// earrings, japamala hand, plucking hand, halo dots, lotus petals, swan);
// this wrapper adds the aura and the notes rising from the veena.
import art from './assets/saraswathi.svg'

// Notes are drawn as SVG: music symbols like ♬ are missing from many phone fonts and show as □.
const EIGHTH = (
  <svg viewBox="0 0 16 24" width="0.7em" height="1em">
    <ellipse cx="5" cy="19" rx="4.5" ry="3.4" transform="rotate(-20 5 19)" />
    <path d="M8.6 18V2.5c2.5 2.6 6.4 3.6 5.8 9-1-2.8-3.2-3.9-4.3-4V18z" />
  </svg>
)
const BEAMED = (
  <svg viewBox="0 0 24 24" width="1em" height="1em">
    <ellipse cx="5" cy="19" rx="4.5" ry="3.4" transform="rotate(-20 5 19)" />
    <ellipse cx="18" cy="16.5" rx="4.5" ry="3.4" transform="rotate(-20 18 16.5)" />
    <path d="M8 18.5V5l14-3v14h-1.5V5.8L9.5 8.2v10.3z" />
  </svg>
)

const NOTES = [
  { ch: EIGHTH, delay: 0 },
  { ch: BEAMED, delay: -1.6 },
  { ch: EIGHTH, delay: -3.2 },
]
// extra notes while the pooja is running
const MORE_NOTES = [
  { ch: BEAMED, delay: -0.8 },
  { ch: EIGHTH, delay: -2.4 },
  { ch: BEAMED, delay: -4 },
]

export default function Saraswathi({ playing = false }) {
  return (
    <div className={`devi ${playing ? 'playing' : ''}`} aria-hidden="true">
      <span className="devi-aura" />
      <img className="devi-art" src={art} alt="" width="2180" height="2410" />
      {(playing ? [...NOTES, ...MORE_NOTES] : NOTES).map((n, i) => (
        <span key={i} className="devi-note" style={{ animationDelay: `${n.delay}s`, left: `${80 + (i % 3) * 4}%` }}>
          {n.ch}
        </span>
      ))}
    </div>
  )
}
