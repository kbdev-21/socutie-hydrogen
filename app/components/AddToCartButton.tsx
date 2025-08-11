import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Loader2, LoaderCircle, ShoppingBag} from "lucide-react";

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              className={`
                w-full py-4 flex justify-center items-center
                text-base text-light-bg1
                bg-light-main shadow-sm
                transition-all duration-300 ease-in-out
                hover:opacity-80
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
            >
              {fetcher.state === "idle"
                ? children
                : (
                  <div className={"flex gap-3"}>
                    <LoaderCircle className={"animate-spin"}/>
                    <div>Đang xử lý</div>
                  </div>
                )
              }
            </button>
          </>
        )
      }}
    </CartForm>
  );
}
