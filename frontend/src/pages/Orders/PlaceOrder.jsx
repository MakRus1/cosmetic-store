import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice"
import { useFetchCartQuery, useClearCartMutation } from "../../redux/api/cartApiSlice"
import ProgressSteps from "../../components/ProgressSteps"

const PlaceOrder = () => {
    const navigate = useNavigate()

    let totalSum = 0

    const [address, setAddress] = useState(localStorage.getItem('shippingAddress'))

    const {data: cart} = useFetchCartQuery()

    const [createOrder, {isLoading, error}] = useCreateOrderMutation()
    const [clearCart] = useClearCartMutation()

    useEffect(() => {
        if (!address) {
            navigate('/shipping')
        }
    }, [navigate])

    const placeOrderHandler = async () => {
        try {
            const result = await createOrder({
                orderItems: cart.cart,
                shippingAddress: address
            }).unwrap()

            clearCart()

            navigate(`/order/${result.ID}`)
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <>
            <ProgressSteps step1 step2 step3 />

            <div className="container mx-auto mt-8 bg-[#f6fdd5] text-black">
                {
                    cart.cart.length === 0 ? (
                        <Message>Корзина пуста</Message>
                    ) : (
                        <div className="overflow-x-auto ml-[8rem]">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <td className="px-1 py-2 text-left align-top">Картинка</td>
                                        <td className="px-1 py-2 text-left">Продукт</td>
                                        <td className="px-1 py-2 text-left">Количество</td>
                                        <td className="px-1 py-2 text-left">Цена</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.cart.map((item, index) => (
                                        <tr key={index}>
                                            <td className="p-2"><img src={item.PRODUCT_IMAGE} alt={item.NAME} className="w-16 h-16 object-cover" /></td>
                                            <td className="px-1 py-2 text-left"><Link to={`/car/${item.ID}`}>{item.NAME}</Link></td>
                                            <td className="px-1 py-2 text-left">{item.QUANTITY}</td>
                                            <td className="px-1 py-2 text-left">{item.PRICE * item.QUANTITY} ₽</td>    
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                }
                <div className="mt-8 ml-[8rem] mr-[8rem]">
                    <h2 className="text-2xl font-semibold mb-5">Итого</h2>
                    <div className="flex justify-between flex-wrap p-8">
                        <ul className="text-lg">
                            <li>
                                <span className="font-semibold mb-4">Сумма: </span>
                                {cart.cart.forEach((item) => totalSum += item.PRICE * item.QUANTITY), totalSum} ₽
                            </li>
                        </ul>

                        {error && <Message variant='danger'>{error.data.message}</Message>}

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Доставка</h2>
                            <span className="font-semibold mb-4">Адрес: {address}</span>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        className="bg-[#799400] text-white py-2 px-4 rounded-full text-lg w-full mt-4" 
                        disabled={cart.cart.length === 0}
                        onClick={placeOrderHandler}
                    >
                        Заказать
                    </button>

                    {isLoading && <Loader />}
                </div>
            </div>  
        </>
    )
}

export default PlaceOrder