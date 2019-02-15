import { moneyFormat, numFormat } from '@/lib/utils'
import { Product } from '@/server/schema/types'
import { ClickCallback } from 'react-stockcharts/lib/interactive'
import { HoverTooltip } from 'react-stockcharts/lib/tooltip'
import { compose, defaultProps, setDisplayName } from 'recompose'

export default compose<TooltipProps, TooltipProps>(
  setDisplayName('chart-toolip'),
  defaultProps({
    fontSize: 11
  })
)(({ fontSize }) => (
  <>
    <HoverTooltip
      yAccessor={d => d.close}
      fontSize={fontSize}
      bgOpacity={0}
      fill="transparent"
      stroke="transparent"
      tooltipContent={({
        currentItem
      }: {
        currentItem: Product & { close?: number }
      }) => {
        if (!currentItem.close) {
          return
        }

        const x = currentItem.title
        const y = []

        y.push({
          label: 'Price',
          value: moneyFormat(currentItem.close)
        })

        if (currentItem.qty > 0) {
          y.push({
            label: 'Qty',
            value: numFormat(currentItem.qty)
          })
        }

        return { x, y }
      }}
    />

    <ClickCallback
      onClick={({
        currentItem
      }: {
        currentItem: Product & { close?: number }
      }) => window.open(currentItem.url, '_blank')}
    />
  </>
))

interface TooltipProps {
  fontSize?: number
}
