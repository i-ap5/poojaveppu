// Temple bell "ding ding" with Web Audio, so no sound file is needed.
let audio

export function ringBell() {
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)()
    audio.resume()
    const base = 880
    for (const start of [0, 0.45]) {
      const t = audio.currentTime + start
      for (const [ratio, gain] of [[1, 0.3], [2, 0.15], [2.76, 0.1], [5.4, 0.05]]) {
        const osc = audio.createOscillator()
        const amp = audio.createGain()
        osc.frequency.value = base * ratio
        amp.gain.setValueAtTime(0.0001, t)
        amp.gain.exponentialRampToValueAtTime(gain, t + 0.01)
        amp.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
        osc.connect(amp).connect(audio.destination)
        osc.start(t)
        osc.stop(t + 2.5)
      }
    }
  } catch {
    // no sound, no problem
  }
}
