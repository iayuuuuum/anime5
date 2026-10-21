// AniListの画像URLを、自分のサイト経由のURLに変換する
function toProxyUrl(src) {
  const url = new URL(src)
  if (url.hostname.endsWith('anilist.co')) {
    return '/anilist-img' + url.pathname
  }
  return src
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`画像の読み込みに失敗: ${src}`))
    img.src = toProxyUrl(src)
  })
}

// 枠いっぱいに、はみ出しを切り取って描く（CSSの object-fit: cover と同じ）
export function drawCover(ctx, img, x, y, w, h) {
  // 画像が読み込めなかったときは、灰色の代わりの板を描く
  if (!img) {
    ctx.fillStyle = '#888'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('NO IMAGE', x + w / 2, y + h / 2)
    return
  }
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  const sx = (img.width - sw) / 2
  const sy = (img.height - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

// 日本語は空白がないので、1文字ずつ幅を測って折り返す
export function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const lines = []
  let line = ''
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth) {
      lines.push(line)
      line = ch
    } else {
      line += ch
    }
  }
  lines.push(line)

  const shown = lines.slice(0, maxLines)
  if (lines.length > maxLines) {
    let last = shown[maxLines - 1]
    while (last.length > 0 && ctx.measureText(last + '…').width > maxWidth) {
      last = last.slice(0, -1)
    }
    shown[maxLines - 1] = last + '…'
  }
  shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight))
}

// 横線を引く
export function drawLine(ctx, x1, x2, y, width, color) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.stroke()
}