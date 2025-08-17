import {MENU_FRAGMENT, PRODUCT_SUMMARY_FRAGMENT} from '~/custom-queries/customFragments';

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts ($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    productRecommendations(productHandle: $handle) {
      ...ProductSummary
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
` as const;

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

export const COLLECTION_WITH_PRODUCTS_QUERY = `#graphql
  query CollectionWithProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
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
        sortKey: $sortKey
        reverse: $reverse
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


export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

export const MENU_QUERY = `#graphql
  query MenuQuery(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    menu(handle: $handle) {
      ...Menu
    }
  }

  ${MENU_FRAGMENT}
` as const;

export const HOMEPAGE_COLLECTIONS_MENU_QUERY = `#graphql
  query HomepageCollectionsMenu(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    menu(handle: "home") {
      id
      items {
        id
        type
        resource {
          ... on Collection {
            id
            handle
            title
            description
            image {
              id
              url
              width
              height
            }
            products(first: 10) {
              nodes {
                ...ProductSummary
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
` as const;