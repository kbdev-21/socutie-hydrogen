import {PRODUCT_SUMMARY_FRAGMENT} from '~/custom-queries/customFragments';

export const BEST_SELLERS_PRODUCTS_QUERY = `#graphql
  query BestSellersProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductSummary
      }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
` as const;

export const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts (
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductSummary
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
` as const;

export const COLLECTION_WITH_PRODUCTS = `#graphql
  query CollectionWithProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductSummary
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
` as const;