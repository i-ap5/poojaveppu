// Draws the cover page on a canvas (~150dpi): a temple "vazhipadu receipt"
// lying on a banana leaf. The leaf fills whatever shape the PDF's pages are;
// the A4-sized artwork is centred on it. Drawing on canvas (instead of pdf-lib
// text) means Malayalam and Tamil render correctly.
import { STRINGS } from './i18n'

// Malayalam uses the app's own fonts: Manjari for print, Nupuram for the banner
const PRINT_FONTS = {
  ml: '"Manjari", "Noto Sans Malayalam", sans-serif',
  ta: '"Baloo Thambi 2", sans-serif',
  en: '"Baloo Thambi 2", sans-serif',
}
const TITLE_FONTS = {
  ml: '"Nupuram", "Manjari", sans-serif',
  ta: PRINT_FONTS.ta,
  en: PRINT_FONTS.en,
}
let PRINT = PRINT_FONTS.en // set per language in drawCover
let TITLE = TITLE_FONTS.en
// Caveat has no Indic glyphs: Manjari keeps Malayalam values soft and handwritten-looking
const HAND = '"Caveat", "Manjari", "Baloo Thambi 2", cursive'
export const COVER_W = 1240
export const COVER_H = 1754
const RW = 1080
const RH = 1120

const C = {
  ink: '#1f2a5a',
  pen: '#1c3fa8',
  red: '#d0021b',
  maroon: '#7a1424',
  gold: '#c9962b',
  sandal: '#e9c98b',
}

// real nakshatra names with a pun, so the "star" field reads like a proper receipt entry
const STARS = [
  'Chathayam (sleep mode)',
  'Moolam (of all problems)',
  'Uthradam (last-minute rush)',
  'Thiruvathira (night owl)',
  'Karthika (midnight oil)',
  'Revathi (revision pending)',
]

async function loadFonts(c) {
  const sample = [c.title, c.temple, c.regLine, c.payLine, c.fields, c.purposes, c.trolls, c.footer, c.signLabel]
    .flat()
    .join(' ')
  await Promise.all([
    ...[400, 600, 800].flatMap((w) => [
      document.fonts.load(`${w} 40px "Noto Sans Malayalam"`, sample),
      document.fonts.load(`${w} 40px "Baloo Thambi 2"`, sample),
    ]),
    document.fonts.load('700 40px "Caveat"', 'Aa0/'),
    document.fonts.load('400 40px "Manjari"', sample),
    document.fonts.load('700 40px "Manjari"', sample),
    document.fonts.load('800 40px "Nupuram"', c.title.join(' ')),
  ])
}

function setFont(ctx, size, weight, family) {
  ctx.font = `${weight} ${size}px ${family}`
}

function truncate(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text
  const chars = [...text]
  while (chars.length > 1 && ctx.measureText(chars.join('') + '…').width > maxWidth) chars.pop()
  return chars.join('') + '…'
}

// Draws text, shrinking it (down to 60%) and then truncating to fit maxWidth.
function text(ctx, str, x, y, { size, weight = 400, family = PRINT, color = C.ink, align = 'left', maxWidth = 2000 }) {
  setFont(ctx, size, weight, family)
  const w = ctx.measureText(str).width
  if (w > maxWidth) setFont(ctx, Math.max(Math.floor(size * 0.6), Math.floor((size * maxWidth) / w)), weight, family)
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = color
  ctx.fillText(truncate(ctx, str, maxWidth), x, y)
  return ctx.measureText(str).width
}

function circle(ctx, x, y, r) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
}

