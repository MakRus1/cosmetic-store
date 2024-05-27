import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { Link } from "react-router-dom"
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice"

const UserOrder = () => {
    const {data: orders, isLoading, error} = useGetMyOrdersQuery();

    return (
        <div className="container mx-auto pl-20">
            <h2 className="text-2xl font-semibold mb-4">Мои заказы</h2>

            {isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error?.data?.error || error.error}</Message>) : (
                <table className="w-full">
                    <thead>
                        <tr>
                            <td className="py-2">Номер</td>
                            <td className="py-2">Дата</td>
                            <td className="py-2">Сумма</td>
                            <td className="py-2">Оплата</td>
                            <td className="py-2">Доставка</td>
                            <td className="py-2"></td>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.ID}>
                                <td className="py-2">{order.ID}</td>
                                <td className="py-2">{order.META$CR_TIMESTAMP}</td>
                                <td className="py-2">{order.TOTAL_PRICE}</td>
                                <td className="py-2">{order.IS_PAID ? (
                                    <p className="p1 text-center bg-green-400 w-[8rem] rounded-full">
                                        Оплачен
                                    </p>
                                ) : (
                                    <p className="p1 text-center bg-red-400 w-[8rem] rounded-full">
                                        Не оплачен
                                    </p>
                                )}</td>
                                <td className="py-2">{order.IS_DELIVERED ? (
                                    <p className="p1 text-center bg-green-400 w-[8rem] rounded-full">
                                        Доставлен
                                    </p>
                                ) : (
                                    <p className="p1 text-center bg-red-400 w-[8rem] rounded-full">
                                        Не доставлен
                                    </p>
                                )}</td>
                                <td className="py-2">
                                    <Link to={`/order/${order.ID}`}>
                                        <button className="bg-green-400 text-black py-2 px-3 rounded">Детали</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}

export default UserOrder