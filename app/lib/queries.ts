import { Tag } from '@/server/schema/types'
import { BaphoTheme } from '@/theme'
import gql from 'graphql-tag'
import { ChildProps, DataProps, graphql } from 'react-apollo'

const tagFragment = gql`
  fragment TagFields on Tag {
    _id
    createdAt
    deletedAt
    isDeleted
    isQuery
    restoredAt
    slug
    title
    total
    updatedAt
  }
`

const productFragment = gql`
  fragment ProductFields on Product {
    _id
    tags {
      ...TagFields
    }
    bids
    createdAt
    deletedAt
    image
    isDeleted
    price
    qty
    restoredAt
    shipping
    slug
    status
    timeLeft
    title
    updatedAt
    url
  }
`

export const GET_PRODUCTS = gql`
  query getProducts {
    products {
      ...ProductFields
    }
  }

  ${productFragment}
  ${tagFragment}
`

// ------------------------------------------------

export const GET_TAGS = gql`
  query getTags {
    tags {
      ...TagFields
    }
  }

  ${tagFragment}
`

export const CREATE_TAG = gql`
  mutation createTag($input: TagInput) {
    createTag(input: $input) {
      ...TagFields
    }
  }

  ${tagFragment}
`

export const getTags = (options = {}) =>
  graphql<{}, { tags: Tag[] }>(GET_TAGS, {
    ...options,
    props: ({ data: { tags = [], ...data } }) => ({
      data,
      initialTags: tags
    })
  })

// ------------------------------------------------

export const GET_THEME = gql`
  query getTheme {
    theme
  }
`

export const SET_THEME = gql`
  mutation setTheme($theme: String!) {
    setTheme(theme: $theme)
  }
`

export const getTheme = () =>
  graphql<
    {},
    { theme: string },
    DataProps<{ theme: string }>,
    ChildProps<BaphoTheme>
  >(GET_THEME, {
    props: ({ data: { theme } }) => ({ theme: JSON.parse(theme) })
  })

// ------------------------------------------------

const ebayFragment = gql`
  fragment EbayFields on EbayResult {
    total
    items {
      _id
      attribute
      autoPay
      condition
      country
      galleryInfoContainer
      galleryURL
      globalId
      isMultiVariationListing
      listingInfo
      location
      paymentMethod
      pictureURLSuperSize
      postalCode
      primaryCategory
      returnsAccepted
      sellerInfo
      sellingStatus
      shippingInfo
      subtitle
      timestamp
      title
      topRatedListing
      unitPrice
      viewItemURL
    }
  }
`

export const SEARCH_EBAY = gql`
  query getEbay(
    $keywords: String!
    $save: Boolean
    $paginationInput: Pagination
  ) {
    ebay(keywords: $keywords, save: $save, paginationInput: $paginationInput) {
      ...EbayFields
    }
  }

  ${ebayFragment}
`

// ------------------------------------------------

export const REMOVE_DOC = gql`
  mutation remove($objectId: ID!, $collectionName: String!) {
    remove(objectId: $objectId, collectionName: $collectionName) {
      ok
    }
  }
`

export const MODIFY_DOC = gql`
  mutation modify($objectId: ID!, $collectionName: String!, $input: JSON) {
    modify(
      objectId: $objectId
      collectionName: $collectionName
      input: $input
    ) {
      ... on Product {
        _id
      }

      ... on Tag {
        _id
      }
    }
  }
`