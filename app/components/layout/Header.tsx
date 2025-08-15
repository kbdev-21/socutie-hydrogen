import {Suspense, useEffect, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue, useLocation} from 'react-router';
import {
  type CartViewPayload, Image,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from '../../../storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {
  ChevronDown,
  Handbag,
  Instagram,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
} from 'lucide-react';

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

  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation(); // ✅ gives you current URL info

  const isHomePage = location.pathname === "/";


  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="">
      {/* mobile */}
      <div className={`flex lg:hidden w-full h-20 px-6 fixed top-0 z-40 transition-all duration-500 ease-in-out border-b ${isAtTop && isHomePage ? "bg-light-bg1/0 border-b-light-bg2/0" : "bg-light-bg1 border-b-light-bg2"} hover:bg-light-bg1 hover:border-b-light-bg2`}>
        <div className={"flex items-center justify-between relative w-full"}>
          <HeaderMenuMobileToggle />
          <Logo className={"absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"}/>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>

      {/* not-mobile */}
      <div className={`hidden lg:flex w-full h-20 px-20 items-center justify-center fixed top-0 z-40 transition-all duration-500 ease-in-out border-b ${isAtTop && isHomePage ? "bg-light-bg1/0 border-b-light-bg2/0" : "bg-light-bg1 border-b-light-bg2"} hover:bg-light-bg1 hover:border-b-light-bg2`}>
        <div className={"flex items-center justify-between w-full max-w-screen-xl h-full"}>
          <div>
            <Logo/>
          </div>
          <div className={'h-full flex items-center justify-center'}>
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
      <div className={`font-fancy font-medium text-[40px] ${className}`}>SoCutie</div>
        {/*<Image*/}
        {/*  src="/images/logo.png"*/}
        {/*  alt="logo"*/}
        {/*  className="h-full w-auto object-contain" // ~48px height fits nicely in 80px header*/}
        {/*  sizes="100px"*/}
        {/*/>*/}
    </NavLink>

  )
}


const CUSTOM_MENU = {
  items: [
    {
      id: 'all_products',
      resourceId: null,
      tags: [],
      title: 'SẢN PHẨM',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'all_collections',
      resourceId: null,
      tags: [],
      title: 'BỘ SƯU TẬP',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'about',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'GIỚI THIỆU',
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
    <nav className={`h-full flex gap-[3vw] items-center`}>
      {(menu || CUSTOM_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        const hasDropdown = item.items && item.items.length > 0;

        return (
          <div key={item.id} className="relative group h-full flex items-center">
            <NavLink
              to={url}
              onClick={close}
              prefetch="intent"
              className="h-full font-[400] flex items-center text-sm tracking-wide transition-colors duration-300 ease-in-out group-hover:text-light-main"
            >
              {item.title.toUpperCase()}
              <span className="absolute left-0 bottom-6 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </NavLink>

            {hasDropdown && (
              <div className={`
                absolute left-0 top-20 w-48 bg-light-bg1 
                transition-opacity duration-300 ease-in-out
                opacity-0 group-hover:opacity-100
                pointer-events-none group-hover:pointer-events-auto 
                z-50 py-4 border border-light-bg2
              `}>
                {item.items.map((subItem) => {
                  const subUrl = subItem.url
                    ? subItem.url.includes('myshopify.com') ||
                    subItem.url.includes(publicStoreDomain) ||
                    subItem.url.includes(primaryDomainUrl)
                      ? new URL(subItem.url).pathname
                      : subItem.url
                    : '#';
                  return (
                    <Link
                      key={subItem.id}
                      to={subUrl}
                      className="block px-4 py-2 text-sm text-light-text1 transition-colors duration-300 hover:text-light-main"
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function HeaderMenuMobile({
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
    <nav className={`h-full flex gap-10 flex-col`}>
      {(menu || CUSTOM_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        const hasDropdown = item.items && item.items.length > 0;

        return (
          <div key={item.id} className="relative group">
            <NavLink
              to={url}
              onClick={close}
              prefetch="intent"
              className="text-sm font-normal tracking-wide transition-colors duration-150 ease-in-out group-hover:text-light-main"
            >
              {item.title.toUpperCase()}
              <span className="absolute left-0 -bottom-2 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-500 ease-in-out group-hover:scale-x-100"></span>
            </NavLink>
          </div>
        );
      })}
    </nav>
  );
}


function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex gap-4 md:gap-6" role="navigation">
      <SearchToggle />

      <a
        className={"hidden md:flex"}
        href={"https://www.instagram.com/socutie.sg"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative group">
          <Instagram className="transition-colors duration-150 ease-in-out hover:text-light-main" />
          <span
            className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"
          ></span>
        </div>
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
      <div className="relative group">
        <Search className="transition-colors duration-150 ease-in-out hover:text-light-main" />
        <span
          className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"
        ></span>
      </div>
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
        <div className="relative group">
          <ShoppingCart className="transition-colors duration-150 ease-in-out hover:text-light-main" />
          <span
            className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"
          ></span>
        </div>
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
    //color: isPending ? 'grey' : 'black',
    color: 'text-light-text1'
  };
}
