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
import convert from 'color-convert';

export function ProductItem({
  product,
  loading,
}: {
  product: ProductSummaryFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);

  const imgUrlsList = product.images.nodes.map(image => image.url);
  const emptyImgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  const initImgUrl = imgUrlsList.length >= 1 ? imgUrlsList[0] : emptyImgUrl;
  const hoverImgUrl = imgUrlsList.length === 0 ? emptyImgUrl : (imgUrlsList.length >= 2 ? imgUrlsList[1] : initImgUrl);

  //list of all color options
  const colorOptions = product.options
    .filter(option => option.name === "Color")
    .flatMap(option => option.optionValues.map(v => v.name));

  const colorHexs = colorOptions.map(color =>
    '#' + convert.keyword.hex(color.trim().toLowerCase()) || '#000000'
  );

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
      <div className="relative">
        {/* 🖼 Initial image */}
        <Image
          src={initImgUrl}
          alt={product.title}
          className={`z-20 relative w-full h-auto aspect-[3/4] object-cover transition-opacity duration-300 ease-in-out ${isHovering ? 'opacity-0' : 'opacity-100'} z-10 relative`}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />

        {/* 🖼 Hover image */}
        <Image
          src={hoverImgUrl}
          alt={product.title}
          className={`z-10 absolute absolute top-0 left-0 w-full h-auto aspect-[3/4] object-cover`}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />

        {/* 🔍 Search icon on top */}
        <div className={`z-30 absolute bottom-2 right-2 flex justify-center items-center w-8 h-8 bg-light-main text-light-text1 transition-all duration-300 ease-in-out ${isHovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <Search size={20} />
        </div>
      </div>

      <div className={"pt-3 flex flex-col justify-center items-center"}>
        <div className={"font-normal text-base font-title mb-1"}>{product.title}</div>

        <div className={"text-sm font-normal text-light-text2"}>{formatVnd(product.priceRange.minVariantPrice.amount)}₫</div>
        {/*<Money data={product.priceRange.minVariantPrice}/>*/}

        <ColorOptions/>
      </div>


    </Link>
  );

  function ColorOptions() {
    return colorHexs.length >= 1 ? (
      <div className={"flex gap-1 mt-3"}>
        {colorHexs.map((color, index) => (
          <div key={index} className={`h-[18px] w-[18px] rounded-full border border-light-bg2`} style={{ backgroundColor: color }}>
          </div>
        ))}
      </div>
    ) : null;
  }
}
