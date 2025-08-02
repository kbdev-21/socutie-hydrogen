import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment, ProductSummaryFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {formatVnd} from '~/utils/stringUtils';

export function ProductItem({
  product,
  loading,
}: {
  product: ProductSummaryFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  const imgUrlsList = product.images.nodes.map(image => image.url);
  return (
    <Link
      className=""
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {imgUrlsList.length > 0 && (
        <Image
          src={imgUrlsList[0]}
          alt={product.title}
          className={"w-full h-auto"}
          aspectRatio="3/4"
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className={"pt-4 flex flex-col items-center justify-center"}>
        <div className={"font-semibold text-base"}>{product.title}</div>
        <div className={"text-base font-normal text-light-text2"}>{formatVnd(product.priceRange.minVariantPrice.amount)}₫</div>
        {/*<Money data={product.priceRange.minVariantPrice}/>*/}
      </div>
    </Link>
  );
}
