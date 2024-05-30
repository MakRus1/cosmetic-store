import { useEffect } from "react"
import { useFetchCartQuery, useCreateCartItemMutation, useRemoveCartItemMutation } from "../../redux/api/cartApiSlice"
import Loader from "../../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FaTrash } from "react-icons/fa"

const Cart = () => {
    const navigate = useNavigate()

    const {userInfo} = useSelector(state => state.auth)

    const {data: cart, isLoading, error, refetch} = useFetchCartQuery()

    let totalCount = 0
    let totalSum = 0

    const [addToCart] = useCreateCartItemMutation()
    const [removeFromCart] = useRemoveCartItemMutation()

    const addToCartHandler = async (car, count) => {
        const result = await addToCart({carId: car.ID, count: count})
        refetch()    
    }

    const removeFromCartHandler = async (carId) => {
        const result = await removeFromCart(carId)  
        refetch()   
    }

    const checkoutHandler = async () => {
        navigate('/login?redirect=/shipping')
    }

    useEffect(() => {
        refetch()
    }, [refetch])

    if (isLoading) {
        return <Loader />
    }

    if (!userInfo) {
        return (
            <h1 className="p-4 ml-16 text-2xl font-semibold mb-4 bg-[#f6fdd5]">
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
        <>
            <div className="container flex justify-around items-start flex-wrap mx-auto mt-8 bg-[#f6fdd5] p-4 text-black">
                {cart.count === 0 ? (<div>Ваша корзина пуста. <Link to='/shop' className="text-blue-500 hover:underline">В магазин</Link></div>) : (
                    <>
                        <div className="flex flex-col w-[80%]">
                            <h1 className="text-2xl font-semibold mb-4">Корзина</h1>
                            {
                                cart.cart.map((item) => (
                                    <div key={item.ID} className="flex items-center mb-[1rem] pb-2">
                                        <div className="w-[5rem] h-[5rem]">
                                            <img src={item.PRODUCT_IMAGE} alt={item.NAME} className="w-full h-full object-cover rounded" />
                                        </div>

                                        <div className="flex-1 ml-4">
                                            <Link to={`/car/${item.ID}`} className="text-blue-500">
                                                {item.NAME}
                                            </Link>

                                            <div className="mt-2 text-black font-bold">{item.PRICE} ₽</div>
                                        </div>

                                        <div className="w-24">
                                            <select 
                                                className="w-full p-1 border rounded text-black" 
                                                value={item.QUANTITY} 
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                            >
                                                {[...Array(item.QUANTITY).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <button className="text-red-500 mr-[5rem]" onClick={() => removeFromCartHandler(item.ID)}>
                                                <FaTrash className="ml-[1rem]"/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }

                            <div className="mt-8 w-[40rem]">
                                <div className="p-4 rounded-lg">
                                    <h2 className="text-xl font-semibold mb-2">
                                        Всего: {cart.cart.forEach((item) => totalCount += item.QUANTITY), totalCount}
                                    </h2>

                                    <div className="text-2xl font-bold">
                                        {cart.cart.forEach((item) => totalSum += item.PRICE * item.QUANTITY), totalSum} ₽
                                    </div>

                                    <button 
                                        className="bg-[#799400] mt-4 py-2 px-4 rounded-full text-lg w-full text-white" 
                                        disabled={cart.count === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Заказать
                                    </button>
                                </div>
                            </div>    
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Cart