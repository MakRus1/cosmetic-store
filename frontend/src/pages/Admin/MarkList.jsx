import { useEffect, useState } from "react"
import {
    useCreateMarkMutation,
    useUpdateMarkMutation,
    useDeleteMarkMutation,
    useFetchMarksQuery, 
} from '../../redux/api/markApiSlice'

import { toast } from "react-toastify"
import MarkForm from "../../components/MarkForm"
import Modal from "../../components/Modal"
import AdminMenu from "./AdminMenu"

const MarkList = () => {
    const {data: marks, refetch} = useFetchMarksQuery()
    const [name, setName] = useState('')
    const [selectedMark, setSelectedMark] = useState(null)
    const [updateName, setUpdateName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const [createMark] = useCreateMarkMutation()
    const [updateMark] = useUpdateMarkMutation()
    const [deleteMark] = useDeleteMarkMutation()

    useEffect(() => {
        refetch()
    }, [refetch])

    const handleCreateMark = async (e) => {
        e.preventDefault()

        if (!name) {
            toast.error('Введите название марки')
            return
        }

        try {
            const result = await createMark({name}).unwrap()
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

    const handleUpdateMark = async (e) => {
        e.preventDefault()

        if (!updateName) {
            toast.error('Введите название марки')
            return
        }

        try {
            const result = await updateMark({markId: selectedMark.ID, updatedMark: {
                name: updateName
            }}).unwrap()
            if (result.error) {
                toast.error(result.error)
                return
            } 
            setName("")
            toast.success(`${result.name} обновлена`)
            setModalVisible(false)
            refetch()
        } catch (error) {
            console.log(error)
            toast.error('Ошибка обновления')
        }
    }

    const handleDeleteMark = async (e) => {
        e.preventDefault()

        try {
            const result = await deleteMark(selectedMark.ID).unwrap()
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
            <div className="h-12">Управление марками</div>
            <MarkForm value={name} setValue={setName} handleSubmit={handleCreateMark} />
            <br />
            <hr />

            <div className="flex flex-wrap">
                {marks?.map(mark => (
                    <div key={mark.ID}>
                        <button 
                            className="bg-gray border border-green-500 text-green-500 py-2 px-4 rounded-lg m-3 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={() => {{
                                setModalVisible(true)
                                setSelectedMark(mark)
                                setUpdateName(mark.NAME)
                            }}}
                        >
                            {mark.NAME}
                        </button>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}> 
                <MarkForm 
                    value={updateName} 
                    setValue={value => setUpdateName(value)}
                    handleSubmit={handleUpdateMark}
                    buttonText="Обновить"
                    handleDelete={handleDeleteMark}
                />
            </Modal>

        </div>
    </div>
}

export default MarkList