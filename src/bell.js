// Pooja BGM clip (public/bell.mp3), shared across rings so it never overlaps itself.
let audio

export function ringBell() {
  try {
    audio ??= new Audio(`${import.meta.env.BASE_URL}bell.mp3`)
    if (!audio.paused) return
    audio.currentTime = 0
    audio.playbackRate = 1.1
    audio.play().catch(() => {})
  } catch {
    // no sound, no problem
  }
}

export function stopBell() {
  audio?.pause()
}
