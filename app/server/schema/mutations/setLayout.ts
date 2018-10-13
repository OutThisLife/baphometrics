import { IFieldResolver } from 'graphql-tools'

import { Layout } from '../queries/layout'
import { Context } from '../types'

interface Args {
  cols?: number
  layout: string
}

export default ((_, { cols = 40, layout }: Args, ctx): Layout => {
  const data = JSON.parse(layout)
  ctx.cache.set('BAPH_LAYOUT', data)
  return { cols, data }
}) as IFieldResolver<{}, Context>