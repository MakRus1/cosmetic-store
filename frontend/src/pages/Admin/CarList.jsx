import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    useCreateCarMutation,
    useUploadCarImageMutation
} from '../../redux/api/carApiSlice'
import { useFetchModelsQuery } from '../../redux/api/modelApiSlice'
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu"

const CarList = () => {
    const [image, setImage] = useState('')
    const [price, setPrice] = useState('')
    const [topSpeed, setTopSpeed] = useState('')
    const [engineVolume, setEngineVolume] = useState('')
    const [inStock, setInStock] = useState('')
    const [model, setModel] = useState('')
    const [imageUrl, setImageUrl] = useState(null)

    const navigate = useNavigate()

    const [uploadCarImage] = useUploadCarImageMutation()
    const [createCar] = useCreateCarMutation()
    const {data: models} = useFetchModelsQuery()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('price', price)
            formData.append('topSpeed', topSpeed)
            formData.append('engineVolume', engineVolume)
            formData.append('inStock', inStock)
            formData.append('model', model)

            const { data } = await createCar(formData)

            if (data.error) {
                toast.error("Ошибка создания. Попробуйте еще раз") 
                return  
            }

            toast.success(`Автомобиль успешно создан`) 
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
            setImageUrl(res.image)    
        } catch (error) {
            toast.error(error?.data?.message || error.error)    
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Создать автомобиль</div>

                    {imageUrl && (
                        <div className="text-center">
                            <img src={imageUrl} alt="car" className="block mx-auto max-h-[200px]" />
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

                    <button onClick={handleSubmit} className="bg-green-500 w-full text-white mt-4 py-3 px-4 rounded hover:bg-green-600">Создать</button>

                </div>
            </div>       
        </div>
    ) 
}

export default CarList