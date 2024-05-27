import { useEffect, useState } from "react"
import {
    useCreateModelMutation,
    useUpdateModelMutation,
    useDeleteModelMutation,
    useFetchModelsQuery, 
} from '../../redux/api/modelApiSlice'

import { toast } from "react-toastify"
import ModelForm from "../../components/ModelForm"
import Modal from "../../components/Modal"
import AdminMenu from "./AdminMenu"

const ModelList = () => {
    const {data: models, refetch} = useFetchModelsQuery()
    const [name, setName] = useState('')
    const [mark, setMark] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [updateName, setUpdateName] = useState('')
    const [updateMark, setUpdateMark] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const [createModel] = useCreateModelMutation()
    const [updateModel] = useUpdateModelMutation()
    const [deleteModel] = useDeleteModelMutation()

    useEffect(() => {
        refetch()
    }, [refetch])

    const handleCreateModel = async (e) => {
        e.preventDefault()

        if (!name) {
            toast.error('Введите название модели')
            return
        }
        if (!mark) {
            toast.error('Выберите марку')
            return
        }

        try {
            const result = await createModel({name, markId: mark}).unwrap()
            if (result.error) {
                toast.error(result.error)
                return
            } 
            setName("")
            toast.success(`${result.name} создана`)
            refetch()
        } catch (error) {
            console.log(error)
            toast.error('Ошибка создания')
        }
    }

    const handleUpdateModel = async (e) => {
        e.preventDefault()

        if (!updateName) {
            toast.error('Введите название модели')
            return
        }
        if (!updateMark) {
            toast.error('Выберите марку')
            return
        }

        try {
            const result = await updateModel({modelId: selectedModel.ID, updatedModel: {
                name: updateName,
                markId: updateMark,
            }}).unwrap()
            if (result.error) {
                toast.error(result.error)
                return
            } 
            setName("")
            setMark(null)
            toast.success(`${result.name} обновлена`)
            setModalVisible(false)
            refetch()
        } catch (error) {
            console.log(error)
            toast.error('Ошибка обновления')
        }
    }

    const handleDeleteModel = async (e) => {
        e.preventDefault()

        try {
            const result = await deleteModel(selectedModel.ID).unwrap()
            if (result.error) {
                toast.error(result.error)
                return
            } 
            setName("")
            toast.success(`${result.NAME} удалена`)
            setModalVisible(false)
            refetch()

        } catch (error) {
            console.log(error)
            toast.error('Ошибка удаления')
        }
    }

    return <div className="ml-[10rem] flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
            <div className="h-12">Управление моделями</div>
            <ModelForm name={name} mark={mark} setName={setName} setMark={setMark} handleSubmit={handleCreateModel} />
            <br />
            <hr />

            <div className="flex flex-wrap">
                {models?.map(model => (
                    <div key={model.ID}>
                        <button 
                            className="bg-gray border border-green-500 text-green-500 py-2 px-4 rounded-lg m-3 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={() => {{
                                setSelectedModel(model)
                                setUpdateName(model.NAME)
                                setUpdateMark(model.SP_MARK_ID)
                                setModalVisible(true)
                            }}}
                        >
                            {model.MARK_NAME + " " + model.NAME}
                        </button>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}> 
                <ModelForm 
                    name={updateName} 
                    mark={updateMark} 
                    setName={value => setUpdateName(value)}
                    setMark={value => setUpdateMark(value)}
                    handleSubmit={handleUpdateModel}
                    buttonText="Обновить"
                    handleDelete={handleDeleteModel}
                />
            </Modal>

        </div>
    </div>
}

export default ModelList