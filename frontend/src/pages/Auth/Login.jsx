import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../../redux/api/usersApiSlice"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, {isLoading}] = useLoginMutation()

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

        try {
            const res = await login({email, password}).unwrap()
            if (res.error) {
                toast.error(res.error)
                return
            }
            dispatch(setCredentials({...res}))
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }

    return <div>
        <section className="pl-[10rem] flex flex-wrap">
            <div className="mr-[4rem] mt-[5rem] bg-[#f6fdd5] border border-[#799400] p-5 text-black">
                <h1 className="text-2xl font-semibold mb-4">Авторизация</h1>

                <form onSubmit={submitHandler} className="container w-[40rem]">
                    <div className="my-[2rem]">
                        <label htmlFor="email" className="block text-sm font-medium">Адрес электронной почты</label>

                        <input 
                            type="email" 
                            id="email" 
                            className="mt-1 p-2 border rounded w-full bg-[#f6fdd5]" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="my-[2rem]">
                        <label htmlFor="password" className="block text-sm font-medium">Пароль</label>

                        <input 
                            type="password" 
                            id="password" 
                            className="mt-1 p-2 border rounded w-full bg-[#f6fdd5]" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button disabled={isLoading} type="submit" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]">
                        {isLoading ? "Вход..." : "Войти"}
                    </button>

                    {isLoading && <Loader />}
                </form>

                <div className="mt-4">
                    <p>
                        Нет аккаунта? {" "}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-blue-500 hover:underline">
                            Зарегестрироваться
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    </div>
}

export default Login