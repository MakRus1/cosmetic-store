import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useGetCarByIdQuery } from "../../redux/api/carApiSlice"
import Loader from "../../components/Loader"
import Message from "../../components/Message"
import HeartIcon from "./HeartIcon"
import { useCreateCartItemMutation, useRemoveCartItemMutation, useFetchIsInCartQuery } from "../../redux/api/cartApiSlice"

const CarDetails = () => {
    const {id: carId} = useParams()

    const {data: car, isLoading, refetch, error} = useGetCarByIdQuery(carId)

    useEffect(() => {
        refetch()
    }, [refetch])

    const {data: cart, refetch: refetchCart} = useFetchIsInCartQuery(carId)

    const isInCart = carId == cart?.PRODUCT_ID

    const [createCartItem] = useCreateCartItemMutation()
    const [removeCartItem] = useRemoveCartItemMutation()

    const [count, setCount] = useState(1)

    const addToCartHandler = async () => {
        const result = await createCartItem({carId: car.ID, count: count})
        refetchCart()
    }

    const removeFromCartHandler = async () => {
        const result = await removeCartItem(car.ID)
        refetchCart()    
    }

    return (
        <>
            <div>
                <Link to='/' className="text-black font-semibold hover:underline ml-[10rem]">
                    Назад
                </Link>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.message}
                </Message>
            ) : (
                <>
                    <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem] bg-[#f6fdd5] border border-[#799400] text-black rounded-lg">
                        <div className="bg-[#f9fde9] border border-[#799400] rounded-lg">
                            <img src={car.PRODUCT_IMAGE} alt={car.NAME} className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]" />
                            <HeartIcon car={car} />
                        </div>

                        <div className="flex flex-col ml-4">
                            <h2 className="text-2xl font-semibold">{car.NAME}</h2>
                            <p className="my-4 font-bold">Описание: {car.DESCRIPTION}</p>
                            <p className="text-4xl my-4 font-bold">{car.PRICE} ₽</p>

                            <div className="btn-container">
                                {isInCart ? (
                                    <button onClick={removeFromCartHandler} className="bg-red-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0">Удалить из корзины</button>
                                ) : (
                                    <>
                                        <button onClick={addToCartHandler} className="bg-[#799400] text-white py-2 px-4 rounded-lg mt-4 md:mt-0">Добавить в корзину</button>
                                        <select 
                                            className="ml-4 p-1 border rounded text-black" 
                                            value={count} 
                                            onChange={(e) => setCount(Number(e.target.value))}
                                        >
                                            {[...Array(car.QUANTITY).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}                                    
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default CarDetails