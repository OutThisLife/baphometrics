import { Flex } from 'rebass'
import styled, { css } from 'styled-components'

import { FormProps } from '.'

export default styled<any>(Flex)`
  ${({ groupFields = false }: FormProps) =>
    groupFields &&
    css`
      input[type] {
        margin-right: -1em;
        padding-right: var(--pad);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    `}
`
