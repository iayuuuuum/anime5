import { drawCover, drawWrappedText } from '../utils/canvasHelpers'

const W = 1080
const H = 1350

const COLORS = {
  kraft: '#d9c7a7', // 背景（クラフト紙）
  kraftLight: '#ead9bb',
  paper: '#fbf8f1', // ポラロイドの白
  ink: '#2b2620',
  sub: '#6b5a45',
}

const SERIF = "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif"
const SANS = "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif"

// ポラロイド1枚の寸法
const PHOTO_W = 252
const PHOTO_H = 378 // ポスターの縦横比 2:3
const MARGIN = 16
const CARD_W = PHOTO_W + MARGIN * 2 // 284
const CARD_H = MARGIN + PHOTO_H + 70 // 下の余白にタイトルを書く

// 中心の座標と傾き（度）。乱数は使わず固定にして、毎回同じ配置にする
const LAYOUT = [
  { cx: 190, cy: 505, angle: -4, tape: 3 },
  { cx: 540, cy: 485, angle: 3, tape: -4 },
  { cx: 890, cy: 505, angle: -2.5, tape: 5 },
  { cx: 365, cy: 1000, angle: 3.5, tape: -3 },
  { cx: 715, cy: 1000, angle: -3, tape: 4 },
]

const toRad = (deg) => (deg * Math.PI) / 180

function draw(ctx, slots, images) {
  // 背景：中央が明るいクラフト紙風
  const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 900)
  bg.addColorStop(0, COLORS.kraftLight)
  bg.addColorStop(1, COLORS.kraft)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // ---- ヘッダー ----
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.ink
  ctx.font = `bold 76px ${SERIF}`
  ctx.fillText('FIVE FAVORITES', W / 2, 140)
  ctx.fillStyle = COLORS.sub
  ctx.font = `28px ${SERIF}`
  ctx.fillText('好きなアニメ5選', W / 2, 190)

  // ---- ポラロイド5枚 ----
  slots.forEach((anime, i) => {
    const { cx, cy, angle, tape } = LAYOUT[i]

    ctx.save()
    ctx.translate(cx, cy) // 原点をカードの中心に移して、
    ctx.rotate(toRad(angle)) // その場で回す

    // 白いカード（影つき）
    ctx.save()
    ctx.shadowColor = 'rgba(60, 40, 20, 0.35)'
    ctx.shadowBlur = 22
    ctx.shadowOffsetY = 8
    ctx.fillStyle = COLORS.paper
    ctx.fillRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H)
    ctx.restore()

    // 写真（ポスター）
    const px = -CARD_W / 2 + MARGIN
    const py = -CARD_H / 2 + MARGIN
    ctx.save()
    ctx.beginPath()
    ctx.rect(px, py, PHOTO_W, PHOTO_H)
    ctx.clip()
    drawCover(ctx, images[i], px, py, PHOTO_W, PHOTO_H)
    ctx.restore()

    // タイトル（下の余白に、中央揃えで最大2行）
    ctx.fillStyle = COLORS.ink
    ctx.font = `bold 21px ${SERIF}`
    ctx.textAlign = 'center'
    drawWrappedText(ctx, anime.title, 0, py + PHOTO_H + 30, PHOTO_W, 26, 2)

    // マスキングテープ
    ctx.save()
    ctx.translate(0, -CARD_H / 2 + 2)
    ctx.rotate(toRad(tape))
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.fillRect(-48, -16, 96, 30)
    ctx.restore()

    ctx.restore()
  })

  // ---- フッター ----
  ctx.fillStyle = COLORS.sub
  ctx.font = `24px ${SANS}`
  ctx.textAlign = 'center'
  ctx.fillText('#アニメ5選', W / 2, 1310)
}

const polaroid = {
  id: 'polaroid',
  name: 'ポラロイド',
  width: W,
  height: H,
  draw,
}

export default polaroid