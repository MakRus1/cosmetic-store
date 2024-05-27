import { useEffect } from "react"
import { useFetchCartQuery } from '../../redux/api/cartApiSlice'

const CartCount = () => {
    const {data, refetch} = useFetchCartQuery()

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

export default CartCount