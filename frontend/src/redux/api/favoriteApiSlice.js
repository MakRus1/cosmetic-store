import { FAVORITE_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const favoriteApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchIsFavorite: builder.query({
            query: (carId) => `${FAVORITE_URL}/${carId}`,
        }),

        fetchFavorites: builder.query({
            query: () => `${FAVORITE_URL}`,
        }),

        createFavorite: builder.mutation({
            query: (carId) => ({
                url: `${FAVORITE_URL}/${carId}`,
                method: 'POST'
            }),
        }),

        removeFavorite: builder.mutation({
            query: (carId) => ({
                url: `${FAVORITE_URL}/${carId}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const {
    useFetchIsFavoriteQuery,
    useFetchFavoritesQuery,
    useCreateFavoriteMutation,
    useRemoveFavoriteMutation,
} = favoriteApiSlice