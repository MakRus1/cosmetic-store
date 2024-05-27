import { useEffect } from "react"
import { useFetchFavoritesQuery } from "../../redux/api/favoriteApiSlice"

const FavoritesCount = () => {
    const {data, refetch} = useFetchFavoritesQuery()

    useEffect(() => {
        refetch()
    }, [refetch])

    return (
        <div className="absolute left-6 top-8">
            {data?.count > 0 && (
                <span className="px-1 py-0 text-sm text-white bg-red-700 rounded-full">
                    {data?.count}
                </span>
            )}
        </div>
    )
}

export default FavoritesCount