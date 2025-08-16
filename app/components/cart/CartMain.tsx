import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from '../../../storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/cart/CartLineItem';
import {CartSummary} from '~/components/cart/CartSummary';
import {ArrowRight, ShoppingBag, ShoppingCart} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = cart?.lines?.nodes?.length || 0;
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={"relative h-full w-full"}>
      <div className={`flex flex-col px-6 h-[calc(100vh-230px)]`}>
        <CartEmpty hidden={linesCount !== 0} layout={layout} />
        <div aria-labelledby="cart-lines" className="max-h-[calc(100vh-230px)] overflow-y-auto scrollbar-hidden">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      </div>

      {cartHasItems && (
        <CartSummary cart={cart} layout={layout} />
      )}

    </div>

  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div className={"h-full"} hidden={hidden}>
    <div className={"h-full w-full flex gap-6 flex-col justify-center items-center"}>
      <div className={"rounded-full bg-light-bg3 p-5"}>
        <ShoppingBag size={32} strokeWidth={1.75}/>
      </div>
      <div className={"font-title text-2xl text-center"}>Giỏ hàng của bạn đang trống</div>
      <div className={"font-main text-base text-light-text2 text-center max-w-[350px]"}>Khám phá ngay bộ sưu tập mới nhất của chúng tôi tại đây</div>
      <Link className={`
         relative overflow-hidden flex gap-2 justify-center items-center
         shadow-md text-sm font-[400] text-light-bg1 font-main
         bg-light-main py-4 px-8
         transition-all duration-300
         before:absolute before:inset-0
         before:bg-light-main2 before:translate-x-[-100%]
         before:transition-transform before:duration-300
         hover:before:translate-x-0
       `} to="/collections/best-sellers" onClick={close} prefetch="viewport">
        <div className="relative z-10">OUR NEW ARRIVAL</div>
        <ArrowRight size={20} className="relative z-10"/>
      </Link>
    </div>
    </div>
  );
}
