export const PRODUCT_SUMMARY_FRAGMENT = `#graphql
  fragment ProductSummary on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first:10) {
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