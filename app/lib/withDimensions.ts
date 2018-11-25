import {
  compose,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  withHandlers,
  withStateHandlers
} from 'recompose'
import ResizeObserver from 'resize-observer-polyfill'

export default (forceWindow: boolean = false) =>
  compose<DimProps & THandles, {}>(
    setDisplayName('with-dimensions'),
    withStateHandlers<TState, TStateHandles>(
      () => ({
        width: 1024,
        height: 768
      }),
      {
        setDimensions: () => ({ width, height }) =>
          console.log(width) || { width, height }
      }
    ),
    withHandlers<TStateHandles, THandles>(() => ({
      onRef: ({ setDimensions }) => ref => {
        if (!('browser' in process)) {
          return
        }

        ro(setDimensions).observe(
          forceWindow ? document.body : (ref as HTMLElement)
        )
      }
    }))
  )

const ro = (cb: (a: any) => any) =>
  new ResizeObserver(entries => {
    for (const entry of entries) {
      cb(entry.contentRect)
    }
  })

export interface TState {
  width: number
  height: number
}

export interface TStateHandles extends StateHandlerMap<TState> {
  setDimensions: StateHandler<TState>
}

interface THandles<T = HTMLElement | Window> {
  onRef?: (ref?: T, el?: T) => void
}

export type DimProps = TState & TStateHandles & THandles
