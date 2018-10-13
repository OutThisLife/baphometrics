import { rgba } from 'polished'
import styled, { css } from 'styled-components'

export default styled.div`
  ${({ theme }) => css`
    position: relative;
    height: auto;
    border: 1px solid transparent;
    border-radius: 4px 4px 0 0;
    box-shadow: 0 1px 3px 0 ${rgba(theme.colours.base, 0.15)};
    background: ${theme.colours.bg};

    .action-panel:hover & {
      box-shadow: 0 10px 15px 0 ${rgba(theme.colours.base, 0.1)};
      transform: translate3d(0, -2px, 0);
    }
  `};
`