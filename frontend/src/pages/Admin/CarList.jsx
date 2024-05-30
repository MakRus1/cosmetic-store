import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    useCreateCarMutation,
    useUploadCarImageMutation
} from '../../redux/api/carApiSlice'
import { useFetchMarksQuery } from '../../redux/api/markApiSlice'
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu"

const CarList = () => {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [inStock, setInStock] = useState('')
    const [manufacturer, setManufacturer] = useState('')
    const [imageUrl, setImageUrl] = useState(null)

    const navigate = useNavigate()

    const [uploadCarImage] = useUploadCarImageMutation()
    const [createCar] = useCreateCarMutation()
    const {data: manufacturers} = useFetchMarksQuery()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('name', name)
            formData.append('price', price)
            formData.append('description', description)
            formData.append('inStock', inStock)
            formData.append('manufacturer', manufacturer)

            const { data } = await createCar(formData)

            if (data.error) {
                toast.error("Ошибка создания. Попробуйте еще раз") 
                return  
            }

            toast.success(`Продукт успешно создан`) 
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
        <div className="container mx-auto p-4 bg-[#f6fdd5] text-black">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Создать продукт</div>

                    {imageUrl && (
                        <div className="text-center">
                            <img src={imageUrl} alt="car" className="block mx-auto max-h-[200px]" />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="border text-black px-4 block w-full text-center rounded-lg cursor-poiner font-bold py-11">
                            {image ? image.name : "Загрузить изображение"}

                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={uploadFileHandler} 
                                className={!image ? 'hidden' : "text-black"}
                            />
                        </label>
                    </div>
                        
                    <div className="block">
                        <label htmlFor="model block">Название</label> <br />
                        <input 
                            type="text" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#f6fdd5] text-black"
                            value={name}
                            onChange={e => setName(e.target.value)} 
                        />

                        <label htmlFor="model block">Производитель</label> <br />
                        <select 
                            type="text" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#f6fdd5] text-black"
                            value={manufacturer}
                            onChange={e => setManufacturer(e.target.value)} 
                        >
                            {manufacturers?.map((m) => (
                                <option key={m.ID} value={m.ID}>
                                    {m.NAME}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="model block">Цена</label> <br />
                        <input 
                            type="number" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#f6fdd5] text-black"
                            value={price}
                            onChange={e => setPrice(e.target.value)} 
                        />
                
                        <label htmlFor="model">Описание</label> <br />
                        <input 
                            type="text" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#f6fdd5] text-black"
                            value={description}
                            onChange={e => setDescription(e.target.value)} 
                        />

                        <label htmlFor="model block">Количество на складе</label> <br />
                        <input 
                            type="number" 
                            className="p-4 mb-3 w-full border rounded-lg bg-[#f6fdd5] text-black"
                            value={inStock}
                            onChange={e => setInStock(e.target.value)} 
                        />
                    </div>

                    <button onClick={handleSubmit} className="bg-[#799400] w-full text-white mt-4 py-3 px-4 rounded hover:bg-green-600">Создать</button>

                </div>
            </div>       
        </div>
    ) 
}

export default CarList