import { drawCover } from './cover'

const A4 = [595.28, 841.89]

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

// Adds the pooja cover as page 1. Runs fully in the browser.
// Throws Error('damaged' | 'locked'), which the UI translates.
export async function poojaPdf(file, name, lang) {
  const { PDFDocument, rgb } = await import('pdf-lib')

  let pdf
  try {
    pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
  } catch {
    throw new Error('damaged')
  }
  if (pdf.isEncrypted) throw new Error('locked')

  const pageCount = pdf.getPageCount()
  let [width, height] = A4
  if (pageCount > 0) {
    const size = pdf.getPage(0).getSize()
    // match the first page, unless it's landscape
    if (size.height >= size.width) ({ width, height } = size)
  }

  const canvas = await drawCover({ name, fileName: file.name, pageCount, lang })
  const jpeg = await toBlob(canvas, 'image/jpeg', 0.9)
  const image = await pdf.embedJpg(await jpeg.arrayBuffer())

  const page = pdf.insertPage(0, [width, height])
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.31, 0.6, 0.21) })
  const scale = Math.min(width / image.width, height / image.height)
  const w = image.width * scale
  const h = image.height * scale
  page.drawImage(image, { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h })

  const bytes = await pdf.save()
  return {
    url: URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })),
    previewUrl: URL.createObjectURL(jpeg),
    baseName: file.name.replace(/\.pdf$/i, ''),
    pageCount,
  }
}
