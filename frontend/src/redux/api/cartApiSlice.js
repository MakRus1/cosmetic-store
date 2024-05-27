import { CART_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchIsInCart: builder.query({
            query: (carId) => `${CART_URL}/${carId}`,
        }),

        fetchCart: builder.query({
            query: () => `${CART_URL}`,
        }),

        createCartItem: builder.mutation({
            query: ({carId, count}) => ({
                url: `${CART_URL}/${carId}`,
                method: 'POST',
                body: {count},
            }),
        }),

        removeCartItem: builder.mutation({
            query: (carId) => ({
                url: `${CART_URL}/${carId}`,
                method: 'DELETE',
            }),
        }),

        clearCart: builder.mutation({
            query: () => ({
                url: `${CART_URL}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const {
    useFetchIsInCartQuery,
    useFetchCartQuery,
    useCreateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = cartApiSlice