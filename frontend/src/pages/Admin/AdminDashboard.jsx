import Chart from 'react-apexcharts'
import { useGetUsersQuery } from '../../redux/api/usersApiSlice'
import { useGetTotalOrdersQuery, useGetTotalSalesByDateQuery, useGetTotalSalesQuery } from '../../redux/api/orderApiSlice'

import { useState, useEffect } from 'react'
import AdminMenu from './AdminMenu'
import OrderList from './OrderList'
import Loader from '../../components/Loader'

const AdminDashboard = () => {
    const {data: sales, isLoading} = useGetTotalSalesQuery()
    const {data: customers, isLoading: loading} = useGetUsersQuery()
    const {data: orders, isLoading: loadingOrders} = useGetTotalOrdersQuery()
    const {data: salesDetail} = useGetTotalSalesByDateQuery()

    const [state, setState] = useState({
        options: {
            chart: {
                type: 'line',
            },
            tooltip: {
                theme: 'dark',
            },
            colors: ['#799400'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Статистика заказов',
                align: 'left'
            },
            grid: {
                borderColor: "#ccc"
            },
            markers: {
                size: 1,
            },
            xaxis: {
                categories: [],
                title: {
                    text: 'Дата'
                },
            },
            yaxis: {
                title: {
                    text: 'Продажи'
                },
                min: 0
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
        },
        series: [
            {name: 'Продажи', data: []}
        ]
    })

    useEffect(() => {
        if (salesDetail) {
            
            const  formatedSalesDate = salesDetail.map((item) => ({
                x: item.TIME_PAID,
                y: item.TOTAL
            }))

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formatedSalesDate.map((item) => item.x)
                    }
                },

                series: [
                    {name: 'Продажи', data: formatedSalesDate.map((item) => item.y)}
                ]
            }))

            console.log(state.options)
        }
    }, [salesDetail])

    return (
        <>
            <AdminMenu />
            <section className='xl:ml-[4rem] md:ml-[0rem] bg-[#f6fdd5]'>
                <div className='w-[80%] flex justify-around flex-wrap'>
                    <div className="rounded-lg bg-[#f6fdd5] border border-[#799400] text-black p-5 w-[20rem] mt-5">
                        <div className="font-bold rounded-full w-[3rem] bg-[#799400] text-center p-3">
                            ₽
                        </div>

                        <p className="mt-5">Продажи</p>
                        <h1 className="text-xl font-bold">
                            {isLoading ? <Loader /> : sales?.total} ₽
                        </h1>
                    </div>

                    <div className="rounded-lg bg-[#f6fdd5] border border-[#799400] text-black p-5 w-[20rem] mt-5">
                        <div className="font-bold rounded-full w-[3rem] bg-[#799400] text-center p-3">
                            🙉
                        </div>

                        <p className="mt-5">Пользователи</p>
                        <h1 className="text-xl font-bold">
                            {isLoading ? <Loader /> : customers?.length}
                        </h1>
                    </div>

                    <div className="rounded-lg bg-[#f6fdd5] border border-[#799400] text-black p-5 w-[20rem] mt-5">
                        <div className="font-bold rounded-full w-[3rem] bg-[#799400] text-center p-3">
                            🛒
                        </div>

                        <p className="mt-5">Заказы</p>
                        <h1 className="text-xl font-bold">
                            {isLoading ? <Loader /> : orders?.count}
                        </h1>
                    </div>
                </div>

                <div className='ml-[10rem] mt-[4rem]'>
                    <Chart options={state.options} series={state.series} type="bar" width='70%' />
                </div>
            </section>
        </>
    )
}

export default AdminDashboard