import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useFetchCartQuery } from "../../redux/api/cartApiSlice"
import { useSetShippingAddressMutation } from "../../redux/api/orderApiSlice"
import ProgressSteps from "../../components/ProgressSteps"

const Shipping = () => {
    const {data: cart, isLoading, error, refetch} = useFetchCartQuery()

    const [address, setAddress] = useState('')
    const [setShippingAddress] = useSetShippingAddressMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = async () => {
        localStorage.setItem('shippingAddress', address)
        //await setShippingAddress(address)
        navigate('/placeorder')
    }

    return (
        <div className="container mx-auto mt-10">
            <ProgressSteps step1 step2 />

            <div className="mt-[10rem] flex justify-around items-center flex-wrap">
                <form onSubmit={submitHandler} className="w-[40rem]">
                    <h1 className="text-2xl font-semibold mb-4">Доставка</h1>
                    <div className="mb-4">
                        <label className="block text-white mb-2">Адрес</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            placeholder="Введите адрес" 
                            value={address} 
                            required 
                            onChange={e => setAddress(e.target.value)} 
                        />
                    </div>

                    <button className="bg-green-500 text-white py-2 px-4 rounded-full text-lg w-full" type="submit">Продолжить</button>
                </form>
            </div>
        </div>
    )
}

export default Shipping