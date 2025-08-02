import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from '../../../storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Handbag, Instagram, Menu, Search, ShoppingCart, UserRound} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  /* shopify nav */
  const {shop, menu} = header;

  return (
    <div className="">
      {/* mobile */}
      <div className={"flex lg:hidden w-full h-20 px-6 fixed top-0 z-10 bg-light-bg1 border-b border-b-light-bg2"}>
        <div className={"flex items-center justify-between relative w-full"}>
          <HeaderMenuMobileToggle />
          <Logo className={"absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"}/>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>

      {/* not-mobile */}
      <div className={"hidden lg:flex w-full h-20 px-20 items-center justify-center fixed top-0 z-10 bg-light-bg1 border-b border-b-light-bg2"}>
        <div className={"flex items-center justify-between w-full max-w-[1536px]"}>
          <div>
            <Logo/>
          </div>
          <div>
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </div>
          <div>
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>

      </div>
    </div>
  );
}

export function Logo({className = ""}) {
  return (
    <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
      <div className={`font-title font-medium text-5xl ${className}`}>SoCutie</div>
    </NavLink>
  )
}

const CUSTOM_MENU = {
  items: [
    {
      id: 'all_products',
      resourceId: null,
      tags: [],
      title: 'Sản Phẩm',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'all_collections',
      resourceId: null,
      tags: [],
      title: 'Bộ Sưu Tập',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'about',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'Giới Thiệu',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  return (
    <>
      <nav className={`flex gap-10 ${viewport === 'mobile' ? "flex-col" : ""}`}>
        {/* (menu || CUSTOM_MENU).items.map((item) => */}
        {(CUSTOM_MENU).items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              <div className="text-base font-semibold transition-colors duration-200 hover:text-light-main">
                {item.title}
              </div>
            </NavLink>
          );
        })}
      </nav>
    </>

  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex gap-6" role="navigation">
      <SearchToggle />
      <a
        className={"hidden md:flex"}
        href={"https://www.instagram.com/socutie.sg"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram className={"transition-colors duration-200 hover:text-light-main"}/>
      </a>

      {/*<NavLink className={"hidden md:flex"} prefetch="intent" to="/account" style={activeLinkStyle}>*/}
      {/*  <Suspense fallback="Sign in">*/}
      {/*    <Await resolve={isLoggedIn} errorElement="Sign in">*/}
      {/*      <UserRound className={"transition-colors duration-200 hover:text-light-main"}/>*/}
      {/*    </Await>*/}
      {/*  </Suspense>*/}
      {/*</NavLink>*/}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className=""
      onClick={() => open('mobile')}
    >
      <Menu />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="" onClick={() => open('search')}>
      <Search className={"transition-colors duration-200 hover:text-light-main"}/>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <div className={"relative"}>
        <ShoppingCart className={"transition-colors duration-200 hover:text-light-main"}/>
        {count === null ? <span>&nbsp;</span> : (
          <div className={"absolute -top-1 -right-2 bg-light-main text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center"}>{count}</div>
        )}
      </div>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    color: isPending ? 'grey' : 'black',
  };
}
