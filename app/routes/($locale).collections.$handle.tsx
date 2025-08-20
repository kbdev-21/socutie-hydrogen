import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, useNavigate, useLocation} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {COLLECTION_WITH_PRODUCTS_QUERY} from "~/custom-queries/customQueries";
import {HeroBanner} from '~/components/home/HeroBanner';
import {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {FadeInItem, FadeInStagger} from '~/components/framer-motion/FadeInStagger';

const PRODUCTS_PER_PAGE = 30;

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: PRODUCTS_PER_PAGE,
  });

  if (!handle) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const sortKey = (url.searchParams.get('sortKey') || "BEST_SELLING") as ProductCollectionSortKeys;
  const reverse = (url.searchParams.get('reverse') === "true") || false;

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_WITH_PRODUCTS_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        sortKey,
        reverse
      },
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const location = useLocation();

  const imgUrl = collection.image;

  // TODO: cheat and shitty feature, need to fix later
  const productsCountString = collection.products.nodes.length >= PRODUCTS_PER_PAGE ? PRODUCTS_PER_PAGE + "+" : collection.products.nodes.length + "";

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title/Banner */}
      <div className={"w-full"}>
        {imgUrl ? (<HeroBanner src={imgUrl.url}></HeroBanner>) : (<HeroBanner></HeroBanner>)}

      </div>

      <div className={"px-6 lg:px-20 py-16 w-full flex flex-col items-center justify-center"}>
        <div className={"text-2xl lg:text-3xl font-[500] text-center"}>
          {collection.title.toUpperCase()}
        </div>
        {/*<div className={"mt-4 text-sm text-center tracking-tight max-w-[500px]"}>*/}
        {/*  {collection.description}*/}
        {/*</div>*/}
      </div>
      {/*<h1>{collection.title}</h1>*/}
      {/*<p className="collection-description">{collection.description}</p>*/}

      {/* Options bar */}
      <div className={"w-full  flex items-center justify-center px-6 lg:px-20 mb-6"}>
        <div className={"w-full max-w-screen-xl flex items-center justify-between  py-3 border-l-0 border-r-0 border border-light-bg2"}>
          <div className={"text-sm"}>
            {productsCountString} sản phẩm
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={"hidden sm:block"}>Sort by:</div>
            <SortDropdown />
          </div>
        </div>
      </div>

      {/* Product list */}
      <div key={location.search} className={"w-full flex justify-center px-6 lg:px-20"}>
        <FadeInStagger>
          <PaginatedResourceSection
            connection={collection.products}
            resourcesClassName="max-w-screen-xl w-full grid mb-8 gap-6 lg:gap-10 grid-cols-2 lg:grid-cols-4"
          >
            {({node: product, index}) => (
              <FadeInItem>
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 8 ? 'eager' : undefined}
                />
              </FadeInItem>
            )}
          </PaginatedResourceSection>
        </FadeInStagger>

      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const sortOptions = [
  {label: "Bán chạy nhất", value: "BEST_SELLING", reverse: false},
  {label: "Mới nhất", value: "CREATED", reverse: true},
  {label: "Cũ nhất", value: "CREATED", reverse: false},
  {label: "Giá thấp đến cao", value: "PRICE", reverse: false},
  {label: "Giá cao đến thấp", value: "PRICE", reverse: true},
];

export function SortDropdown() {
  const [open, setOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('Bán chạy nhất');
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort =
    new URLSearchParams(location.search).get("sortKey") || "BEST_SELLING";

  const currentReverse =
    new URLSearchParams(location.search).get("reverse") === "true" || false;

  function handleSelect(label: string, value: string, reverse: boolean) {
    setCurrentLabel(label);
    navigate(`?sortKey=${value}&reverse=${reverse}`, {
      replace: true,
      preventScrollReset: true,
    });
    setOpen(false);
  }

  useEffect(() => {
    setCurrentLabel(sortOptions.find((o) => (o.value === currentSort && o.reverse === currentReverse))?.label || "Bán chạy nhất");

    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected value */}
      <button
        className="w-[180px] px-3 py-2 border border-light-bg2 flex justify-between items-center rounded-[4px]"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className={"text-sm font-[500]"}>
          {currentLabel}
        </div>
        <ChevronDown className={`transition-all duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"} text-light-text2`} size={18} strokeWidth={1.5}/>
      </button>

      {/* Dropdown menu */}
      <div className={`transition-all rounded-b-[4px] duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"} absolute flex flex-col w-[180px] left-0 right-0 bg-white border-t-0 border border-light-bg2 z-40`}>
        {sortOptions.map((option) => (
          <button
            key={option.value + option.reverse}
            onClick={() => handleSelect(option.label, option.value, option.reverse)}
            className={`w-full text-sm px-3 py-2 cursor-pointer hover:bg-light-bg3 flex justify-start items-center ${
              (option.value === currentSort && option.reverse === currentReverse) ? "font-[500]" : ""
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
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
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
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
          ...ProductItem
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
` as const;
