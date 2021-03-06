import Loader from '@/components/Loader'
import { MODIFY_DOC, SEARCH_EBAY, SEARCH_EBAY_BARE } from '@/lib/queries'
import { moneyFormat } from '@/lib/utils'
import { EbayItem, Tag, View } from '@/server/schema/types'
import { print } from 'graphql/language/printer'
import Link from 'next/link'
import { object } from 'prop-types'
import { graphql, MutationFn } from 'react-apollo'
import { Box } from 'rebass'
import {
  compose,
  getContext,
  setDisplayName,
  withHandlers,
  withState
} from 'recompose'
import { prop } from 'styled-tools'

import ImportWorker from './save.worker.js'

export default compose<SearchProps & SearchHandlers, {}>(
  setDisplayName('header-search'),
  getContext({ session: object }),
  withState('isOpen', 'toggleModal', false),
  withState('items', 'setItems', []),
  graphql<SearchProps>(MODIFY_DOC, {
    props: ({ mutate, data, ownProps: { session } }) => ({
      data,
      updateView: t =>
        mutate({
          refetchQueries: ['getView'],
          update: () => document.body.setAttribute('data-proc', t._id),
          variables: {
            objectId: session._id,
            collectionName: 'view',
            input: {
              $addToSet: {
                tags: t._id
              }
            }
          }
        })
    })
  }),
  withHandlers<SearchProps, SearchHandlers>(
    ({ updateView, toggleModal, setItems }) => {
      let worker: Worker

      return {
        handleSubmit: () => async () => {
          const el = document.getElementById('s') as HTMLInputElement
          const keywords = el.value
          const $form = el.closest('form') as HTMLFormElement

          worker = new ImportWorker()
          $form.classList.add('loading')

          worker.addEventListener('message', ({ data: e }) => {
            try {
              if (e.err) {
                throw e.err
              }

              if (!e.ebay.items.length) {
                alert('No items were found, aborting')
                toggleModal(false, () => {
                  $form.reset()
                  worker.terminate()
                })
              } else if (e.done) {
                setItems(e.ebay.items, async () => {
                  await updateView(e.ebay.tag)
                  $form.classList.remove('loading')
                  worker.terminate()
                })
              }
            } catch (err) {
              $form.reset()
              worker.terminate()
            }
          })

          toggleModal(true, () =>
            setItems([], () =>
              worker.postMessage({
                query: print(SEARCH_EBAY),
                variables: {
                  keywords,
                  save: false,
                  operation: 'findItemsByKeywords',
                  paginationInput: { pageNumber: 1, entriesPerPage: 4 },
                  itemFilter: [
                    {
                      name: 'HideDuplicateItems',
                      value: true
                    }
                  ]
                }
              })
            )
          )
        },

        handleConfirm: () => () => {
          const el = document.getElementById('s') as HTMLInputElement
          const keywords = el.value

          const $form = el.closest('form') as HTMLFormElement
          const $status = document.getElementById('status')

          worker = new ImportWorker()
          $form.classList.add('loading')

          let n = 0
          worker.addEventListener('message', async ({ data: e }) => {
            try {
              if (e.err) {
                throw e.err
              } else if ($form.classList.contains('loading')) {
                $form.classList.remove('loading')
                $form.classList.add('processing')
              }

              if (e.total) {
                $status.firstElementChild.innerHTML = `${(n += e.total)} / ${
                  e.totalEntries
                } &hellip;`
              }

              if (e.done) {
                $status.lastElementChild.textContent = 'OK'
                document.body.removeAttribute('data-proc')

                $form.reset()
                worker.terminate()
              }
            } catch (err) {
              $form.reset()
              worker.terminate()
            }
          })

          setItems([], () =>
            toggleModal(false, () =>
              worker.postMessage({
                recurse: true,
                query: print(SEARCH_EBAY_BARE),
                variables: {
                  keywords,
                  operation: 'findCompletedItems',
                  save: true,
                  paginationInput: { pageNumber: 1, entriesPerPage: 100 },
                  itemFilter: [
                    {
                      name: 'HideDuplicateItems',
                      value: true
                    },
                    {
                      name: 'SoldItemsOnly',
                      value: true
                    }
                  ]
                }
              })
            )
          )
        },

        handleReset: () => () =>
          setItems([], () =>
            toggleModal(false, () => {
              document
                .getElementById('search')
                .classList.remove('processing', 'loading')

              document.body.removeAttribute('data-proc')
            })
          ),

        handleAbort: () => () => {
          ;(document.getElementById('search') as HTMLFormElement).reset()

          if ('terminate' in worker) {
            worker.terminate()
          }
        }
      }
    }
  )
)(
  ({
    isOpen,
    handleSubmit,
    handleConfirm,
    handleReset,
    handleAbort,
    items = []
  }) => (
    <Box
      as="form"
      id="search"
      method="post"
      action="javascript:;"
      onSubmit={handleSubmit}
      onReset={handleReset}
      css={`
        z-index: 100;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 0;
        padding: 0;

        &.loading {
          input,
          button {
            opacity: 0.5;
            pointer-events: none;
          }
        }

        > a {
          display: inline-block;
          white-space: nowrap;
        }

        > input {
          margin: 0 calc(var(--pad) / 2);
        }

        &:not(.processing) #status {
          display: none;
        }
      `}>
      <Link href="/">
        <a>+view</a>
      </Link>

      <input
        required
        id="s"
        name="s"
        placeholder="Add a product"
        autoComplete="off"
        spellCheck={false}
      />

      <Box
        id="status"
        css={`
          display: flex;
          align-items: center;
          position: fixed;
          top: 0;
          left: 50%;
          padding: 5px;
          transform: translateX(-50%);
          border: 1px solid #e2bc83;
          background: #f5ed00;
        `}>
        <span>working&hellip;</span>
        <a href="javascript:;" onClick={handleAbort}>
          abort
        </a>
      </Box>

      {isOpen && (
        <Box
          as="section"
          css={`
            z-index: 100;
            position: fixed;
            top: calc(var(--pad) + 26px);
            left: var(--pad);
            padding: var(--pad) 0;

            @media (min-width: 1025px) {
              width: calc(50vw - var(--pad));
            }

            @media (max-width: 1025px) {
              right: var(--pad);
              border: 1px solid ${prop('theme.border')};
              background: ${prop('theme.bg')};
            }

            nav {
              margin: 10px auto;
              padding: var(--pad);
              border: 1px solid ${prop('theme.border')};
              background: ${prop('theme.panel')};
            }

            nav > div {
              display: flex;
              align-items: center;

              + div {
                margin-top: 1px;

                @media (max-width: 1025px) {
                  margin-top: calc(var(--pad) / 2);
                }
              }

              figure {
                width: 40px;
                height: 40px;
                margin: auto;

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }

                &:hover + aside > a {
                  color: ${prop('theme.base')};
                }
              }

              aside {
                display: flex;
                justify-content: space-between;
                flex: 1;
                padding-left: 1em;
              }
            }
          `}>
          <h5>
            Please verify that these initial results represent the data you want
            to pull &mdash;
          </h5>
          <nav>
            {items.length ? (
              items.map((item, i) => (
                <div key={i + item._id}>
                  {'galleryURL' in item && (
                    <figure>
                      <a href={item.viewItemURL} target="_blank" rel="noopener">
                        <img src={item.galleryURL} alt={item.title} />
                      </a>
                    </figure>
                  )}

                  <aside>
                    <a
                      href={item.viewItemURL}
                      target="_blank"
                      rel="noopener"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />

                    {'currentPrice' in item.sellingStatus && (
                      <p>
                        {moneyFormat(
                          item.sellingStatus.currentPrice[0].__value__
                        )}
                      </p>
                    )}
                  </aside>
                </div>
              ))
            ) : (
              <Loader
                size={100}
                animationDuration={1337}
                style={{ gridColumn: '1 / -1', margin: 'auto' }}
              />
            )}
          </nav>
          <button type="button" onClick={handleConfirm}>
            Import
          </button>
          &nbsp;
          <button type="reset">Cancel</button>
        </Box>
      )}
    </Box>
  )
)

export interface SearchProps {
  items: EbayItem[]
  tags?: Tag[]
  isOpen: boolean
  isProcessing: boolean
  session?: View
  updateView?: (t: Tag) => MutationFn
  setItems?: (r: EbayItem[] | string[], cb?: () => void) => void
  toggleModal?: (b: boolean, cb?: () => void) => void
  toggleProcessing?: (b: boolean, cb?: () => void) => void
  toggleForm?: (b: boolean, cb?: () => void) => void
}

export interface SearchHandlers {
  handleSubmit?: React.FormEventHandler<HTMLElement>
  handleConfirm?: React.FormEventHandler<HTMLElement>
  handleReset?: React.FormEventHandler<HTMLElement>
  handleAbort?: React.MouseEventHandler<HTMLElement>
}
