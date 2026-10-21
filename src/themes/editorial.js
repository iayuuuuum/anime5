import { drawCover, drawWrappedText, drawLine } from '../utils/canvasHelpers'

const W = 1080
const H = 1350

const COLORS = {
  paper: '#f2ede4',
  ink: '#1a1a1a',
  accent: '#d9432f',
  sub: '#7a7468',
}

const SERIF = "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif"
const SANS = "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif"

const LAYOUT = [
  { x: 60, y: 360, w: 420, h: 700, titleSize: 38, lineHeight: 48, maxLines: 3 },
  { x: 520, y: 360, w: 240, h: 330, titleSize: 22, lineHeight: 28, maxLines: 2 },
  { x: 780, y: 360, w: 240, h: 330, titleSize: 22, lineHeight: 28, maxLines: 2 },
  { x: 520, y: 820, w: 240, h: 330, titleSize: 22, lineHeight: 28, maxLines: 2 },
  { x: 780, y: 820, w: 240, h: 330, titleSize: 22, lineHeight: 28, maxLines: 2 },
]

function draw(ctx, slots, images) {
  // 背景
  ctx.fillStyle = COLORS.paper
  ctx.fillRect(0, 0, W, H)

  // ---- ヘッダー ----
  ctx.fillStyle = COLORS.ink
  ctx.font = `bold 22px ${SANS}`
  ctx.textAlign = 'left'
  ctx.fillText('MY FAVORITE ANIME', 60, 80)
  ctx.textAlign = 'right'
  ctx.fillText(`${new Date().getFullYear()} EDITION`, W - 60, 80)
  drawLine(ctx, 60, W - 60, 105, 2, COLORS.ink)

  ctx.textAlign = 'left'
  ctx.fillStyle = COLORS.ink
  ctx.font = `bold 220px ${SERIF}`
  ctx.fillText('TOP 5', 52, 300)

  ctx.textAlign = 'right'
  ctx.fillStyle = COLORS.accent
  ctx.font = `bold 36px ${SERIF}`
  ctx.fillText('好きなアニメ', W - 60, 240)
  ctx.fillText('5選', W - 60, 285)

  drawLine(ctx, 60, W - 60, 330, 1, COLORS.ink)

  // ---- ポスター5枚 ----
  slots.forEach((anime, i) => {
    const { x, y, w, h, titleSize, lineHeight, maxLines } = LAYOUT[i]

    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.28)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 10
    ctx.fillStyle = COLORS.ink
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 4)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 4)
    ctx.clip()
    drawCover(ctx, images[i], x, y, w, h)
    ctx.restore()

    const isHero = i === 0
    const numberSize = isHero ? 40 : 28
    ctx.textAlign = 'left'
    ctx.fillStyle = COLORS.accent
    ctx.font = `bold ${numberSize}px ${SERIF}`
    const numberY = y + h + (isHero ? 50 : 36)
    ctx.fillText(String(i + 1).padStart(2, '0'), x, numberY)

    ctx.fillStyle = COLORS.ink
    ctx.font = `bold ${titleSize}px ${SERIF}`
    drawWrappedText(
      ctx,
      anime.title,
      x,
      numberY + (isHero ? 48 : 30),
      w,
      lineHeight,
      maxLines
    )
  })

  // ---- フッター ----
  drawLine(ctx, 60, W - 60, 1285, 1, COLORS.ink)
  ctx.fillStyle = COLORS.sub
  ctx.font = `22px ${SANS}`
  ctx.textAlign = 'left'
  ctx.fillText('#アニメ5選', 60, 1322)
  ctx.textAlign = 'right'
  ctx.fillText('MY TOP 5 ANIME', W - 60, 1322)
}

// テーマの「名前札」。他のファイルからはこれだけを使う
const editorial = {
  id: 'editorial',
  name: '雑誌風',
  width: W,
  height: H,
  draw,
}

export default editorial