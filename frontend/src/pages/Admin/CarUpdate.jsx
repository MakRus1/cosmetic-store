import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    useUpdateCarMutation,
    useDeleteCarMutation,
    useGetCarByIdQuery,
    useUploadCarImageMutation
} from '../../redux/api/carApiSlice'
import { useFetchModelsQuery } from '../../redux/api/modelApiSlice'
import { toast } from "react-toastify"

const CarUpdate = () => {
    const params = useParams()

    const {data: carData} = useGetCarByIdQuery(params.id)

    const [image, setImage] = useState(carData?.CAR_IMAGE || '')
    const [price, setPrice] = useState(carData?.PRICE || '')
    const [topSpeed, setTopSpeed] = useState(carData?.TOP_SPEED || '')
    const [engineVolume, setEngineVolume] = useState(carData?.ENGINE_VOLUME || '')
    const [model, setModel] = useState(carData?.SP_MODEL_ID || '')
    const [inStock, setInStock] = useState(carData?.IN_STOCK || 0)

    const navigate = useNavigate()

    const {data: models = []} = useFetchModelsQuery()
    const [uploadCarImage] = useUploadCarImageMutation()

    const [updateCar] = useUpdateCarMutation()
    const [deleteCar] = useDeleteCarMutation()

    useEffect(() => {
        if (carData && carData.ID) {
            setImage(carData.CAR_IMAGE)
            setPrice(carData.PRICE)
            setTopSpeed(carData.TOP_SPEED)
            setEngineVolume(carData.ENGINE_VOLUME)
            setModel(carData.SP_MODEL_ID)
            setInStock(carData.IN_STOCK)
        }
    }, [carData])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            
            formData.append('image', image)
            formData.append('price', price)
            formData.append('topSpeed', topSpeed)
            formData.append('engineVolume', engineVolume)
            formData.append('model', model)
            formData.append('inStock', inStock)
            
            const { data } = await updateCar({carId: params.id, formData})

            if (data.error) {
                toast.error("Ошибка обновления. Попробуйте еще раз") 
                return  
            }

            toast.success(`Автомобиль успешно обновлен`) 
            navigate('/admin/allcars')  
        } catch (error) {
            toast.error(error?.data?.message || error.error)    
        }
    }

    const handleDelete = async () => {
        try {
            let answer = window.confirm('Вы уверены, что хотите удалить автомобиль?')

            if (!answer) return

            const { data } = await deleteCar(params.id)

            if (data.error) {
                toast.error("Ошибка удаления. Попробуйте еще раз") 
                return  
            }

            toast.success(`Автомобиль успешно удален`) 
            navigate('/admin/allcars')  
        } catch (error) {
            toast.error(error?.data?.message || error.error)    
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData()
        formData.append('image', e.target.files[0])

        try {
            const res = await uploadCarImage(formData).unwrap()
            toast.success(res.message)
            setImage(res.image) 
        } catch (error) {
            toast.error(error?.data?.message || error.error)    
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                {/* <AdminMenu /> */}
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Создать автомобиль</div>

                    {image && (
                        <div className="text-center">
                            <img src={image} alt="car" className="block mx-auto max-h-[200px]" />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-poiner font-bold py-11">
                            {image ? image.name : "Загрузить изображение"}

                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={uploadFileHandler} 
                                className={!image ? 'hidden' : "text-white"}
                            />
                        </label>
                    </div>
                        
                    <div className="block">
                        <label htmlFor="model block">Марка и модель</label> <br />
                        <select 
                            type="text" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                            value={model}
                            onChange={e => setModel(e.target.value)} 
                        >
                            {models?.map((m) => (
                                <option key={m.ID} value={m.ID}>
                                    {m.MARK_NAME + " " + m.NAME}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="model block">Цена</label> <br />
                        <input 
                            type="number" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                            value={price}
                            onChange={e => setPrice(e.target.value)} 
                        />
                
                        <label htmlFor="model">Максимальная скорость</label> <br />
                        <input 
                            type="number" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                            value={topSpeed}
                            onChange={e => setTopSpeed(e.target.value)} 
                        />

                        <label htmlFor="model block">Объем двигателя</label> <br />
                        <input 
                            type="number" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                            value={engineVolume}
                            onChange={e => setEngineVolume(e.target.value)} 
                        />

                        <label htmlFor="model block">Количество на складе</label> <br />
                        <input 
                            type="number" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                            value={inStock}
                            onChange={e => setInStock(e.target.value)} 
                        />
                    </div>

                    <div className="w-full">
                        <button onClick={handleSubmit} className="bg-green-500 w-1/3 text-white mt-4 py-3 px-4 rounded hover:bg-green-600 mr-6">Обновить</button>
                        <button onClick={handleDelete} className="bg-red-500 w-1/3 text-white mt-4 py-3 px-4 rounded hover:bg-red-600">Удалить</button>
                    </div>   

                </div>
            </div>       
        </div>
    ) 
}

export default CarUpdate