// Vazha ila: raised midrib, dense curved veins in uneven bands, mottled colour,
// glossy sheen, yellowing edges and a couple of natural splits along the veins.
function bananaLeaf(ctx, W, H) {
  const midX = 110
  const slope = 0.2 // veins rise gently away from the midrib
  const veinEnd = (x0, y0, x1) => y0 - Math.abs(x1 - x0) * slope

  // base colour, a little lighter along the middle of the blade
  const g = ctx.createLinearGradient(0, 0, W, 0)
  g.addColorStop(0, '#2c6b22')
  g.addColorStop(0.25, '#3f8a2c')
  g.addColorStop(0.6, '#4c9631')
  g.addColorStop(1, '#346f24')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // mottling: soft patches of yellow-green and deep green
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * W
    const y = Math.random() * H
    const r = 120 + Math.random() * 260
    const m = ctx.createRadialGradient(x, y, 0, x, y, r)
    const c = i % 3 === 0 ? '120,170,50' : '20,70,15'
    m.addColorStop(0, `rgba(${c},${0.08 + Math.random() * 0.1})`)
    m.addColorStop(1, `rgba(${c},0)`)
    ctx.fillStyle = m
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  // bands between veins: uneven light/dark strips
  const step = 7
  for (let y = -60; y < H + W * slope + 60; y += step) {
    const shade = Math.random()
    if (shade > 0.35 && shade < 0.75) continue
    ctx.fillStyle = shade < 0.35 ? `rgba(10,50,5,${shade * 0.18})` : `rgba(200,240,150,${(shade - 0.75) * 0.22})`
    const h = step * (1 + Math.floor(Math.random() * 3))
    ctx.beginPath()
    ctx.moveTo(midX, y)
    ctx.quadraticCurveTo((midX + W) / 2, veinEnd(midX, y, (midX + W) / 2) + 6, W, veinEnd(midX, y, W))
    ctx.lineTo(W, veinEnd(midX, y + h, W))
    ctx.quadraticCurveTo((midX + W) / 2, veinEnd(midX, y + h, (midX + W) / 2) + 6, midX, y + h)
    ctx.fill()
  }

  // fine veins, both sides of the midrib
  for (let y = -60; y < H + W * slope + 60; y += step) {
    const strong = Math.random() < 0.18
    ctx.lineWidth = strong ? 2.2 : 1
    ctx.strokeStyle = strong ? 'rgba(10,55,5,0.22)' : `rgba(215,250,170,${0.07 + Math.random() * 0.07})`
    ctx.beginPath()
    ctx.moveTo(midX, y)
    ctx.quadraticCurveTo((midX + W) / 2, veinEnd(midX, y, (midX + W) / 2) + 6, W, veinEnd(midX, y, W))
    ctx.moveTo(midX, y)
    ctx.lineTo(0, veinEnd(midX, y, 0))
    ctx.stroke()
  }

  // natural splits along a vein: a thin pale gap with a dark lip
  for (let i = 0; i < 2; i++) {
    const y = H * (0.3 + i * 0.38) + Math.random() * 60
    const x0 = W * (0.55 + Math.random() * 0.15)
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x0, veinEnd(midX, y, x0))
    ctx.lineTo(W, veinEnd(midX, y, W) - 3)
    ctx.lineTo(W, veinEnd(midX, y, W) + 5)
    ctx.closePath()
    ctx.fillStyle = 'rgba(15,45,10,0.55)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(190,230,140,0.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }

  // glossy sheen
  const sheen = ctx.createLinearGradient(0, 0, W, H)
  sheen.addColorStop(0, 'rgba(255,255,255,0)')
  sheen.addColorStop(0.42, 'rgba(255,255,240,0.10)')
  sheen.addColorStop(0.5, 'rgba(255,255,240,0.03)')
  sheen.addColorStop(0.62, 'rgba(255,255,240,0.08)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, W, H)

  // yellowing towards the outer edge
  const edge = ctx.createLinearGradient(W - 160, 0, W, 0)
  edge.addColorStop(0, 'rgba(170,170,40,0)')
  edge.addColorStop(1, 'rgba(170,170,40,0.22)')
  ctx.fillStyle = edge
  ctx.fillRect(W - 160, 0, 160, H)

  // shadow the raised midrib casts on the blade
  const shadow = ctx.createLinearGradient(midX + 20, 0, midX + 70, 0)
  shadow.addColorStop(0, 'rgba(0,30,0,0.28)')
  shadow.addColorStop(1, 'rgba(0,30,0,0)')
  ctx.fillStyle = shadow
  ctx.fillRect(midX + 20, 0, 50, H)

  // raised, rounded midrib
  const rib = ctx.createLinearGradient(midX - 22, 0, midX + 22, 0)
  rib.addColorStop(0, '#5f9638')
  rib.addColorStop(0.3, '#b9d88a')
  rib.addColorStop(0.45, '#e2f2c4')
  rib.addColorStop(0.7, '#9cc46a')
  rib.addColorStop(1, '#4f8530')
  ctx.fillStyle = rib
  ctx.fillRect(midX - 22, 0, 44, H)
  ctx.strokeStyle = 'rgba(40,80,20,0.35)'
  ctx.lineWidth = 1
  for (const dx of [-8, 6]) {
    ctx.beginPath()
    ctx.moveTo(midX + dx, 0)
    ctx.lineTo(midX + dx, H)
    ctx.stroke()
  }

  // fine grain
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,220,0.05)' : 'rgba(0,30,0,0.06)'
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5)
  }
}

