import { FakeCrawlResult } from '@/server/schema/types'
import {
  IoIosLink,
  IoLogoReddit,
  IoLogoTwitter,
  IoMdImage,
  IoMdOpen
} from 'react-icons/io'
import { AutoSizer, Column, Table } from 'react-virtualized'
import { compose, setDisplayName } from 'recompose'

import DataTable from './style'

interface TOutter {
  data: FakeCrawlResult[]
}

export default compose<TOutter, TOutter>(setDisplayName('pod'))(
  ({ data = [] }) => (
    <DataTable>
      <AutoSizer>
        {({ width, height }) => (
          <Table
            width={width}
            height={height - 60}
            headerHeight={35}
            rowHeight={50}
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}>
            <Column
              label={<IoIosLink />}
              dataKey="slug"
              width={26}
              style={{ margin: 0 }}
              headerStyle={{ margin: 0, textAlign: 'center' }}
              cellRenderer={() => (
                <div className="datasrc">
                  {Math.random() > 0.5 ? <IoLogoTwitter /> : <IoLogoReddit />}
                  <IoMdOpen />
                </div>
              )}
            />

            <Column
              label={<IoMdImage />}
              dataKey="image"
              width={30}
              headerStyle={{ textAlign: 'center' }}
              cellRenderer={({ cellData, rowData: { title } }) => (
                <figure>
                  <img src={cellData} alt={title} />
                </figure>
              )}
            />

            <Column
              label="Content"
              dataKey="title"
              width={100}
              flexGrow={1}
              cellRenderer={({ cellData, rowData: { copy } }) => (
                <div>
                  <strong>
                    <span>{cellData}</span>{' '}
                    <time title="6/21/90 11:11:11">just now</time>
                  </strong>

                  <p dangerouslySetInnerHTML={{ __html: copy }} />
                </div>
              )}
            />
          </Table>
        )}
      </AutoSizer>
    </DataTable>
  )
)
