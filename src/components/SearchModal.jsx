import { useRef, useState } from 'react'
import { searchAnime } from '../api/anilist'

function SearchModal({ selectedIds, onSelect, onClose }) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  // 検索のたびに番号を増やして、古い結果を無視するために使う
  const requestId = useRef(0)
  // 'idle'(未検索) | 'loading' | 'done' | 'error'
  const [status, setStatus] = useState('idle')

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    const id = ++requestId.current
    setStatus('loading')
    try {
      const list = await searchAnime(keyword.trim())
      if (id !== requestId.current) return // もっと新しい検索があるので捨てる
      setResults(list)
      setStatus('done')
    } catch (err) {
      console.error(err)
      if (id !== requestId.current) return
      setErrorMessage(
        err.message === 'RATE_LIMIT'
          ? '短時間にアクセスが集中しています。少し待ってからお試しください。'
          : '通信に失敗しました。もう一度お試しください。'
      )
      setStatus('error')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>アニメを検索</h2>
          <button onClick={onClose}>閉じる</button>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="作品名を入力"
            autoFocus
          />
          <button type="submit">検索</button>
        </form>

        {status === 'loading' && <p>検索中...</p>}
                {status === 'error' && <p>{errorMessage}</p>}
        {status === 'done' && results.length === 0 && <p>見つかりませんでした。</p>}

        <ul className="result-list">
          {results.map((anime) => {
            const already = selectedIds.includes(anime.id)
            return (
              <li key={anime.id}>
                <button
                  className="result-item"
                  disabled={already}
                  onClick={() => onSelect(anime)}
                >
                  <img src={anime.image} alt="" />
                  <span>{anime.title}</span>
                  {already && <small>選択済み</small>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SearchModal