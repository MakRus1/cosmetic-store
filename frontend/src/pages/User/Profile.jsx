import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { Link } from "react-router-dom"
import { useProfileMutation } from "../../redux/api/usersApiSlice"

const Profile = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const {userInfo} = useSelector(state => state.auth)

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()

    useEffect(() => {
        setUsername(userInfo.username)
        setEmail(userInfo.email)
    }, [userInfo.username, userInfo.email])

    const dispatch = useDispatch()

    const submitHandler = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Пароли не совпадают")
        } else {
            try {
                const result = await updateProfile({id: userInfo.id, username, email, password}).unwrap()
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                dispatch(setCredentials({...result}))
                toast('Данные пользователя успешно обновлены')
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        }
    }

    return (
        <div className="container mx-auto p-4 mt-[10rem]">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                <div className="md:w-1/3">
                    <h2 className="text-2xl font-semibold mb-4">Изменение профиля</h2>
                    
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block mb-2">Имя пользователя</label>
                            <input 
                                type="text" 
                                className="form-input p-4 border rounded w-full bg-black text-white"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Адрес электронной почты</label>
                            <input 
                                type="email" 
                                className="form-input p-4 border rounded w-full bg-black text-white"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Пароль</label>
                            <input 
                                type="password" 
                                className="form-input p-4 border rounded w-full bg-black text-white"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Подтвердите пароль</label>
                            <input 
                                type="password" 
                                className="form-input p-4 border rounded w-full bg-black text-white"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between">
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Обновить</button>
                            <Link to='/user-orders' className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Мои заказы</Link>
                        </div>
                    </form>
                </div>
                {loadingUpdateProfile && <Loader />}
            </div>
        </div>
    )
}

export default Profile