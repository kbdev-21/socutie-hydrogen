import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {X} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  // lock screen scrolling when open
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);

  return (
    <div
      aria-modal
      className={`fixed z-50 inset-0 bg-[rgba(0,0,0,0.2)] opacity-0 pointer-events-none 
       transition-opacity duration-500 
       ${expanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`
    }
      role="dialog"
    >
      {/* Empty side */}
      <button
        onClick={close}
        className="cursor-default bg-transparent border-none text-transparent h-full left-0 absolute top-0 w-[100%]"
      >
      </button>

      {/* Real aside dialog */}
      <aside className={`fixed right-0 top-0 h-full w-[90vw] max-w-[500px] bg-white transition-transform duration-500 ease-in-out
    ${expanded ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className={"flex justify-between items-center px-6 h-20"}>
          <div className={"text-xl font-[500]"}>{heading}</div>
          <button className="transition-all duration-300 text-light-text1 hover:rotate-180" onClick={close} aria-label="Close">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="border-t border-light-bg2" />
        <div className={"h-full"}>{children}</div>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
