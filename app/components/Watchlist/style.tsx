import Module from '@/components/Module'
import { BaphoTheme } from '@/theme'
import { darken, rgba } from 'polished'
import styled, { css } from 'styled-components'

export default styled<any>(Module)`
  ${({ theme }: BaphoTheme) => css`
    width: auto;
    box-shadow: -8px -8px 50px 0 ${darken(0.03, theme.colours.panel)};

    @media (min-width: 768px) {
      min-width: 220px;
      white-space: nowrap;
    }

    h5 {
      padding: calc(var(--pad) / 2);
      margin: 0 0 calc(var(--pad) / 2);
      border-bottom: 1px solid ${rgba(theme.colours.border, 0.33)};

      @media (max-width: 768px) {
        padding: var(--pad);
        padding-left: 0;

        > span {
          font-size: 0px;
        }
      }
    }

    > div {
      padding: 0;

      section {
        display: grid;
        grid-template-columns: min-content 25px 1fr max-content max-content;
        align-items: center;
        grid-gap: 1em;
        max-height: 33vh;
        overflow: auto;
        padding: calc(var(--pad) / 2);
        padding-bottom: var(--pad);

        @media (max-width: 768px) {
          width: 66vw;
        }

        article > * {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  `}
`
