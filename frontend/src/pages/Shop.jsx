import { useParams } from "react-router"
import { useGetCarsQuery } from "../redux/api/carApiSlice"
import Loader from "../components/Loader"
import SmallCar from '../pages/Cars/SmallCar'
import { useEffect} from "react"

const Shop = () => {
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
        <>
            <div className="flex justify-around">
                <div className="xl:block lg:hidden md:hidden sm:hidden">
                    <div className="grid grid-cols-4">
                        {data.cars.map((car) => (
                            <div key={car.ID}>
                                <SmallCar car={car} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Shop