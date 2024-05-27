import { apiSlice } from './apiSlice'
import { ORDERS_URL } from '../constants'

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: order
            })
        }),

        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            })
        }),

        setShippingAddress: builder.mutation({
            query: ({orderId, address}) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: 'PUT',
                body: address
            })
        }),

        payOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
            })
        }),

        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5
        }),

        getOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/`,
            }),
        }),

        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            })
        }),

        getTotalOrders: builder.query({
            query: () => `${ORDERS_URL}/total-orders`
        }),

        getTotalSales: builder.query({
            query: () => `${ORDERS_URL}/total-sales`
        }),

        getTotalSalesByMark: builder.query({
            query: (markId) => `${ORDERS_URL}/total-sales/${markId}`
        }),

        getTotalSalesByDate: builder.query({
            query: () => `${ORDERS_URL}/total-sales-by-date`
        }),

        getCheque: builder.query({
            query: (orderId) => `${ORDERS_URL}/${orderId}/cheque`
        }),
    })
})

export const {
    useGetTotalOrdersQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByMarkQuery,
    useGetTotalSalesByDateQuery,

    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useDeliverOrderMutation,
    useGetOrdersQuery,
    useSetShippingAddressMutation,
    useGetChequeQuery
} = orderApiSlice