import { useGetLastCarsQuery } from "../../redux/api/carApiSlice"
import Message from '../../components/Message'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Link } from "react-router-dom"

const CarCarousel = () => {
    const {data: cars, isLoading, error} = useGetLastCarsQuery()

    const settings = {
        dots: false,
        infinity: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
    }


    return (
        <div className="mb-4 xl:block lg:block md: block">
            {isLoading ? null : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.message}
                </Message>
            ) : <Slider {...settings} className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block text-black">
                    {
                        cars.map(({PRODUCT_IMAGE, ID, NAME, PRICE}) => (
                            <div key={ID}>
                                <Link to={`/car/${ID}`}>
                                    <img src={PRODUCT_IMAGE} alt={NAME} className="w-full rounded-lg object-cover h-[50rem]" />

                                    <div className="flex justify-between w-[20rem]">
                                        <div className="one text-2xl">
                                            <h2>{NAME}</h2>
                                            <p>{PRICE} ₽</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </Slider>
            }
        </div>
    )
}

export default CarCarousel