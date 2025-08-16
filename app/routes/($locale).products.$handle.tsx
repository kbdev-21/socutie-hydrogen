import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/product-page/ProductImage';
import {ProductForm} from '~/components/product-page/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useState} from "react";
import {RECOMMENDED_PRODUCTS_QUERY} from "~/custom-queries/customQueries";
import {ProductItem} from "~/components/ProductItem";
import {ChevronDown} from 'lucide-react';
import {motion} from 'framer-motion';
import {FadeInItem, FadeInStagger} from '~/components/framer-motion/FadeInStagger';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}, {productRecommendations}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {handle},
    })
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    productRecommendations,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

const additionInfoMenu = [
  {
    title: "Hướng dẫn sử dụng",
    content: "Vệ sinh nhẹ bằng khăn ẩm hoặc giặt tay, phơi thoáng mát, bảo quản khô ráo, tránh quá tải và vật sắc nhọn để sản phẩm luôn bền đẹp"
  },
  {
    title: "Chính sách giao hàng",
    content: "Phí Shipping: miễn phí nội thành TPHCM, 30.000đ toàn quốc\nThời gian giao hàng: 1-5 ngày. Có thể kiểm tra tình trạng giao hàng qua mã đơn hàng"
  },
  {
    title: "Chính sách bảo hành",
    content: "Đổi trả miễn phí 1 lần nếu không đúng size. Bảo hành 12 tháng"
  },
];

export default function Product() {
  const {product, productRecommendations } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className={"mt-20 lg:mt-24 flex flex-col items-center lg:px-20"}>
      {/* Product detail */}
      <FadeInDiv>
        <div className="grid grid-cols-1 items-start gap-6 lg:gap-3 lg:grid-cols-2 max-w-[1280px] w-full">
          {/* Left side (top on mobile) */}
          <ProductImage variantImage={selectedVariant?.image} images={product.images.nodes} />

          {/* Right side (bottom on mobile) */}
          <div className="product-form px-6 lg:px-0 lg:ml-12 lg:mt-4">
            {/* Title and price */}
            <div className={"font-[500] font-title text-3xl mb-2"}>{title}</div>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <div className="mt-6 mb-6 border-t border-light-bg2" />

            {/* Variants and Add to cart button */}
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            {/* Desription */}
            <div className={"mt-8"}>
              <div className={"font-title text-2xl"}>Mô tả sản phẩm</div>
              <div
                className={"text-sm font-main text-light-text1 font-[400] tracking-tight mt-6 [&_strong]:text-light-text1 [&_strong]:font-[500] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"}
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          </div>
          <Analytics.ProductView
            data={{
              products: [
                {
                  id: product.id,
                  title: product.title,
                  price: selectedVariant?.price.amount || '0',
                  vendor: product.vendor,
                  variantId: selectedVariant?.id || '',
                  variantTitle: selectedVariant?.title || '',
                  quantity: 1,
                },
              ],
            }}
          />
        </div>
      </FadeInDiv>


      {/* Additional info */}
      <FadeInDiv>
        <AdditionalInfo/>
      </FadeInDiv>

      {/* Suggestions */}
      <div className="mt-20 mb-6 w-full border-t border-light-bg2" />
      <div className={"flex justify-center w-full max-w-screen-xl text-center px-6 lg:px-0 mt-10 mb-8 text-3xl font-title"}>
        <div>Có thể bạn cũng thích</div>
      </div>
      <FadeInStagger>
        <div
          className="px-6 lg:px-0 max-w-screen-xl w-full grid gap-6 lg:gap-10 grid-cols-2 lg:grid-cols-4"
        >
          {productRecommendations?.map((product) => (
            <FadeInItem key={product.id}>
              <ProductItem product={product} />
            </FadeInItem>
          ))}
        </div>
      </FadeInStagger>

    </div>

  );

  function AdditionalInfo() {
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
      <div className={"flex flex-col gap-4 mt-16 w-full max-w-[912px] px-6 lg:px-0"}>
        <div className={"w-full flex justify-center font-title text-2xl mb-4 "}>
          FAQs
        </div>

        {additionInfoMenu.map((item, index) => (
          <div key={item.title}>
            <AdditionalInfoItem item={item} />
          </div>
        ))}
      </div>
    );
  }

  function AdditionalInfoItem({item}: {item: any}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          className={"flex w-full justify-between items-center p-6 border border-light-bg2 bg-light-bg3 hover:cursor-pointer"}
          onClick={() => {setIsOpen(!isOpen)}}
        >
          <div className={"font-title text-xl"}>
            {item.title}
          </div>
          <div className={`${isOpen ? "rotate-180" : ""} transition-transform duration-300 ease-in-out`}>
            <ChevronDown size={20} strokeWidth={1.5} />
          </div>
        </button>
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            border border-t-0 border-light-bg2 bg-light-bg1
          `}
        >
          <div className="p-6 font-main text-base tracking-tight">
            {item.content}
          </div>
        </div>
      </>
    )
  }
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    images(first:20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
