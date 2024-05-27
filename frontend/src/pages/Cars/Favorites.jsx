import { useEffect } from "react"
import { useFetchFavoritesQuery } from "../../redux/api/favoriteApiSlice"
import SmallCar from "./SmallCar"
import Loader from "../../components/Loader"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Favorites = () => {
    const {userInfo} = useSelector(state => state.auth)

    const {data, isLoading, error, refetch} = useFetchFavoritesQuery()

    useEffect(() => {
        refetch()
    }, [refetch])

    if (isLoading) {
        return <Loader />
    }

    if (!userInfo) {
        return (
            <h1 className="p-4 ml-16 text-2xl font-semibold mb-4">
                Необходимо {" "} 
                <Link to='/register' className="text-blue-500 hover:underline">
                    зарегестрироваться
                </Link>
                {" "} или {" "} 
                <Link to='/login' className="text-blue-500 hover:underline">
                    авторизоваться
                </Link>
            </h1> 
        )   
    }

    if (error) {
        return <h1 className="p-4 ml-16 text-2xl font-semibold mb-4">Ошибка</h1>
    }

    return (
        <div>
            <h1 className="p-4 ml-16 text-2xl font-semibold mb-4">Понравившиеся</h1>
            <div className="flex justify-around">
                <div className="xl:block lg:hidden md:hidden sm:hidden">
                    <div className="grid grid-cols-4">
                        {data.favorites.map((car) => (
                            <div key={car.ID}>
                                <SmallCar car={car} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Favorites