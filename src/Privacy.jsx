// Privacy policy and disclaimer, shown at /privacy (and the older #privacy).
// Keep every statement here true to what the code does; update the date when it changes.

import { useEffect, useState } from 'react'

// Web3Forms access key (free, from web3forms.com). It is public by design: messages are forwarded to the
// owner's inbox without the address ever appearing on the site. The contact section is hidden while empty.
const WEB3FORMS_KEY = 'be463a9e-72d4-40c8-866a-d4b0cd18135e'
const UPDATED = '20 October 2026'

const TOASTS = {
  sent: '🪔 Message sent! Thank you 🙏',
  error: '⚠️ Could not send right now. Please try again in a bit.',
}

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  function finish(next) {
    setStatus(next)
    setToast({ kind: next, key: Date.now() })
  }

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          access_key: WEB3FORMS_KEY,
          subject: 'Digital Poojaveppu: new message',
        }),
      })
      if (!(await res.json()).success) throw new Error()
      form.reset()
      finish('sent')
    } catch {
      finish('error')
    }
  }

  const toastEl = toast && (
    <div key={toast.key} className={`toast ${toast.kind}`} role="status" aria-live="polite">
      {TOASTS[toast.kind]}
    </div>
  )

  if (status === 'sent')
    return (
      <>
        <div className="form-done">
          <span className="recv">Received ✓</span>
          <p>Thank you! Your message has been sent. We will read it soon. 🙏</p>
          <button className="link" onClick={() => setStatus('idle')}>
            Send another message
          </button>
        </div>
        {toastEl}
      </>
    )

  return (
    <form className="contact" onSubmit={submit}>
      <label>
        Name <span>(optional)</span>
        <input name="name" maxLength={80} autoComplete="name" />
      </label>
      <label>
        Email <span>(optional, only if you want a reply)</span>
        <input name="email" type="email" maxLength={120} autoComplete="email" />
      </label>
      <label>
        Message
        <textarea name="message" required minLength={5} maxLength={3000} rows={5} />
      </label>
      {/* honeypot: bots fill it, people never see it */}
      <input type="checkbox" name="botcheck" className="trap" tabIndex={-1} autoComplete="off" />
      <button className="primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'error' && <p className="form-note">Could not send right now. Please try again in a bit.</p>}
      {toastEl}
    </form>
  )
}

