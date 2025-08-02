import {Image} from '@shopify/hydrogen';

export function HeroBanner() {
  return (
    <div className={"relative"}>
      <Image
        src={"/images/test-hero-banner.jpeg"}
        alt={"hero-banner"}
        className={"w-full h-auto object-cover aspect-[1/1] lg:aspect-[2/1]"}
        sizes="100vw"
      />
      <div className="absolute inset-0 flex items-start justify-start">
        <div className={"flex flex-col h-full w-full justify-center p-10"}>
          <div className={"text-4xl font-bold"}>Summer Collection</div>
          <div className={"mt-1 text-lg font-medium"}>Bộ sưu tập hoàn toàn mới lấy cảm hứng từ mùa hè</div>
          <div className={"transition-all duration-200 hover:scale-105 cursor-pointer mt-6 bg-light-main py-4 px-6 w-[fit-content]"}>
            <div className={"text-lg font-medium"}>XEM NGAY</div>
          </div>
        </div>
      </div>
    </div>
  )
}