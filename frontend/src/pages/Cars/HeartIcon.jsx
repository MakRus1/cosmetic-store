import { useEffect } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"

import {
    useFetchIsFavoriteQuery,
    useCreateFavoriteMutation,
    useRemoveFavoriteMutation,
} from '../../redux/api/favoriteApiSlice'

const HeartIcon = ({car}) => {
    const dispatch = useDispatch()
    const {data, refetch} = useFetchIsFavoriteQuery(car.ID)

    useEffect(() => {
        refetch()
    }, [refetch])

    const isFavorite = car.ID === data?.PRODUCT_ID

    const [createFavorite] = useCreateFavoriteMutation()
    const [removeFavorite] = useRemoveFavoriteMutation()

    const toggleFavorite = async () => {
        const result = await createFavorite(car.ID).unwrap() 
        refetch() 
    }

    const toggleUnfavorite = async () => {
        const result = await removeFavorite(car.ID).unwrap() 
        refetch() 
    }

    return (
        <div className="absolute top-2 right-5 cursor-pointer">
            {isFavorite ? (<FaHeart onClick={toggleUnfavorite} className="text-red-500" />) : <FaRegHeart onClick={toggleFavorite} className="text-black" />}
        </div>
    )
}

export default HeartIcon