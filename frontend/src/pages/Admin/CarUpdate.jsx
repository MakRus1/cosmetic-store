import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    useUpdateCarMutation,
    useDeleteCarMutation,
    useGetCarByIdQuery,
    useUploadCarImageMutation
} from '../../redux/api/carApiSlice'
import { useFetchMarksQuery } from '../../redux/api/markApiSlice'
import { toast } from "react-toastify"

const CarUpdate = () => {
    const params = useParams()

    const {data: carData} = useGetCarByIdQuery(params.id)

    const [name, setName] = useState(carData?.NAME || '')
    const [image, setImage] = useState(carData?.PRODUCT_IMAGE || '')
    const [price, setPrice] = useState(carData?.PRICE || '')
    const [description, setDescription] = useState(carData?.DESCRIPTION || '')
    const [manufacturer, setManufacturer] = useState(carData?.SP_MANUFACTURER_ID || '')
    const [inStock, setInStock] = useState(carData?.QUANTITY || 0)

    const navigate = useNavigate()

    const {data: manufacturers = []} = useFetchMarksQuery()
    const [uploadCarImage] = useUploadCarImageMutation()

    const [updateCar] = useUpdateCarMutation()
    const [deleteCar] = useDeleteCarMutation()

    useEffect(() => {
        if (carData && carData.ID) {
            setName(carData.NAME)
            setImage(carData.PRODUCT_IMAGE)
            setPrice(carData.PRICE)
            setDescription(carData.DESCRIPTION)
            setManufacturer(carData.SP_MANUFACTURER_ID)
            setInStock(carData.QUANTITY)
        }
    }, [carData])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            
            formData.append('name', name)
            formData.append('image', image)
            formData.append('price', price)
            formData.append('description', description)
            formData.append('manufacturer', manufacturer)
            formData.append('inStock', inStock)
            
            const { data } = await updateCar({carId: params.id, formData})

            if (data.error) {
                toast.error("Ошибка обновления. Попробуйте еще раз") 
                return  
            }

            toast.success(`Продукт успешно обновлен`) 
            navigate('/admin/allcars')  
        } catch (error) {
            toast.error(error?.data?.message || error.error)    
        }
    }

    const handleDelete = async () => {
        try {
            let answer = window.confirm('Вы уверены, что хотите удалить продукт?')

            if (!answer) return

            const { data } = await deleteCar(params.id)

            if (data.error) {
                toast.error("Ошибка удаления. Попробуйте еще раз") 
                return  
            }

            toast.success(`Продукт успешно удален`) 
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
        <div className="container mx-auto p-4 bg-[#f6fdd5] text-black">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                {/* <AdminMenu /> */}
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Обновить продукт</div>

                    {image && (
                        <div className="text-center">
                            <img src={image} alt="car" className="block mx-auto max-h-[200px]" />
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
                        <label htmlFor="model">Название</label> <br />
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