import { BaphoTheme } from '@/theme'
import { Box } from 'rebass'
import styled, { css } from 'styled-components'

export default styled<any>(Box)`
  ${({ theme }: BaphoTheme) => css`
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

      span {
        vertical-align: middle;
      }

      > a[href] {
        white-space: nowrap;
        text-transform: uppercase;
        padding: calc(var(--pad) / 2);
        padding-bottom: calc(var(--pad) / 4);
      }

      li > a[href] {
        display: block;
        font-size: 0.9em;
        outline: 1px solid transparent;
        outline-offset: -2px;
        transition: none;

        &:not(:hover) {
          color: ${theme.colours.muted};
          transition: ${theme.eases.base};
        }
      }

      [data-checked] > a[href] {
        color: ${theme.colours.base};
        outline-color: ${theme.colours.focus};
      }

      ul ul a[href] {
        text-indent: 0.7em;
        padding-top: 0.3em;
        padding-bottom: 0.3em;
      }
    }
  `}
`
