import {Image} from '@shopify/hydrogen';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';

export function HeroBanner() {
  return (
    <FadeInDiv offsetY={-20}>
      <div className="relative">
        <Image
          src="/images/big-banner.png"
          alt="hero-banner"
          className="w-full h-auto object-cover aspect-[3/4] lg:aspect-[21/9]"
          sizes="100vw"
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Optional content */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-5xl">Summer Collection 2025</div>
    </div> */}
      </div>
    </FadeInDiv>

  )
}