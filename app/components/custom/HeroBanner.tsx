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
        <div className={"flex flex-col h-full w-[400px] lg:w-[600px] justify-center p-10"}>
          <div className={"text-5xl font-bold font-title"}>Summer Collection 2025</div>
          <div className={"mt-2 text-lg font-normal tracking-tight"}>Bộ sưu tập hoàn toàn mới của năm 2025 với phong cách, chất liệu và màu sắc được lấy cảm hứng từ mùa hè</div>
          <div className={"transition-all duration-200 shadow-sm cursor-pointer mt-6 bg-light-main py-4 px-8 w-[fit-content]"}>
            <div className={"text-base text-light-bg1 font-[400]"}>KHÁM PHÁ NGAY</div>
          </div>
        </div>
      </div>
    </div>
  )
}