function marigold(ctx, x, y, r) {
  const rings = [
    [r, '#f08c00', 12],
    [r * 0.7, '#f59f00', 9],
    [r * 0.42, '#fcc419', 7],
  ]
  for (const [rr, color, n] of rings) {
    ctx.fillStyle = color
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rr
      circle(ctx, x + Math.cos(a) * rr * 0.6, y + Math.sin(a) * rr * 0.6, rr * 0.45)
      ctx.fill()
    }
  }
  ctx.fillStyle = '#d9480f'
  circle(ctx, x, y, r * 0.16)
  ctx.fill()
}

// Chembarathi (red hibiscus)
function hibiscus(ctx, x, y, r, rot) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  const g = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r)
  g.addColorStop(0, '#8b0a0a')
  g.addColorStop(0.35, '#d62020')
  g.addColorStop(1, '#f03e3e')
  ctx.fillStyle = g
  for (let i = 0; i < 5; i++) {
    ctx.rotate((Math.PI * 2) / 5)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-r * 0.75, -r * 0.3, -r * 0.8, -r * 1.05, 0, -r)
    ctx.bezierCurveTo(r * 0.8, -r * 1.05, r * 0.75, -r * 0.3, 0, 0)
    ctx.fill()
  }
  ctx.strokeStyle = '#fff0d9'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(r * 0.25, -r * 0.95)
  ctx.stroke()
  ctx.fillStyle = '#fcc419'
  for (let i = 0; i < 6; i++) {
    circle(ctx, r * 0.25 + Math.cos(i) * 7, -r * 0.95 + Math.sin(i) * 7, 4)
    ctx.fill()
  }
  ctx.restore()
}

function smudge(ctx, x, y, r, color, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  for (let i = 0; i < 14; i++) {
    circle(ctx, x + (Math.random() - 0.5) * r, y + (Math.random() - 0.5) * r * 0.6, r * (0.15 + Math.random() * 0.25))
    ctx.fill()
  }
  ctx.restore()
}

function banner(ctx, c) {
  const x = 90
  const y = 70
  const w = COVER_W - 180
  const h = 240
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 8
  ctx.fillStyle = '#fff8e7'
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, 22)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = C.maroon
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.roundRect(x + 12, y + 12, w - 24, h - 24, 14)
  ctx.stroke()

  const mid = COVER_W / 2
  text(ctx, c.title[0], mid, y + 105, { size: 72, weight: 800, family: TITLE, color: C.maroon, align: 'center', maxWidth: w - 220 })
  text(ctx, c.title[1], mid, y + 190, { size: 64, weight: 800, family: TITLE, color: C.maroon, align: 'center', maxWidth: w - 220 })
  marigold(ctx, x + 70, y + h / 2, 36)
  marigold(ctx, x + w - 70, y + h / 2, 36)
}

