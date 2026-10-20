import { drawCover } from './cover'
import { STRINGS } from './i18n'

const A4 = [595.28, 841.89]

// Strip any earlier pooja suffix (in any language) so a re-pooja'd file doesn't get two
const SUFFIXES = Object.values(STRINGS).map((s) => s.ui.fileSuffix)
function outName(fileName, lang) {
  let base = fileName.replace(/\.pdf$/i, '')
  for (let again = true; again; ) {
    again = false
    for (const s of SUFFIXES)
      if (base.toUpperCase().endsWith(s)) {
        base = base.slice(0, -s.length)
        again = true
      }
  }
  return `${base}${STRINGS[lang].ui.fileSuffix}.pdf`
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

// Adds the pooja cover as page 1. Runs fully in the browser.
// Throws Error('damaged' | 'locked'), which the UI translates.
export async function poojaPdf(file, name, lang, purpose) {
  const { PDFDocument } = await import('pdf-lib')

  let pdf
  try {
    pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
  } catch {
    throw new Error('damaged')
  }
  if (pdf.isEncrypted) throw new Error('locked')

  const pageCount = pdf.getPageCount()
  // cover takes the same shape as the first page, as it is displayed (rotation applied)
  let [width, height] = A4
  if (pageCount > 0) {
    const first = pdf.getPage(0)
    const size = first.getSize()
    const turned = first.getRotation().angle % 180 !== 0
    ;[width, height] = turned ? [size.height, size.width] : [size.width, size.height]
  }

  const canvas = await drawCover({ name, fileName: file.name, pageCount, lang, purpose, pageW: width, pageH: height })
  const jpeg = await toBlob(canvas, 'image/jpeg', 0.9)
  const image = await pdf.embedJpg(await jpeg.arrayBuffer())

  const page = pdf.insertPage(0, [width, height])
  page.drawImage(image, { x: 0, y: 0, width, height })

  const bytes = await pdf.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  return {
    blob,
    url: URL.createObjectURL(blob),
    previewUrl: URL.createObjectURL(jpeg),
    // fixed to the cover's language, even if the language is switched before downloading
    fileName: outName(file.name, lang),
    pageCount,
  }
}
