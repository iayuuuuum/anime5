const ENDPOINT = 'https://graphql.anilist.co'

const QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 10) {
      media(search: $search, type: ANIME) {
        id
        title { native romaji }
        coverImage { large }
      }
    }
  }
`

export async function searchAnime(keyword) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: QUERY, variables: { search: keyword } }),
  })

  if (res.status === 429) {
    throw new Error('RATE_LIMIT') // アクセス制限
  }
  if (!res.ok) {
    throw new Error(`通信エラー: ${res.status}`)
  }

  const json = await res.json()

  // 画像がない作品は、カードに使えないので除外する
  return json.data.Page.media
    .filter((m) => m.coverImage && m.coverImage.large)
    .map((m) => ({
      id: m.id,
      title: m.title.native || m.title.romaji,
      image: m.coverImage.large,
    }))
}