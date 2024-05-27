import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <button 
                className={`${isMenuOpen ? "top-2 right-2" : "top-5 right-7"} bg-black p-2 fixed rounded-lg`} 
                onClick={toggleMenu}
            >
                {isMenuOpen ? (
                    <FaTimes color='white' />
                ) : (
                    <>
                        <div className="w-6 h-0.5 bg-white my-1"></div>
                        <div className="w-6 h-0.5 bg-white my-1"></div>
                        <div className="w-6 h-0.5 bg-white my-1"></div>
                    </>
                )}
            </button>

            {isMenuOpen && (
                <section className="bg-black p-4 fixed right-7 top-5">
                    <ul className="list-none mt-2">
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/dashboard' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Инструменты
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/marklist' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Создать марку
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/modellist' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Создать модель
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/carlist' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Создать автомобиль
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/allcars' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Все автомобили
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/userlist' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Пользователи
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-gray-800 rounded-sm' to='/admin/orderlist' style={({isActive}) => ({
                                color: isActive ? 'red' : 'white'
                            })}>
                                Заказы
                            </NavLink>
                        </li>
                    </ul>
                </section>
            )}
        </>
    )
}

export default AdminMenu