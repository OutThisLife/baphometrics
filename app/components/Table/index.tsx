import withSelections, { select, SelectionsProps } from '@/lib/withSelections'
import * as d3 from 'd3'
import { array } from 'prop-types'
import { MeasuredComponentProps } from 'react-measure'
import {
  compose,
  getContext,
  setDisplayName,
  withContext,
  withHandlers
} from 'recompose'

import * as Columns from './Columns'
import * as Table from './style'

let tm: d3.Timer | {} = {}

export default compose<TableProps & TableOutterProps, TableOutterProps>(
  withSelections,
  withContext({ columns: array }, ({ columns }) => ({ columns })),
  withHandlers<{}, TableProps>(() => ({
    handleScroll: () => ({ currentTarget }) => {
      const el = currentTarget.firstChild.firstChild as HTMLElement
      el.style.pointerEvents = 'none'

      if ('stop' in tm) {
        tm.stop()
      }

      tm = d3.timeout(() => (el.style.pointerEvents = 'auto'), 300)
    }
  })),
  setDisplayName('table')
)(({ data = [], isDesktop, height, handleMouse, handleScroll, ...props }) => (
  <Table.Container as="table" {...props}>
    <Table.Head>
      <Columns.Check
        disableSort
        checkboxProps={{
          value: 'all',
          onClick: ({ target }) =>
            [].slice
              .call(
                document.getElementsByName((target as HTMLInputElement).name)
              )
              .forEach(select)
        }}
      />

      <RenderColumns props={c => ({ children: c.label })} />
    </Table.Head>

    <Table.Body
      css={`
        height: ${height};
        overflow: auto;
      `}
      onMouseDown={isDesktop ? handleMouse : () => null}
      onScroll={isDesktop ? handleScroll : () => null}>
      {data.map(d => (
        <Table.Row key={d.id} id={d.id}>
          <Columns.Check
            checkboxProps={{
              value: d.id,
              css: `pointer-events: none`
            }}
          />

          <RenderColumns props={() => ({ item: d })} />
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Container>
))

export const RenderColumns = compose<RenderColumnProps, RenderColumnProps>(
  getContext({ columns: array }),
  setDisplayName('render-columns')
)(({ props, columns = [] }) => (
  <>
    {columns.map(c => {
      const C =
        Columns[c.key.slice(0, 1).toUpperCase() + c.key.slice(1)] ||
        Columns.Base

      return <C key={c.key} {...props(c)} />
    })}
  </>
))

export interface TableProps
  extends SelectionsProps,
    Partial<MeasuredComponentProps> {
  handleScroll?: React.UIEventHandler<HTMLElement>
}

export interface TableOutterProps {
  isDesktop?: boolean
  height: number
  data: any[]
  columns: Array<{
    label: string
    key: string
  }>
}

export interface RenderColumnProps {
  columns?: TableOutterProps['columns']
  props: (c: any) => { [key: string]: any }
}
