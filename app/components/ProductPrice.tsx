import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {formatVnd} from '~/utils/stringUtils';

export function ProductPrice({
  price,
  compareAtPrice,
  size = 'normal'
}: {
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  size?: 'normal' | 'small';
}) {
  return (
    <div>
      {compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount) ? (
        <SalePriceDisplay/>
      ) : price ? (
        <div className={`${size === "normal" ? "text-lg" : "text-sm"} font-normal text-light-text1`}>{formatVnd(price.amount)}{price.currencyCode === "VND" ? "₫" : "$"}</div>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );

  function SalePriceDisplay() {
    return (
      <div className={`flex ${size === "normal" ? "gap-2" : "gap-1"} items-center`}>
        <div className={`${size === "normal" ? "text-lg" : "text-sm"} font-[500] text-light-secondary`}>{formatVnd(price!.amount)}{price!.currencyCode === "VND" ? "₫" : "$"}</div>
        <div className={`${size === "normal" ? "text-sm" : "text-sm"} font-normal text-light-text2 line-through decoration-light-text2`}>{formatVnd(compareAtPrice!.amount)}{compareAtPrice!.currencyCode === "VND" ? "₫" : "$"}</div>
      </div>
    )
  }
}
