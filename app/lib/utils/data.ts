import { FakeResult } from '@/server/schema/types'
import { orderBy } from 'lodash'

export const parseTags = (data: FakeResult[]): CategoryItem[] => {
  data = data.filter(d => d.tags.length)

  const calculated = data
    .map(d => d.tags[0])
    .filter((t, i, s) => s.indexOf(t) === i)
    .map(title => {
      const rel = data.filter(d => d.tags.includes(title))

      return {
        title,
        total: rel.length,
        items: orderBy(
          rel.reduce(
            (acc, { tags }) =>
              tags.map(
                t =>
                  !(acc.find(a => a.title === t) || t === title) &&
                  acc.push({
                    title: t,
                    total: rel.filter(d => d.tags.includes(t)).length
                  })
              ) && acc,
            []
          ),
          'title'
        )
      }
    })

  return orderBy(calculated, 'title')
}

export interface CategoryItem {
  title: string
  total: number
  items?: CategoryItem[]
}
