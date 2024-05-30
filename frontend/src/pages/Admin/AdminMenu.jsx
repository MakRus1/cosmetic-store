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
                className={`${isMenuOpen ? "top-2 right-2" : "top-5 right-7"} bg-[#799400] p-2 fixed rounded-lg`} 
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
                <section className="bg-[#f6fdd5] border border-[#799400] p-4 fixed right-7 top-5">
                    <ul className="list-none mt-2">
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-[#799400] rounded-sm' to='/admin/dashboard' style={({isActive}) => ({
                                color: isActive ? '#799400' : 'black'
                            })}>
                                Инструменты
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-[#799400] rounded-sm' to='/admin/marklist' style={({isActive}) => ({
                                color: isActive ? '#799400' : 'black'
                            })}>
                                Создать производителя
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-[#799400] rounded-sm' to='/admin/carlist' style={({isActive}) => ({
                                color: isActive ? '#799400' : 'black'
                            })}>
                                Создать продукт
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-[#799400] rounded-sm' to='/admin/allcars' style={({isActive}) => ({
                                color: isActive ? '#799400' : 'black'
                            })}>
                                Все продукты
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-[#799400] rounded-sm' to='/admin/userlist' style={({isActive}) => ({
                                color: isActive ? '#799400' : 'black'
                            })}>
                                Пользователи
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className='list-item py-2 px-3 block mb-5 hover:bg-[#799400] rounded-sm' to='/admin/orderlist' style={({isActive}) => ({
                                color: isActive ? '#799400' : 'black'
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