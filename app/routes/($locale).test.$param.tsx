import {useLoaderData} from 'react-router';
import {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {param} = params;
  const {storefront} = context;

  const {products} = await storefront.query(`
    query {
      products(first: 10) {
        nodes {
          id
          title
          featuredImage {
            id
            url
          }
          variants(first: 10) {
            nodes {
              id
              image {
                url
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `).catch((error) => {
    // Log query errors, but don't throw them so the page can still render
    console.error(error);
    return null;
  });

  return {
    param: param,
    products: products,
  }
}

export default function TestPage() {
  const {param, products} = useLoaderData();
  console.log(products);
  return <div className={'m-20'}>Yo {products.nodes[0].variants.nodes[0].price.amount}</div>;
}