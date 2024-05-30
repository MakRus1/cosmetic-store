import { useParams } from "react-router"
import { useGetCarsQuery } from "../redux/api/carApiSlice"
import Loader from "./Loader"
import SmallCar from '../pages/Cars/SmallCar'
import { useEffect } from "react"
import CarCarousel from "../pages/Cars/CarCarousel"

const Header = () => {
    const {keyword} = useParams()
    const {data, isLoading, error, refetch} = useGetCarsQuery({keyword})

    useEffect(() => {
        refetch()
    }, [refetch])

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <h1>Ошибка</h1>
    }

    return (
        <div className="container mx-auto p-20">
            <div className="flex justify-center align-center md:flex md:space-x-4 bg-[#f6fdd5] border border-[#799400]">
                <div className="p-3">
                    <h1 className="text-4xl text-black font-semibold mb-4 text-center">Cosmetics</h1>
                    <CarCarousel />
                </div>
            </div>
        </div>
    )
}

export default Header