import { BaphoTheme } from '@/theme'
import { rgba } from 'polished'
import styled, { css } from 'styled-components'

export default styled<any>('div')`
  ${({ theme }: BaphoTheme) => css`
    display: block;
    position: relative;
    width: 10px;
    height: 10px;
    background: ${theme.inputs.bg};

    input[type='checkbox'] {
      z-index: 1;
      cursor: pointer;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      border: 0;

      &:checked + div {
        &:before {
        }

        &:after {
          opacity: 1;
        }
      }
    }

    > div {
      &:before,
      &:after {
        transition: ${theme.eases.base};
      }

      &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 1px solid;
        border-image: linear-gradient(
            ${theme.inputs.border},
            ${rgba(theme.inputs.border, 0.5)}
          )
          1;
      }

      &:after {
        opacity: 0;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
          ${theme.inputs.border},
          ${rgba(theme.inputs.border, 0.5)}
        );
      }
    }
  `}
`
