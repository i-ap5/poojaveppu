import { useEffect, useRef, useState } from 'react'
import { poojaPdf } from './pooja'
import { ringBell, stopBell } from './bell'
import Saraswathi from './Saraswathi'
import Privacy from './Privacy'
import PurposePicker from './PurposePicker'
import { DEFAULT_LANG, LANGS, STRINGS } from './i18n'

// matches the 14s BGM clip played at 1.1x
const DRAMA_MS = 12700
const LANG_KEY = 'pv-lang'
const SITE_URL = 'https://poojaveppu.pages.dev/'
const HOME_TITLE = document.title
const PRIVACY_TITLE = 'Privacy, Terms & Disclaimer | Digital Poojaveppu'
// /privacy is the real page; #privacy is kept so older shared links still work
const isPrivacyRoute = () => location.pathname.replace(/\/$/, '') === '/privacy' || location.hash === '#privacy'
const CHIT_NO = String(Math.floor(1000 + Math.random() * 9000))
const TODAY = new Date().toLocaleDateString('en-IN')
function Background() {
  return (
    <div className="bg" aria-hidden="true" />
  )
}

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
  const [purpose, setPurpose] = useState(0) // index into cover.purposes
  const [stage, setStage] = useState('idle') // idle | pooja | done | error
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [notPdf, setNotPdf] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [privacy, setPrivacy] = useState(isPrivacyRoute)
  const skipRef = useRef(() => {})
  const t = STRINGS[lang].ui
  const c = STRINGS[lang].cover

  useEffect(() => {
    const onRoute = () => {
      setPrivacy(isPrivacyRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onRoute)
    window.addEventListener('hashchange', onRoute)
    return () => {
      window.removeEventListener('popstate', onRoute)
      window.removeEventListener('hashchange', onRoute)
    }
  }, [])

  // per-page title and canonical, so search engines index /privacy as its own page
  useEffect(() => {
    document.title = privacy ? PRIVACY_TITLE : HOME_TITLE
    document.querySelector('link[rel=canonical]')?.setAttribute('href', privacy ? `${SITE_URL}privacy` : SITE_URL)
  }, [privacy])

  function navigate(e, path) {
    e.preventDefault()
    history.pushState(null, '', path)
    setPrivacy(isPrivacyRoute())
    window.scrollTo(0, 0)
  }

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
      () => setStep((s) => Math.min(s + 1, t.steps[purpose].length - 1)),
      DRAMA_MS / t.steps[purpose].length,
    )
    return () => clearInterval(id)
  }, [stage, t, purpose])

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
    // bring the Devi into view: she's the pooja animation
    window.scrollTo({ top: 0, behavior: 'smooth' })
    ringBell()
    const drama = new Promise((r) => {
      const id = setTimeout(r, DRAMA_MS)
      skipRef.current = () => {
        clearTimeout(id)
        r()
      }
    })
    try {
      const [res] = await Promise.all([poojaPdf(file, name.trim(), lang, purpose), drama])
      setResult(res)
      setStage('done')
    } catch (e) {
      setError(e.message)
      setStage('error')
    } finally {
      // BGM is only for the loading screen (also cuts it short on skip)
      stopBell()
    }
  }

  function download() {
    const a = document.createElement('a')
    a.href = result.url
    a.download = result.fileName
    a.click()
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
    setStage('idle')
  }

  const shareText = `${t.shareText} ${SITE_URL}`
  const share = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  // Phones: share the PDF file itself via the share sheet (a blob: link is useless to anyone else).
  // Where file sharing isn't supported, the link falls through to the WhatsApp text message.
  function sharePdf(e) {
    const pdf = new File([result.blob], result.fileName, { type: 'application/pdf' })
    if (!navigator.canShare?.({ files: [pdf] })) return
    e.preventDefault()
    navigator.share({ files: [pdf], text: shareText }).catch(() => {
      // cancelled by the user
    })
  }

  return (
    <div className="page">
      <Background />
      <div className="langs" role="group" aria-label="Language">
        {LANGS.map((l) => (
          <button
            key={l.id}
            lang={l.id}
            className={l.id === lang ? 'on' : ''}
            aria-pressed={l.id === lang}
            onClick={() => setLang(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {privacy ? (
        <Privacy back={t.back} onBack={(e) => navigate(e, '/')} />
      ) : (
        <main className="layout">
          <header>
            <Saraswathi playing={stage === 'pooja'} />
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

              <PurposePicker label={c.fields[2]} options={c.purposes} value={purpose} onChange={setPurpose} />

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
              <p className="step" key={step} aria-live="polite">
                {t.steps[purpose][step]}
              </p>
              <div className="dots" aria-hidden="true">
                {t.steps[purpose].map((_, i) => (
                  <span key={i} className={i < step ? 'lit' : i === step ? 'lit now' : ''} />
                ))}
              </div>
              <div className="bar">
                <span style={{ animationDuration: `${DRAMA_MS}ms` }} />
              </div>
              <p className="muted">{t.busy}</p>
              <button className="link skip" onClick={() => skipRef.current()}>
                {t.skip}
              </button>
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
              <a className="secondary" href={share} target="_blank" rel="noreferrer" onClick={sharePdf}>
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
        <p className="satire">{t.satire}</p>
        {t.footer} · <a href="/privacy" onClick={(e) => navigate(e, '/privacy')}>
          {t.privacyLink}
        </a>
      </footer>
    </div>
  )
}
