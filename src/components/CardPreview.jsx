import { useEffect, useState } from 'react'
import { drawCard } from '../utils/drawCard'
import { themes, defaultTheme } from '../themes'

function CardPreview({ slots, onClose }) {
  const [theme, setTheme] = useState(defaultTheme)
  const [dataUrl, setDataUrl] = useState(null)
  const [blob, setBlob] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'done' | 'error'

  useEffect(() => {
    let cancelled = false
    setStatus('loading') // テーマを切り替えたときも「作成中」を出す
    setBlob(null)

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

  const handleShare = async () => {
    const file = new File([blob], `anime5-${theme.id}.png`, { type: 'image/png' })
    try {
      await navigator.share({ files: [file] })
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err) // キャンセルは無視
    }
  }

  // この端末・ブラウザがファイル共有に対応しているときだけ、ボタンを出す
  const canShare =
    blob &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [new File([blob], 'a.png', { type: 'image/png' })] })

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>完成プレビュー</h2>
          <button onClick={onClose}>閉じる</button>
        </div>

        {/* テーマが2つ以上あるときだけ、選択ボタンを出す */}
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
            <p className="hint">
              スマホで写真に保存するには、画像を長押しして「"写真"に追加」を選んでください。
              「PNGで保存」を押すと、ファイルアプリに保存されます。
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default CardPreview