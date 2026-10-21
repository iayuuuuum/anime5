import { useEffect, useState } from 'react'
import { drawCard } from '../utils/drawCard'
import { themes, defaultTheme } from '../themes'

const SHARE_TEXT = '好きなアニメ5選を作りました！'
const HASHTAG = 'アニメ5選'

function CardPreview({ slots, onClose }) {
  const [theme, setTheme] = useState(defaultTheme)
  const [dataUrl, setDataUrl] = useState(null)
  const [blob, setBlob] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'done' | 'error'
  const [copyStatus, setCopyStatus] = useState('idle') // 'idle' | 'done' | 'error'

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setBlob(null)
    setCopyStatus('idle')

    drawCard(slots, theme)
      .then((canvas) => {
        if (cancelled) return
        setDataUrl(canvas.toDataURL('image/png'))
        canvas.toBlob((b) => {
          if (!cancelled) setBlob(b)
        }, 'image/png')
        setStatus('done')
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [slots, theme])

  // スマホ：OSの共有画面を開く（Xのアプリなどを選べる）
  const handleShare = async () => {
    const file = new File([blob], `anime5-${theme.id}.png`, { type: 'image/png' })
    try {
      await navigator.share({
        files: [file],
        text: `${SHARE_TEXT} #${HASHTAG}`,
      })
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err) // キャンセルは無視
    }
  }

  // PC：画像をクリップボードにコピーする
  const handleCopy = async () => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopyStatus('done')
    } catch (err) {
      console.error(err)
      setCopyStatus('error')
    }
  }

  // この端末・ブラウザがファイル共有に対応しているときだけ、共有ボタンを出す
  const canShare =
    blob &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [new File([blob], 'a.png', { type: 'image/png' })] })

  // 共有ボタンが出ない端末（主にPC）で、コピーボタンを出す
  const canCopy =
    blob &&
    !canShare &&
    typeof ClipboardItem !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.write === 'function'

  // Xの投稿画面を開くURL（文章・URL・ハッシュタグだけ渡せる）
  const tweetUrl =
    'https://x.com/intent/tweet' +
    `?text=${encodeURIComponent(SHARE_TEXT)}` +
    `&url=${encodeURIComponent(window.location.origin)}` +
    `&hashtags=${encodeURIComponent(HASHTAG)}`

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>完成プレビュー</h2>
          <button onClick={onClose}>閉じる</button>
        </div>

        {themes.length > 1 && (
          <div className="theme-picker">
            {themes.map((t) => (
              <button
                key={t.id}
                className={t.id === theme.id ? 'theme-button active' : 'theme-button'}
                onClick={() => setTheme(t)}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        {status === 'loading' && <p>画像を作成中...</p>}
        {status === 'error' && (
          <p>画像の作成に失敗しました。コンソールのエラーを確認してください。</p>
        )}

        {status === 'done' && (
          <>
            <img className="preview-image" src={dataUrl} alt="完成したカード" />

            <div className="share-actions">
              <a
                className="download-link"
                href={dataUrl}
                download={`anime5-${theme.id}.png`}
              >
                PNGで保存
              </a>

              {canShare && (
                <button className="share-button" onClick={handleShare}>
                  共有・写真に保存
                </button>
              )}

              {canCopy && (
                <button className="share-button" onClick={handleCopy}>
                  画像をコピー
                </button>
              )}

              <a
                className="x-link"
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xで投稿
              </a>
            </div>

            {copyStatus === 'done' && (
              <p className="hint">
                コピーしました。Xの投稿画面で、貼り付け（Ctrl + V）してください。
              </p>
            )}
            {copyStatus === 'error' && (
              <p className="hint">
                コピーできませんでした。「PNGで保存」した画像を、投稿に添付してください。
              </p>
            )}

            <p className="hint">
              スマホで写真に保存するには、画像を長押しして「"写真"に追加」を選んでください。
              「Xで投稿」では画像は自動で付かないので、先に画像を保存するかコピーしてください。
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default CardPreview