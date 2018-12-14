import { Product, Resolver, Tag } from '../types'

export default (async (_, __, { mongo }): Promise<Product[]> => {
  const tags = await mongo
    .collection('tags')
    .find<Tag>({
      isDeleted: {
        $ne: true
      }
    })
    .toArray()

  return (await mongo
    .collection('products')
    .find<Product>({
      isDeleted: {
        $ne: true
      }
    })
    .toArray()).map(d => ({
    ...d,
    tags: (d.tags as any[])
      .map(t =>
        tags.find(tt => {
          if (typeof t === 'object' && 'equals' in t) {
            return t.equals(tt._id)
          }

          return t === tt._id.toString()
        })
      )
      .filter(t => t)
  }))
}) as Resolver