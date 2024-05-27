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
        <div className="container mx-auto p-4">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                <div className="p-3">
                <h1 className="text-2xl font-semibold mb-4">Кчау - надежный диллер автомобилей</h1>
                    <CarCarousel />
                </div>
            </div>
        </div>
    )
}

export default Header