import Header from '@/components/Header'
import { BaphoTheme } from '@/theme'
import { AppProps } from 'next/app'
import { Box } from 'rebass'
import { compose, lifecycle, setDisplayName } from 'recompose'

import { Main } from './_app.styles'

export default compose<LayoutProps & BaphoTheme, LayoutProps>(
  setDisplayName('layout'),
  lifecycle({
    componentDidMount() {
      ;[].slice
        .call(document.querySelectorAll('[tabindex]'))
        .forEach((el: HTMLElement) => el.setAttribute('tabindex', '-1'))

      document.addEventListener('mousemove', ({ clientX: x, clientY: y }) =>
        Object.defineProperty(window, 'mouse', {
          enumerable: true,
          writable: true,
          value: { x, y }
        })
      )
    }
  })
)(({ Component }) => (
  <Main>
    <Header />

    <Box as="main">
      <Component />
    </Box>
  </Main>
))

export type LayoutProps = Partial<AppProps>
