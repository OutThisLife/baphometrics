import * as Form from '@/components/Form'
import { CheckboxProps } from '@/components/Form/Checkbox'
import { compose, setDisplayName } from 'recompose'

import Column, { ColumnProps } from '../Column'

export default compose<CheckProps, CheckProps>(setDisplayName('col-checkbox'))(
  ({ checkboxProps = {}, ...props }) => (
    <Column
      p={0}
      css={`
        width: calc(var(--offset));
        text-align: center;
      `}
      {...props}>
      <Form.Checkbox
        name="id"
        css={`
          tbody & {
            pointer-events: none;
          }
        `}
        {...checkboxProps}
      />
    </Column>
  )
)

interface CheckProps extends ColumnProps {
  checkboxProps?: CheckboxProps
}