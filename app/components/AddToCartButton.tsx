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
                relative overflow-hidden
                w-full py-4 flex justify-center items-center
                text-base text-light-bg1
                bg-light-main shadow-sm
                transition-all duration-200
                before:absolute before:inset-0
                before:bg-light-main2 before:translate-x-[-100%]
                before:transition-transform before:duration-300
                hover:before:translate-x-0
              `}
            >
              {fetcher.state === "idle"
                ? <div className={"relative z-10"}>{children}</div>
                : (
                  <div className={"relative z-10 flex gap-3"}>
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
