import { useEffect, useState } from 'react'
import { poojaPdf } from './pooja'
import { ringBell } from './bell'
import Saraswathi from './Saraswathi'
import Privacy from './Privacy'
import { DEFAULT_LANG, LANGS, STRINGS } from './i18n'

const DRAMA_MS = 4900
const LANG_KEY = 'pv-lang'
const CHIT_NO = String(Math.floor(1000 + Math.random() * 9000))
const TODAY = new Date().toLocaleDateString('en-IN')
function Background() {
  return (
    <div className="bg" aria-hidden="true" />
  )
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const isPdf = (f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name)

function savedLang() {
  try {
    const l = localStorage.getItem(LANG_KEY)
    return STRINGS[l] ? l : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

export default function App() {
  const [lang, setLang] = useState(savedLang)
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [stage, setStage] = useState('idle') // idle | pooja | done | error
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [notPdf, setNotPdf] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [hash, setHash] = useState(() => location.hash)
  const t = STRINGS[lang].ui
  const c = STRINGS[lang].cover

  useEffect(() => {
    const onHash = () => {
      setHash(location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // private mode etc.
    }
  }, [lang])

  useEffect(() => {
    if (stage !== 'pooja') return
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, t.steps.length - 1)),
      DRAMA_MS / t.steps.length,
    )
    return () => clearInterval(id)
  }, [stage, t])

  useEffect(
    () => () => {
      if (!result) return
      URL.revokeObjectURL(result.url)
      URL.revokeObjectURL(result.previewUrl)
    },
    [result],
  )

  function pickFile(f) {
    if (!f) return
    setNotPdf(!isPdf(f))
    if (isPdf(f)) setFile(f)
  }

  async function startPooja() {
    setStep(0)
    setStage('pooja')
    ringBell()
    try {
      const [res] = await Promise.all([poojaPdf(file, name.trim(), lang), wait(DRAMA_MS)])
      setResult(res)
      setStage('done')
      ringBell()
    } catch (e) {
      setError(e.message)
      setStage('error')
    }
  }

  function download() {
    const a = document.createElement('a')
    a.href = result.url
    a.download = `${result.baseName}${t.fileSuffix}.pdf`
    a.click()
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
    setStage('idle')
  }

  const share = `https://wa.me/?text=${encodeURIComponent(`${t.shareText} ${location.href}`)}`

  return (
    <div className="page">
      <Background />
      <div className="langs" role="group" aria-label="Language">
        {LANGS.map((l) => (
          <button
            key={l.id}
            className={l.id === lang ? 'on' : ''}
            aria-pressed={l.id === lang}
            onClick={() => setLang(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {hash === '#privacy' ? (
        <Privacy back={t.back} />
      ) : (
        <main className="layout">
          <header>
            <Saraswathi />
            <p className="chip">{t.script}</p>
            <h1>Digital Poojaveppu</h1>
            <p className="tag">{t.tag}</p>
          </header>

          {stage === 'idle' && (
            <section
              className={`card chit ${dragging ? 'over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                pickFile(e.dataTransfer.files[0])
              }}
            >
              <div className="chit-head">
                <h2 className="receipt-title">{c.receiptTitle}</h2>
                <p className="trust">{c.temple}</p>
                <div className="chit-meta">
                  <span>
                    {c.chitNumLabel} {CHIT_NO}
                  </span>
                  <span>
                    {c.dateLabel}: {TODAY}
                  </span>
                </div>
              </div>

              <label className="row">
                <span>{c.fields[0]}</span>
                <input
                  value={name}
                  maxLength={40}
                  placeholder={t.namePlaceholder}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="row pick" aria-label={t.drop}>
                <span>{c.fields[3]}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  hidden
                  onChange={(e) => pickFile(e.target.files[0])}
                />
                <span className={`slot ${file ? 'picked' : ''}`}>
                  <svg className="clip" viewBox="0 0 16 30" aria-hidden="true">
                    <path d="M11 8v14a3 3 0 0 1-6 0V5a4 4 0 0 1 8 0v16a5 5 0 0 1-10 0V9" />
                  </svg>
                  <span className="slot-text">
                    <strong>{file ? file.name : t.choose}</strong>
                    <small>{file ? `${(file.size / 1e6).toFixed(1)} MB • ${t.change}` : t.dropSub}</small>
                  </span>
                </span>
              </label>
              {notPdf && <p className="hint">{t.notPdf}</p>}

              <div className="row">
                <span>{c.fields[2]}</span>
                <span className="fill">{c.offering}</span>
              </div>

              <button className="stamp" disabled={!file} onClick={startPooja}>
                {t.start}
              </button>
              <div className="chit-end">
                <p className="privacy">{t.privacy}</p>
                <div className="sign">
                  <span>Sd/-</span>
                  <small>{c.signLabel}</small>
                </div>
              </div>
              <p className="disclaimer">{t.disclaimer}</p>
            </section>
          )}

          {stage === 'pooja' && (
            <section className="card pooja">
              <div className="altar" aria-hidden="true">
                <span className="pulse" />
                <span className="pulse" style={{ animationDelay: '0.8s' }} />
                <span className="diya">🪔</span>
              </div>
              <p className="step" key={step}>
                {t.steps[step]}
              </p>
              <div className="bar">
                <span style={{ animationDuration: `${DRAMA_MS}ms` }} />
              </div>
              <p className="muted">{t.busy}</p>
            </section>
          )}

          {stage === 'done' && result && (
            <section className="card done">
              <h2>{t.doneTitle}</h2>
              <p>{t.doneText(result.pageCount)}</p>
              {result.pageCount > 100 && <p className="hint">{t.tired(result.pageCount)}</p>}
              <img className="preview" src={result.previewUrl} alt={t.previewAlt} />
              <button className="primary" onClick={download}>
                {t.download}
              </button>
              <a className="secondary" href={share} target="_blank" rel="noreferrer">
                {t.share}
              </a>
              <button className="link" onClick={reset}>
                {t.again}
              </button>
            </section>
          )}

          {stage === 'error' && (
            <section className="card done">
              <h2>{t.errTitle}</h2>
              <p>{t.errors[error] ?? t.errors.generic}</p>
              <button className="primary" onClick={reset}>
                {t.retry}
              </button>
            </section>
          )}
        </main>
      )}

      <footer>
        {t.footer} · <a href="#privacy">{t.privacyLink}</a>
      </footer>
    </div>
  )
}