// Kerala brass lamp, printed in line-art like a receipt logo
function nilavilakku(ctx, cx, top) {
  ctx.save()
  ctx.strokeStyle = C.ink
  ctx.lineWidth = 3
  // temple arch frame
  ctx.beginPath()
  ctx.moveTo(cx - 95, top + 420)
  ctx.lineTo(cx - 95, top + 80)
  ctx.arc(cx, top + 80, 95, Math.PI, 0)
  ctx.lineTo(cx + 95, top + 420)
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = C.ink
  for (let a = Math.PI; a <= Math.PI * 2 + 0.01; a += Math.PI / 10) {
    circle(ctx, cx + Math.cos(a) * 108, top + 80 + Math.sin(a) * 108, 3.5)
    ctx.fill()
  }

  // flames
  for (const [dx, s] of [[0, 1], [-46, 0.75], [46, 0.75]]) {
    const fx = cx + dx
    const fy = top + 60
    ctx.beginPath()
    ctx.moveTo(fx, fy - 40 * s)
    ctx.quadraticCurveTo(fx + 14 * s, fy - 12 * s, fx, fy)
    ctx.quadraticCurveTo(fx - 14 * s, fy - 12 * s, fx, fy - 40 * s)
    ctx.stroke()
  }
  // plate
  ctx.beginPath()
  ctx.ellipse(cx, top + 72, 62, 12, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 62, top + 72)
  ctx.quadraticCurveTo(cx, top + 112, cx + 62, top + 72)
  ctx.stroke()
  // stem with rings
  ctx.beginPath()
  ctx.moveTo(cx - 9, top + 92)
  ctx.lineTo(cx - 9, top + 330)
  ctx.moveTo(cx + 9, top + 92)
  ctx.lineTo(cx + 9, top + 330)
  ctx.stroke()
  for (const ry of [140, 200, 260]) {
    ctx.beginPath()
    ctx.ellipse(cx, top + ry, 22, 8, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  // base
  ctx.beginPath()
  ctx.moveTo(cx - 9, top + 330)
  ctx.quadraticCurveTo(cx - 20, top + 380, cx - 72, top + 400)
  ctx.lineTo(cx + 72, top + 400)
  ctx.quadraticCurveTo(cx + 20, top + 380, cx + 9, top + 330)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx, top + 402, 76, 10, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function stamp(ctx, cx, cy, r) {
  const size = r * 2 + 24
  const s = document.createElement('canvas')
  s.width = s.height = size
  const g = s.getContext('2d')
  g.translate(size / 2, size / 2)
  g.rotate(-0.22)
  g.strokeStyle = g.fillStyle = '#c92a2a'

  g.lineWidth = 6
  circle(g, 0, 0, r)
  g.stroke()
  g.lineWidth = 3
  circle(g, 0, 0, r - 12)
  g.stroke()
  circle(g, 0, 0, r * 0.62)
  g.stroke()

  // ring text is Latin only: Indic letters break apart when split per character
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `800 19px ${PRINT}`
  const ring = [...'★ DIGITAL POOJAVEPPU ★ DEPT. OF NOT STUDYING ']
  const ringR = (r - 12 + r * 0.62) / 2
  ring.forEach((ch, i) => {
    g.save()
    g.rotate((i / ring.length) * Math.PI * 2)
    g.fillText(ch, 0, -ringR)
    g.restore()
  })

  g.font = `800 28px ${PRINT}`
  g.fillText('APPROVED', 0, 2)
  g.font = `600 15px ${PRINT}`
  g.fillText('100% BLESSED', 0, -28)
  g.fillText('FOR POOJA', 0, 30)

  // worn-out ink look
  g.setTransform(1, 0, 0, 1, 0, 0)
  g.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 600; i++) {
    g.globalAlpha = Math.random() * 0.7
    circle(g, Math.random() * size, Math.random() * size, 0.5 + Math.random() * 2.2)
    g.fill()
  }

  ctx.globalAlpha = 0.85
  ctx.drawImage(s, cx - size / 2, cy - size / 2)
  ctx.globalAlpha = 1
}

function signature(ctx, x, y) {
  ctx.strokeStyle = C.pen
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x + 30, y - 50, x + 50, y + 30, x + 80, y - 20)
  ctx.bezierCurveTo(x + 100, y - 50, x + 110, y + 20, x + 150, y - 10)
  ctx.bezierCurveTo(x + 180, y - 30, x + 200, y + 10, x + 250, y - 15)
  ctx.stroke()
}

function receipt(ctx, c, { name, fileName, pageCount, purpose }) {
  ctx.save()
  ctx.translate(COVER_W / 2, 975)
  ctx.rotate(-0.03)
  ctx.translate(-RW / 2, -RH / 2)

  // paper with a torn left edge
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(RW, 0)
  ctx.lineTo(RW, RH)
  ctx.lineTo(0, RH)
  for (let y = RH; y > 0; y -= 10) ctx.lineTo(Math.random() * 10, y)
  ctx.closePath()
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 12
  ctx.fillStyle = '#fbfaf4'
  ctx.fill()
  ctx.restore()

  // header
  text(ctx, c.temple, RW / 2, 78, { size: 46, weight: 800, align: 'center', maxWidth: RW - 80 })
  text(ctx, c.regLine, RW / 2, 130, { size: 28, weight: 600, align: 'center', maxWidth: RW - 100 })
  text(ctx, c.payLine, RW / 2, 178, { size: 30, weight: 800, align: 'center', maxWidth: RW - 100 })

  // number / title / date row
  const now = new Date()
  const lw = text(ctx, c.numLabel, 265, 258, { size: 28, weight: 600 })
  const num = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  text(ctx, num, 265 + lw + 14, 262, { size: 52, weight: 800, color: C.red })
  const tw = Math.min(250, text(ctx, c.receiptTitle, 520, 258, { size: 34, weight: 800, maxWidth: 250 }))
  ctx.strokeStyle = C.ink
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(520, 268)
  ctx.lineTo(520 + tw, 268)
  ctx.stroke()
  text(ctx, c.dateLabel, 800, 258, { size: 28, weight: 600, maxWidth: 90 })
  text(ctx, `${now.getDate()}/${now.getMonth() + 1}/${String(now.getFullYear()).slice(2)}`, 895, 262, {
    size: 58,
    weight: 700,
    family: HAND,
    color: C.pen,
    maxWidth: 160,
  })

  nilavilakku(ctx, 140, 300)

  // handwritten fields on dotted lines
  const values = [
    name || c.anon,
    STARS[Math.floor(Math.random() * STARS.length)],
    c.purposes[purpose] ?? c.purposes[0],
    fileName,
    pageCount > 100 ? `${pageCount} (too much!)` : String(pageCount),
    c.banValue,
  ]
  c.fields.forEach((label, i) => {
    const y = 350 + i * 80
    text(ctx, label, 265, y, { size: 30, weight: 600, maxWidth: 150 })
    ctx.save()
    ctx.setLineDash([3, 7])
    ctx.strokeStyle = 'rgba(31,42,90,0.6)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(425, y + 8)
    ctx.lineTo(RW - 40, y + 8)
    ctx.stroke()
    ctx.restore()
    // Indic script sits much bigger than Caveat at the same size, so write it smaller
    const indic = /[஀-ൿ]/.test(values[i])
    text(ctx, values[i], 440, y, {
      size: indic ? 46 : 60,
      weight: 700,
      family: HAND,
      color: C.pen,
      maxWidth: RW - 490,
    })
  })

  // amount + signature
  text(ctx, 'Rs', 60, 855, { size: 54, weight: 800 })
  text(ctx, '151/-', 150, 858, { size: 82, weight: 700, family: HAND, color: C.pen })
  ctx.strokeStyle = C.pen
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(140, 872)
  ctx.quadraticCurveTo(240, 862, 340, 870)
  ctx.stroke()
  signature(ctx, RW - 430, 830)
  text(ctx, c.signLabel, RW - 300, 880, { size: 26, weight: 600, align: 'center', maxWidth: 200 })

  // terms (the trolls)
  text(ctx, c.termsTitle, 60, 940, { size: 28, weight: 800, color: C.red, maxWidth: 400 })
  ;[...c.trolls]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .forEach((line, i) => {
      text(ctx, `• ${line}`, 60, 985 + i * 42, { size: 25, weight: 600, maxWidth: 680 })
    })
  text(ctx, c.footer, RW / 2, RH - 20, { size: 19, weight: 400, color: 'rgba(31,42,90,0.55)', align: 'center', maxWidth: RW - 120 })

  stamp(ctx, RW - 185, 985, 120)
  smudge(ctx, RW - 30, 430, 60, C.red, 0.45)
  smudge(ctx, RW - 30, 720, 70, C.sandal, 0.7)
  ctx.restore()
}

function offerings(ctx) {
  // chandanam with kumkum on the leaf
  ctx.fillStyle = C.sandal
  ctx.beginPath()
  ctx.ellipse(640, 1655, 110, 46, -0.1, 0, Math.PI * 2)
  ctx.fill()
  smudge(ctx, 640, 1655, 120, '#d9b26a', 0.6)
  ctx.fillStyle = C.red
  circle(ctx, 690, 1645, 24)
  ctx.fill()
  smudge(ctx, 690, 1645, 40, C.red, 0.8)

  hibiscus(ctx, 230, 1640, 78, 0.3)
  hibiscus(ctx, 390, 1700, 56, 1.2)
  marigold(ctx, 960, 1630, 42)
  marigold(ctx, 1065, 1680, 36)
  marigold(ctx, 900, 1705, 28)

  // loose petals
  for (let i = 0; i < 40; i++) {
    const top = i < 10
    ctx.fillStyle = ['#f08c00', '#fcc419', '#e03131'][i % 3]
    ctx.beginPath()
    ctx.ellipse(
      150 + Math.random() * 980,
      top ? 330 + Math.random() * 50 : 1580 + Math.random() * 150,
      9,
      5,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }
}

// pageW/pageH: the PDF page shape to match (any units, only the ratio matters)
export async function drawCover({ name, fileName, pageCount, lang, purpose = 0, pageW = COVER_W, pageH = COVER_H }) {
  const c = STRINGS[lang].cover
  PRINT = PRINT_FONTS[lang]
  TITLE = TITLE_FONTS[lang]
  await loadFonts(c)
  const ratio = pageW / pageH
  const taller = ratio < COVER_W / COVER_H
  const canvas = document.createElement('canvas')
  canvas.width = taller ? COVER_W : Math.round(COVER_H * ratio)
  canvas.height = taller ? Math.round(COVER_W / ratio) : COVER_H
  const ctx = canvas.getContext('2d')

  bananaLeaf(ctx, canvas.width, canvas.height)
  ctx.translate((canvas.width - COVER_W) / 2, (canvas.height - COVER_H) / 2)
  banner(ctx, c)
  offerings(ctx)
  receipt(ctx, c, { name, fileName, pageCount, purpose })
  return canvas
}
