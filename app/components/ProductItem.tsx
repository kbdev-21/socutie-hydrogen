import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {formatVnd} from '~/utils/stringUtils';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          src={image.url}
          alt={image.altText || product.title}
          aspectRatio="3/4"
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className={"font-semibold text-base mt-4"}>{product.title}</div>
      <div className={"text-base font-normal text-light-text2"}>{formatVnd(product.priceRange.minVariantPrice.amount)}₫</div>
      {/*<Money data={product.priceRange.minVariantPrice}/>*/}
    </Link>
  );
}
