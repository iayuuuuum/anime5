import { loadImage } from './canvasHelpers'

// テーマが固定で書く文字。必要な文字だけ読み込むために使う
const FIXED_TEXT =
  'MY FAVORITE ANIME EDITION TOP 5 FIVE FAVORITES A PERSONAL SELECTION 好きなアニメ5選 #アニメ5選 0123456789'

async function loadFonts(text) {
  const families = ['Noto Serif JP', 'Noto Sans JP']
  const weights = ['400', '700']
  try {
    await Promise.all(
      families.flatMap((f) =>
        weights.map((w) => document.fonts.load(`${w} 20px "${f}"`, text))
      )
    )
  } catch (err) {
    // 読み込めなくても、予備のフォントで描けるので続ける
    console.error(err)
  }
}

export async function drawCard(slots, theme) {
  const canvas = document.createElement('canvas')
  canvas.width = theme.width
  canvas.height = theme.height
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'alphabetic'

  // 画像とフォントを、同時に読み込んで待つ
  const titles = slots.map((a) => a.title).join('')
  const [images] = await Promise.all([
    Promise.all(slots.map((a) => loadImage(a.image).catch(() => null))),
    loadFonts(FIXED_TEXT + titles),
  ])

  theme.draw(ctx, slots, images)
  return canvas
}