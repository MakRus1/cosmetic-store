import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../../components/Loader"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import { useRegisterMutation } from "../../redux/api/usersApiSlice"

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation()
    const {userInfo} = useSelector(state => state.auth)

    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Пароли не совпадают")
            return
        } 
        try {
            const result = await register({username, email, password}).unwrap()
            if (result.error) {
                toast.error(result.error)
                return
            }
            dispatch(setCredentials({...result}))
            navigate(redirect)
            toast('Пользователь успешно зарегестрирован')
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }

    return <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
            <ht className="text-2xl font-semibold mb-4">Регистрация</ht>

            <form onSubmit={submitHandler} className="container w-[40rem]">
                <div className="my-[2rem]">
                    <label htmlFor="name" className="block text-sm font-medium">Имя пользователя</label>
                    <input 
                        type="text" 
                        id='username' 
                        className="mt-1 p-2 border rounded w-full bg-black text-white" 
                        value={username}
                        onChange={e => setUsername(e.target.value)} />
                </div>

                <div className="my-[2rem]">
                    <label htmlFor="email" className="block text-sm font-medium">Адрес электронной почты</label>
                    <input 
                        type="email" 
                        id='email' 
                        className="mt-1 p-2 border rounded w-full bg-black text-white" 
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="my-[2rem]">
                    <label htmlFor="password" className="block text-sm font-medium">Пароль</label>
                    <input 
                        type="password" 
                        id='password' 
                        className="mt-1 p-2 border rounded w-full bg-black text-white" 
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>

                <div className="my-[2rem]">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">Подтвердите пароль</label>
                    <input 
                        type="password" 
                        id='confirmPassword' 
                        className="mt-1 p-2 border rounded w-full bg-black text-white" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} />
                </div>

                <button disabled={isLoading} type="submit" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]">
                        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </button>

                {isLoading && <Loader />}
            </form>

            <div className="mt-4">
                <p>
                    Уже есть аккаунт? {" "}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-blue-500 hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    </section>
}

export default Register