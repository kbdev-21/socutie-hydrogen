import {useLoaderData} from 'react-router';
import {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Swiper, SwiperSlide} from 'swiper/react';
// ✅ Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import {useState} from 'react';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {param} = params;
  const {storefront} = context;

  const {products} = await storefront.query(`
    query {
      products(first: 10) {
        nodes {
          id
          title
          featuredImage {
            id
            url
          }
          variants(first: 10) {
            nodes {
              id
              image {
                url
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `).catch((error) => {
    // Log query errors, but don't throw them so the page can still render
    console.error(error);
    return null;
  });

  return {
    param: param,
    products: products,
  }
}

export default function TestPage() {
  const {param, products} = useLoaderData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const imgUrls = [
    "https://cdn.shopify.com/s/files/1/0756/1854/9982/files/a1.jpg?v=1754430283",
    "https://cdn.shopify.com/s/files/1/0756/1854/9982/files/a2.jpg?v=1754430284",
    "https://cdn.shopify.com/s/files/1/0756/1854/9982/files/s1.jpg?v=1754430044"
  ]

  return (
    <>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        grabCursor={true}
        className={"max-w-xl aspect-[3/4] h-auto mx-auto"}
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.activeIndex);
        }}
      >
        {imgUrls.map((url, index) => (
          <SwiperSlide>
            <img src={imgUrls[index]} alt="1" className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="text-center mt-10">
        Showing image {currentIndex + 1} of {imgUrls.length}
      </div>
    </>
  );
}