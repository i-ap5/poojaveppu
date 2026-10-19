// Privacy policy and disclaimer, shown at #privacy.
// Keep every statement here true to what the code does; update the date when it changes.

// Set this to a contact address before publishing; the contact section is hidden while empty.
const CONTACT_EMAIL = ''
const UPDATED = '20 October 2026'

export default function Privacy({ back }) {
  return (
    <article className="card policy">
      <a className="back" href="#">
        {back}
      </a>
      <h2>Privacy Policy &amp; Disclaimer</h2>
      <p className="updated">Last updated: {UPDATED}</p>

      <h3>In short</h3>
      <ul>
        <li>Your PDF is never uploaded. Everything happens inside your own browser.</li>
        <li>We have no accounts, no analytics, no ads, no cookies and no tracking.</li>
        <li>This is a fun, unofficial parody. It is not a real temple, trust or receipt.</li>
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
          <strong>WhatsApp sharing:</strong> only if you tap the share button, WhatsApp opens with a ready-made message
          containing a short text and a link to this site. Your PDF is not shared. WhatsApp’s own privacy policy applies
          there.
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

      <h3>7. Credits</h3>
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

      <h3>8. Changes</h3>
      <p>If this policy changes, the new version will be posted on this page with a new date.</p>

      {CONTACT_EMAIL && (
        <>
          <h3>9. Contact</h3>
          <p>
            Questions or concerns? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </>
      )}
    </article>
  )
}
