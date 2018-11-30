import Box from '@/components/Box'
import { BaphoTheme } from '@/theme'
import { rgba } from 'polished'
import styled, { css } from 'styled-components'

export default styled<any>(Box)`
  ${({ theme }: BaphoTheme) => css`
    --cols: 4;

    display: flex;
    align-items: stretch;
    justify-content: left;
    list-style: none;
    margin: 0;
    padding: 0;

    @media (max-width: 768px) {
      flex-wrap: nowrap;
      white-space: nowrap;
      justify-content: space-between;
      overflow: auto;
      padding-bottom: var(--pad);
    }

    ul,
    li {
      display: block;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    > li {
      display: inline-block;
      width: auto;

      @media (min-width: 768px) {
        padding: 0 4px 4px;
      }

      a[href] {
        font-weight: 300;
        padding: calc(var(--pad) / 5) calc(var(--pad) / 1.5);
      }

      > a[href] {
        white-space: nowrap;
        text-transform: uppercase;
        padding: calc(var(--pad) / 2);
        padding-bottom: calc(var(--pad) / 4);

        &:hover {
          color: inherit;
        }
      }

      li > a[href] {
        display: block;
        color: ${theme.colours.muted};
        font-size: 0.9em;
        outline: 1px solid transparent;
        outline-offset: -2px;
        transition: none;

        &:not(:hover) {
          transition: ${theme.eases.base};
        }

        &:hover {
          color: ${theme.colours.base};
          background: ${rgba(theme.inputs.bg, 0.5)};
        }
      }

      [data-checked] > a[href] {
        color: ${theme.colours.base};
        outline-color: ${theme.colours.focus};
        background: ${rgba(theme.inputs.bg, 0.5)};
      }

      ul ul a[href] {
        text-indent: 0.7em;
        padding-top: 0.3em;
        padding-bottom: 0.3em;
      }
    }
  `}
`
