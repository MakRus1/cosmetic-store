import { apiSlice } from "./apiSlice";
import { MARK_URL } from "../constants";

export const markApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createMark: builder.mutation({
            query: (newMark) => ({
                url: `${MARK_URL}`,
                method: 'POST',
                body: newMark,
            })
        }),

        updateMark: builder.mutation({
            query: ({markId, updatedMark}) => ({
                url: `${MARK_URL}/${markId}`,
                method: 'PUT',
                body: updatedMark,
            })
        }),

        deleteMark: builder.mutation({
            query: (markId) => ({
                url: `${MARK_URL}/${markId}`,
                method: 'DELETE',
            })
        }),

        fetchMarks: builder.query({
            query: () => `${MARK_URL}/marks`
        }),
    })
})

export const {
    useCreateMarkMutation,
    useUpdateMarkMutation,
    useDeleteMarkMutation,
    useFetchMarksQuery,   
} = markApiSlice