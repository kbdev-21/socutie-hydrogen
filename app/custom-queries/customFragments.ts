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

export const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;