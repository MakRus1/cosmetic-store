import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation, useGetChequeQuery } from "../../redux/api/orderApiSlice"
import fs from 'fs'
import axios from 'axios'
import { ORDERS_URL } from "../../redux/constants"
import download from "downloadjs"

const Order = () => {
    const {id: orderId} = useParams()

    const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId)

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()
    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation()

    const {userInfo} = useSelector((state) => state.auth)

    const handlePaidOrder = async () => {
        await payOrder(orderId)
        refetch()
    }

    const handleDeliverOrder = async () => {
        await deliverOrder(orderId)
        refetch()    
    }

    const handleDownloadCheque = async () => {
        const result = await axios.get(`${ORDERS_URL}/${orderId}/cheque`, {
            responseType: 'blob'
        })
        console.log(result.data)
        return download(result.data, `cheque${orderId}.xlsx`)   
    }

    useEffect(() => {
        
    })

    return isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error.data.message}</Message>) :(
        <div className="container flex flex-col pl-[10rem] md:flex-row bg-[#f6fdd5] text-black pb-8 border border-[#799400]">
            <div className="md:w-2/3 pr-4">
                <div className="border gray-300 mt-5 pb-4 mb-5">
                    {order.items.length === 0 ? (
                        <Message>Заказ пуст</Message>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-[100%]">
                                <thead className="border-b-2">
                                    <tr>
                                        <th className="p-2">Изображение</th>
                                        <th className="p-2">Продукт</th>
                                        <th className="p-2">Количество</th>
                                        <th className="p-2">Цена</th>
                                        <th className="p-2">Итого</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <th className="p-2">
                                                <img src={item.PRODUCT_IMAGE} alt={item.NAME} className="w-[15rem] object-cover rounded-lg" />
                                            </th>
                                            <th className="p-2">
                                                <Link to={`/car/${item.ID}`} className="text-blue-500">
                                                    {item.NAME}
                                                </Link>
                                            </th>
                                            <th className="p-2">{item.QUANTITY}</th>
                                            <th className="p-2">{item.PRICE} ₽</th>
                                            <th className="p-2">{item.PRICE * item.QUANTITY} ₽</th>    
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="md:w-1/6">
                <div className="mt-5 border-gray-300 pb-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Доставляется</h2>
                    <p className="mb-4 mt-4">
                        <strong className="text-green-500">Заказ:</strong> {order.order.ID}
                    </p>
                    <p className="mb-4">
                        <strong className="text-green-500">Пользователь:</strong> {order.order.USERNAME}
                    </p>
                    <p className="mb-4">
                        <strong className="text-green-500">Почта:</strong> {order.order.EMAIL}
                    </p>
                    <p className="mb-4">
                        <strong className="text-green-500">Адрес:</strong> {order.order.SHIPPING_ADDRESS}
                    </p>

                    {order.order.IS_PAID ? (
                        <Message variant='success'>Оплачен: {order.order.TIME_PAID}</Message>
                    ) : (
                        <Message variant='danger'>Не оплачен</Message>
                    )}
                </div>
                <h2 className="text-xl font-bold mb-2 mt-[3rem]">Итого</h2>
                <div className="flex justify-between mb-2">
                    <span>Сумма:</span>
                    <span>{order.order.TOTAL_PRICE} ₽</span>
                </div>

                {!order.order.IS_PAID ? (
                    <button 
                        type="button" 
                        className="bg-[#799400] text-white py-2 px-4 rounded-full text-lg w-full mt-4" 
                        onClick={handlePaidOrder}
                    >
                        Оплатить
                    </button>
                ) : (
                    <div>
                        <button 
                            type="button" 
                            className="bg-[#799400] text-white py-2 px-4 rounded-full text-lg w-full mt-4" 
                            onClick={handleDownloadCheque}
                        >
                            Скачать чек
                        </button>     
                    </div>
                )}

                {loadingDeliver && <Loader />}
                {userInfo && userInfo.isAdmin && order.order.IS_PAID ? (
                    <div className="mt-4">
                        {order.order.IS_DELIVERED ? (
                            <Message variant='success'>Доставлен: {order.order.TIME_DELIVERED}</Message>
                        ) : (
                            <button type="button" className="bg-[#799400] text-white w-full py-2" onClick={handleDeliverOrder}>Доставлен</button>
                        )}
                    </div>
                ) : (
                    <></>
                )}
                
            </div>

        </div>
    )
}

export default Order