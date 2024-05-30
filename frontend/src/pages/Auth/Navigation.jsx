import { useState } from "react"
import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaHeart } from 'react-icons/fa'
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import './Navigation.css'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../redux/api/usersApiSlice'
import { logout } from '../../redux/features/auth/authSlice'
import FavoritesCount from "../Cars/FavoritesCount"
import CartCount from "../Cars/CartCount"

const Navigation = () => {
    const {userInfo} = useSelector(state => state.auth)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const closeSidebar = () => {
        setShowSidebar(false)
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div 
            style={{zIndex: 999}} 
            className={`${showSidebar ? 'hidden' : 'flex'} xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-black bg-[#f6fdd5] border border-[#799400] w-[4%] hover:w-[15%] h-[100vh] fixed`}
            id='navigation-container'
        >
            <div className="flex flex-col justify-center space-y-4">
                <Link to='/' className="flex items-center transition-transform transform hover:translate-x-2">
                    <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">Главная</span>{ " " }
                </Link>
                <Link to='/shop' className="flex items-center transition-transform transform hover:translate-x-2">
                    <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">Магазин</span>{ " " }
                </Link>
                <Link to='/cart' className="flex items-center transition-transform transform hover:translate-x-2">
                    <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">Корзина</span>{ " " }
                    <CartCount />
                </Link>
                <Link to='/favorite' className="flex items-center transition-transform transform hover:translate-x-2">
                    <FaHeart className="mr-2 mt-[3rem]" size={26} />
                    <span className="hidden nav-item-name mt-[3rem]">Понравившиеся</span>{ " " }
                    <FavoritesCount />
                </Link>
            </div>

            <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center text-black focus:outline-none">
                    {userInfo ? (<span className="hidden nav-item-name text-black">{userInfo.username}</span>) : (<></>)}
                    {userInfo && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1 ${
                                dropdownOpen ? 'transform-rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="black"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                            />
                        </svg>
                    )}
                </button>

                {dropdownOpen && userInfo && (
                    <ul className={`absolute right-0 space-y-1 bg-[#799400] text-white ${!userInfo.isAdmin ? "-top-20" : "-top-80"}`}>
                        {Boolean(userInfo.isAdmin) && (
                            <>
                                <li>
                                    <Link to='/admin/dashboard' onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600">Инструменты</Link>
                                </li>
                                <li>
                                    <Link to='/admin/carlist' onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600">Продукты</Link>
                                </li>
                                <li>
                                    <Link to='/admin/marklist' onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600">Бренды</Link>
                                </li>
                                <li>
                                    <Link to='/admin/orderlist' onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600">Заказы</Link>
                                </li>
                                <li>
                                    <Link to='/admin/userlist' onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600">Пользователи</Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Link to='/profile' onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600">Профиль</Link>
                        </li>
                        <li>
                            <Link className="block px-4 py-2 hover:bg-gray-600" onClick={() => {setDropdownOpen(false); logoutHandler()}}>Выход</Link>
                        </li>
                    </ul>
                )}

            </div>
            {!userInfo && (
                <ul>
                    <li>
                        <Link to='/login' className="flex items-center transition-transform transform hover:translate-x-2">
                            <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
                            <span className="hidden nav-item-name mt-[3rem]">Войти</span>{ " " }
                        </Link>
                    </li>
                    <li>
                        <Link to='/register' className="flex items-center transition-transform transform hover:translate-x-2">
                            <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
                            <span className="hidden nav-item-name mt-[3rem]">Зарегестрироваться</span>{ " " }
                        </Link>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default Navigation