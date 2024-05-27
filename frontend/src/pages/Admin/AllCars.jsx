import { Link } from "react-router-dom"
import moment from 'moment'
import { useAllCarsQuery } from "../../redux/api/carApiSlice"
import AdminMenu from "./AdminMenu"
import Loader from "../../components/Loader"
import { useEffect } from "react"

const AllCars = () => {
    const {data: cars, isLoading, isError, refetch} = useAllCarsQuery()

    useEffect(() => {
        refetch()
    }, [refetch])

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <div>Ошибка загрузки автомобилей</div>
    }

    return (
        <div className="container pl-20">
            <div className="flex flex-col md:flex-row">
                <div className="p-3">
                    <div className="text-xl font-bold h-12">
                        Автомобили ({cars.length})
                    </div>

                    <div className="flex flex-wrap items-center">
                        {cars?.map((car) => (
                            <Link key={car.ID} to={`/admin/car/update/${car.ID}`} className="w-1/4 mb-4 overflow-hidden">
                                <div className="block">
                                    <img src={car.CAR_IMAGE} alt={car.NAME} className="w-3/4 object-cover" />
                                    
                                    <h5 className="text-xl font-semibold mb-2">
                                        {car.NAME}
                                    </h5>

                                    <p className="mb-2">{car?.PRICE} ₽</p>  

                                    <Link to={`/admin/car/update/${car.ID}`} className="inline-flex items-center mb-4 px-3 py-2 text-sm font-medium text-center text-white 
                                    bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 
                                    dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    >
                                        Изменить автомобиль
                                    </Link>
                                      
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="md:w-1/4 p-3 mt-2">
                    <AdminMenu />
                </div>
            </div>
        </div>
    )
}

export default AllCars