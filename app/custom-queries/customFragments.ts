export const PRODUCT_SUMMARY_FRAGMENT = `#graphql
  fragment ProductSummary on Product {
    id
    title
    handle
    options {
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first:2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
` as const;

const BEST_SELLERS_PRODUCTS_QUERY = `
`