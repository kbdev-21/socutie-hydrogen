import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment, ProductSummaryFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {formatVnd} from '~/utils/stringUtils';
import {useState} from "react";
import {Handbag, Plus, Search} from 'lucide-react';

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
  const emptyImgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  const initImgUrl = imgUrlsList.length >= 1 ? imgUrlsList[0] : emptyImgUrl;
  const hoverImgUrl = imgUrlsList.length === 0 ? emptyImgUrl : (imgUrlsList.length >= 2 ? imgUrlsList[1] : initImgUrl);

  const [isHovering, setIsHovering] = useState(false);
  return (
    <Link
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className=""
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className={"relative"}>
        <Image
          src={isHovering ? hoverImgUrl : initImgUrl}
          alt={product.title}
          className={"w-full h-auto aspect-[3/4] object-cover"}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
        <div className="absolute p-2 inset-0 flex items-end justify-end ">
          <div className={`flex justify-center items-center w-8 h-8 bg-light-main text-light-text2 transition-all duration-400 ${isHovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <Search size={20} />
          </div>
        </div>
      </div>
      <div className={"pt-4 flex flex-col items-center justify-center"}>
        <div className={"font-semibold text-base"}>{product.title}</div>
        <div className={"text-base font-normal text-light-text2"}>{formatVnd(product.priceRange.minVariantPrice.amount)}₫</div>
        {/*<Money data={product.priceRange.minVariantPrice}/>*/}
      </div>
    </Link>
  );
}
