import { drawCover, drawWrappedText, drawLine } from '../utils/canvasHelpers'

const W = 1080
const H = 1080

const COLORS = {
  bg: '#0b0b10',
  glow: '#2a2433',
  cream: '#f1e8d4',
  gold: '#c9a45c',
  sub: '#8d8672',
}

const SERIF = "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif"
const SANS = "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif"

// 縦長のパネル5枚（映画のフィルムのコマのイメージ）
const PANEL_W = 190
const PANEL_H = 420
const GAP = 12
const START_X = (W - (PANEL_W * 5 + GAP * 4)) / 2
const PANEL_Y = 330

function draw(ctx, slots, images) {
  // 背景：中央に弱い光
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, 540, 40, W / 2, 540, 700)
  glow.addColorStop(0, COLORS.glow)
  glow.addColorStop(1, COLORS.bg)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // 外枠（金の細線）
  ctx.strokeStyle = 'rgba(201, 164, 92, 0.5)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(24, 24, W - 48, H - 48)

  // ---- ヘッダー ----
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.gold
  ctx.font = `22px ${SANS}`
  ctx.fillText('A PERSONAL SELECTION', W / 2, 120)
  ctx.fillStyle = COLORS.cream
  ctx.font = `bold 80px ${SERIF}`
  ctx.fillText('MY FAVORITE ANIME', W / 2, 215)
  drawLine(ctx, 60, W - 60, 255, 1, COLORS.gold)
  ctx.fillStyle = COLORS.sub
  ctx.font = `24px ${SERIF}`
  ctx.fillText('好きなアニメ5選', W / 2, 295)

  // ---- パネル5枚 ----
  slots.forEach((anime, i) => {
    const x = START_X + i * (PANEL_W + GAP)
    const y = PANEL_Y

    // ポスター（縦長に中央を切り取り）
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, PANEL_W, PANEL_H)
    ctx.clip()
    drawCover(ctx, images[i], x, y, PANEL_W, PANEL_H)

    // 下に向かって暗くなる膜
    const shade = ctx.createLinearGradient(0, y + PANEL_H * 0.6, 0, y + PANEL_H)
    shade.addColorStop(0, 'rgba(0, 0, 0, 0)')
    shade.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
    ctx.fillStyle = shade
    ctx.fillRect(x, y, PANEL_W, PANEL_H)
    ctx.restore()

    // 金の細い枠
    ctx.strokeStyle = 'rgba(201, 164, 92, 0.55)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(x, y, PANEL_W, PANEL_H)

    // 番号とタイトル
    ctx.textAlign = 'left'
    ctx.fillStyle = COLORS.gold
    ctx.font = `bold 22px ${SERIF}`
    ctx.fillText(String(i + 1).padStart(2, '0'), x, y + PANEL_H + 38)

    ctx.fillStyle = COLORS.cream
    ctx.font = `bold 20px ${SERIF}`
    drawWrappedText(ctx, anime.title, x, y + PANEL_H + 70, PANEL_W, 26, 3)
  })

  // ---- フッター ----
  drawLine(ctx, 60, W - 60, 985, 1, COLORS.gold)
  ctx.fillStyle = COLORS.sub
  ctx.font = `22px ${SANS}`
  ctx.textAlign = 'left'
  ctx.fillText('#アニメ5選', 60, 1030)
  ctx.textAlign = 'right'
  ctx.fillText('MY TOP 5 ANIME', W - 60, 1030)
}

const cinematic = {
  id: 'cinematic',
  name: 'ダークシネマ',
  width: W,
  height: H,
  draw,
}

export default cinematic