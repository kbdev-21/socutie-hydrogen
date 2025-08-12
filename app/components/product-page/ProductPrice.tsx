import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {formatVnd} from '~/utils/stringUtils';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div>
      {compareAtPrice ? (
        <SalePriceDisplay/>
      ) : price ? (
        <div className={"text-lg font-normal text-light-text1"}>{formatVnd(price.amount)}{price.currencyCode === "VND" ? "₫" : "$"}</div>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );

  function SalePriceDisplay() {
    return (
      <div className="flex gap-2">
        <div className={"text-base font-normal text-light-text1"}>{formatVnd(price!.amount)}{price!.currencyCode === "VND" ? "₫" : "$"}</div>
        <div className={"text-base font-normal text-light-text1"}>{formatVnd(compareAtPrice!.amount)}{compareAtPrice!.currencyCode === "VND" ? "₫" : "$"}</div>
      </div>
    )
  }
}
