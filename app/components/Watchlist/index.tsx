import Text from '@/components//Text'
import { getWatchlist, SET_WATCHLIST } from '@/lib/queries'
import withDraggable, { DraggableProps } from '@/lib/withDraggable'
import { Product } from '@/server/schema/types'
import { omit } from 'lodash'
import { graphql } from 'react-apollo'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Box, BoxProps } from 'rebass'
import { compose, mapProps, setDisplayName, withState } from 'recompose'

import Item from './Item'
import Watchlist from './style'

export default compose<WatchlistState & WatchlistProps, WatchlistProps>(
  setDisplayName('watchlist'),
  withState('isOpen', 'toggle', false),
  getWatchlist(),
  graphql<WatchlistProps & WatchlistState, {}, {}, WatchlistProps>(
    SET_WATCHLIST,
    {
      props: ({ mutate, ownProps: { watchlist } }) => ({
        handleDelete: async item => {
          watchlist.splice(watchlist.findIndex(t => t._id === item._id), 1)

          await mutate({
            refetchQueries: ['getWatchlist'],
            variables: { watchlist }
          })
        }
      })
    }
  ),
  withDraggable({
    left: '50%',
    bottom: 0
  }),
  mapProps(props => omit(props, ['data']))
)(({ isOpen, toggle, watchlist, handleDelete, dragHandle, ...props }) => (
  <Watchlist data-draggable data-open={isOpen} {...props}>
    <h5 ref={dragHandle} onClick={() => toggle(!isOpen)}>
      <span>Watchlist</span>
      {isOpen ? <FaChevronDown /> : <FaChevronUp />}
    </h5>

    <Box as="section">
      {watchlist.length ? (
        watchlist.map(d => (
          <Item key={d._id} {...d} onDelete={() => handleDelete(d)} />
        ))
      ) : (
        <Text>Click the star next to products to pin them here.</Text>
      )}
    </Box>
  </Watchlist>
))

export interface WatchlistState extends DraggableProps {
  isOpen?: boolean
  toggle?: (b: boolean, cb?: () => void) => void
}

export interface WatchlistProps extends BoxProps {
  as?: any
  watchlist?: Product[]
  handleDelete?: (item: Product) => void
}