export default function Privacy({ back, onBack }) {
  return (
    <article className="card policy">
      <a className="back" href="/" onClick={onBack}>
        {back}
      </a>
      <h2>Privacy Policy, Terms of Use &amp; Disclaimer</h2>
      <p className="updated">Last updated: {UPDATED}</p>

      <h3>In short</h3>
      <ul>
        <li>Your PDF is never uploaded. Everything happens inside your own browser.</li>
        <li>We have no accounts, no analytics, no ads, no cookies and no tracking.</li>
        <li>This is a fun, unofficial parody. It is not a real temple, trust or receipt.</li>
        <li>
          It is satire and humour only. No offence is intended to any religion, faith, deity, ritual, community or
          person.
        </li>
        <li>By using this site you agree to the terms below.</li>
      </ul>

      <h3>1. Your PDF and your name</h3>
      <p>
        When you choose a PDF, your browser reads it on your device and adds a cover page to a copy of it. The file is
        not sent to us or to anyone else, and we cannot see it. Your original file is not changed.
      </p>
      <p>
        The name you type (optional), the purpose you pick (ഉദ്ദേശം), the file name and the page count are printed only
        on that cover page, which is created on your device. The receipt number, the “star” and the terms shown on the
        cover are chosen at random just for fun and say nothing about you. Nothing is kept after you close or reload the
        page, except the downloaded PDF you choose to save.
      </p>
      <p>
        The cover is made the same size and shape as the first page of your PDF. Your own pages are copied over as they
        are; only the cover page is added at the front.
      </p>

      <h3>2. What is stored on your device</h3>
      <p>
        We save only your language choice (Malayalam, Tamil or English) in your browser’s local storage, so the site
        opens in the same language next time. You can clear it at any time from your browser settings. We do not set
        cookies.
      </p>

      <h3>3. Sound</h3>
      <p>
        When you start the pooja, a short background audio clip plays while the loading screen is shown and stops when
        it ends or when you tap skip. The clip is part of this website itself and is played by your browser; playing it
        sends nothing about you anywhere. You can mute it with your device’s volume controls.
      </p>

      <h3>4. Third-party services</h3>
      <ul>
        <li>
          <strong>Google Fonts:</strong> the site’s fonts are loaded from Google’s servers, so your browser’s request
          (including your IP address and browser details) reaches Google. See{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Google’s Privacy Policy
          </a>
          .
        </li>
        <li>
          <strong>Sharing:</strong> only if you tap the share button. On devices that support it, your phone’s share
          menu opens with your pooja PDF, a short text and a link to this site, and you choose the app and the person;
          the file goes straight from your device to that app, never through us. Elsewhere, WhatsApp opens with only the
          text and the link, and your PDF is not shared. The app you choose has its own privacy policy.
        </li>
        <li>
          <strong>Contact form:</strong> only if you send a message, the name, email and message you type are passed
          to Web3Forms, which forwards them to us by email. See{' '}
          <a href="https://web3forms.com/privacy" target="_blank" rel="noreferrer">
            Web3Forms’ Privacy Policy
          </a>
          .
        </li>
        <li>
          <strong>Hosting:</strong> like any website, our hosting provider may keep standard server logs (such as IP
          address, browser type and time of visit) for security and reliability. We do not use them to identify you.
        </li>
      </ul>

      <h3>5. Children and students</h3>
      <p>
        The site is meant for everyone, including students. Because we do not collect personal information, no personal
        data of children is gathered or stored by us.
      </p>

      <h3>6. Disclaimer</h3>
      <ul>
        <li>
          Digital Poojaveppu is made for fun and entertainment during the Poojaveppu / Saraswathi Pooja season. The
          “Digital Poojaveppu Counter, Pusthakapuram”, the receipt, its numbers, registration and phone details are all
          fictional.
        </li>
        <li>
          It is not connected to any temple, devaswom, trust or religious organisation, and no actual pooja or religious
          service is performed. It is not a substitute for any real ritual.
        </li>
        <li>
          The purposes you can pick (Dhana Yogam, Kaarya Laabham, Uddishta Kaarya Siddhi, tasty non-veg food) and the
          loading messages are jokes. Picking one does not promise or predict money, success, a wish coming true, or a
          meal. The cover is not proof of any offering or payment, and the “Rs 151/-” on it is not a real charge: the
          site is free and asks for no money.
        </li>
        <li>
          It is made with respect for the tradition. The jokes are about studying, work, money and everyday life, never
          about the Devi or the pooja. If anything here hurts your sentiments, please tell us and we will review it
          promptly.
        </li>
        <li>
          The site is provided “as is”, without any warranty. Always keep your original files. And no, it does not
          affect your exam results.
        </li>
      </ul>

      <h3>7. Terms of use</h3>
      <ul>
        <li>
          <strong>Satire and parody.</strong> All content on this site, including the receipt, purposes, loading
          messages and cover page, is humour and parody made in good faith. It is not meant to mock, insult or hurt the
          religious feelings of anyone. Please use it only in that spirit.
        </li>
        <li>
          <strong>Your files, your responsibility.</strong> Use only PDFs that you own or are allowed to use. You are
          responsible for the files you choose and for how you use or share the resulting PDF. Do not use the site to
          create anything unlawful, misleading or offensive, or to pass the cover off as a real receipt or document.
        </li>
        <li>
          <strong>No liability.</strong> The site is free and provided “as is” and “as available”. To the fullest
          extent permitted by law, the makers are not liable for any loss or damage arising from using it, including
          lost or damaged files, missed studies, exam results or hurt feelings.
        </li>
        <li>
          <strong>No affiliation.</strong> Names of films, places, fonts and other works mentioned belong to their
          respective owners and are used only for reference or parody. No endorsement is implied.
        </li>
        <li>
          <strong>Changes and removal.</strong> We may change, pause or remove the site, or any part of it, at any time.
          If you have a concern about any content, contact us and we will review it in good faith and remove it where
          appropriate.
        </li>
        <li>
          <strong>Governing law.</strong> These terms are governed by the laws of India.
        </li>
      </ul>

      <h3>8. Credits</h3>
      <p>
        Fonts: Nupuram and Manjari (Swathanthra Malayalam Computing), Anek Malayalam, Noto Sans Malayalam, Baloo Thambi
        2, Bungee, Archivo and Caveat, all under the SIL Open Font License. The Saraswathi Devi illustration is used
        under its licence. PDF handling uses the open-source pdf-lib library (MIT License).
      </p>
      <p>
        The background audio is a short excerpt from the Malayalam film <em>Nandanam</em> (2002), used briefly for
        parody and fun. All rights in it belong to its respective owners. If you own the rights and want it removed,
        please contact us and we will take it down.
      </p>

      <h3>9. Changes</h3>
      <p>If this policy or these terms change, the new version will be posted on this page with a new date.</p>

      {WEB3FORMS_KEY && (
        <>
          <h3 id="contact">10. Contact</h3>
          <p>
            Questions, concerns, or a removal request? Send us a message below. Only what you type here is sent: it is
            delivered through Web3Forms (a form-to-email service) and used only to read and reply to your message. Leave
            the email empty if you do not need a reply.
          </p>
          <ContactForm />
        </>
      )}
    </article>
  )
}
