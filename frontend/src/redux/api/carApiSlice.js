import { CAR_URL, UPLOAD_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const carApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCars: builder.query({
            query: ({keyword}) => ({
                url: `${CAR_URL}`,
                params: {keyword}
            }),

            keepUnusedDataFor: 5,
            providesTags: ["Car"]
        }),

        getCarById: builder.query({
            query: (carId) => `${CAR_URL}/${carId}`,
            providesTags: (result, error, carId) => [
                {type: "Car", id: carId}
            ]
        }),

        allCars: builder.query({
            query: () => `${CAR_URL}/allcars`,
        }),

        getLastCars: builder.query({
            query: () => `${CAR_URL}/lastcars`,
        }),

        createCar: builder.mutation({
            query: (carData) => ({
                url: `${CAR_URL}`,
                method: 'POST',
                body: carData
            }),
            invalidatesTags: ["Car"]
        }),

        updateCar: builder.mutation({
            query: ({carId, formData}) => ({
                url: `${CAR_URL}/${carId}`,
                method: 'PUT',
                body: formData
            }),
        }),

        uploadCarImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}/`,
                method: 'POST',
                body: data
            }),
        }),

        deleteCar: builder.mutation({
            query: (carId) => ({
                url: `${CAR_URL}/${carId}`,
                method: 'DELETE',
            }),
            providesTags: ['Car']
        }),

        getFilteredCars: builder.query({
            query: ({checked, radio}) => ({
                url: `${CAR_URL}/filtered-cars`,
                method: 'POST',
                body: {checked, radio}
            }),
        }),
    })
})

export const {
    useGetCarByIdQuery,
    useGetCarsQuery,
    useAllCarsQuery,
    useGetLastCarsQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useDeleteCarMutation,
    useUploadCarImageMutation,
    useGetFilteredCarsQuery,
} = carApiSlice