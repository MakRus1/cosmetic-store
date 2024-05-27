import { useEffect, useState } from "react"
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../redux/api/usersApiSlice'
import Message from "../../components/Message"
import AdminMenu from "./AdminMenu"

const UserList = () => {
    const {data: users, refetch, isLoading, error} = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()

    const [editableUserId, setEditableUserId] = useState(null)
    const [editableUsername, setEditableUsername] = useState('')
    const [editableUserEmail, setEditableUserEmail] = useState('')

    useEffect(() => {
        refetch()
    }, [refetch])

    const deleteHandler = async(id) => {
        if (window.confirm("Вы уверены, что хотите удалить пользователя?")) {
            try {
                const res = await deleteUser(id)
                if (res.error) {
                    toast.error(res.error)
                    return
                }
                refetch()
            } catch (error) {
                toast.error(error.data.message || error.error)
            }
        }
    }

    const toggleEdit = (id, username, email) => {
        setEditableUserId(id)
        setEditableUsername(username)
        setEditableUserEmail(email)
    }

    const updateHandler = async (id) => {
        try {
            const result = await updateUser({
                userId: id,
                username: editableUsername,
                email: editableUserEmail
            }).unwrap()

            if (result.error) {
                toast.error(result.error)
                return
            }

            setEditableUserId(null)
            refetch()
        } catch (error) {
            toast.error(error.data.message || error.error)
        }
    }

    return (
        <div className="p-4 ml-14">
            <AdminMenu /> 
            <h1 className="text-2xl font-semibold mb-4">Пользователи</h1>
            {
                isLoading ? 
                    (<Loader />) : 
                    error ? 
                        (<Message variant='danger'>{error?.data?.message || error.message}</Message>) : 
                        (
                            <div className="flex flex-col md:flex-row">
                                {/* <AdminMenu /> */}
                                <table className="w-full md-4/5 mx-auto">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">ID</th>
                                            <th className="px-4 py-2 text-left">USERNAME</th>
                                            <th className="px-4 py-2 text-left">EMAIL</th>
                                            <th className="px-4 py-2 text-left">ADMIN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.ID}>
                                                <td className="px-4 py-2">{user.ID}</td>
                                                <td className="px-4 py-2">
                                                    {editableUserId === user.ID ? (
                                                        <div className="flex items-center">
                                                            <input type="text" value={editableUsername} onChange={e => setEditableUsername(e.target.value)} className="w-full p-2 border rounded-lg" />
                                                            <button onClick={() => updateHandler(user.ID)} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                                                <FaCheck />
                                                            </button>
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className="flex items-center">
                                                            {user.USERNAME} {" "}
                                                            <button onClick={() => toggleEdit(user.ID, user.USERNAME, user.EMAIL)}>
                                                                <FaEdit className="ml-[1rem]" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {editableUserId === user.ID ? (
                                                        <div className="flex items-center">
                                                            <input type="email" value={editableUserEmail} onChange={e => setEditableUserEmail(e.target.value)} className="w-full p-2 border rounded-lg" />
                                                            <button onClick={() => updateHandler(user.ID)} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                                                <FaCheck />
                                                            </button>
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className="flex items-center">
                                                            {user.EMAIL} {" "}
                                                            <button onClick={() => toggleEdit(user.ID, user.USERNAME, user.EMAIL)}>
                                                                <FaEdit className="ml-[1rem]" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {user.IS_ADMIN ? (
                                                        <FaCheck style={{color: "green"}} />
                                                    ) : 
                                                    (
                                                        <FaTimes style={{color: "red"}} />
                                                    )}
                                                </td>

                                                <td className="px-4 py-2">
                                                    {!user.IS_ADMIN && (
                                                        <div className="flex">
                                                            <button onClick={() => deleteHandler(user.ID)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
            }
        </div>
    ) 
}

export default UserList