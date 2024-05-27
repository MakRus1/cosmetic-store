import { apiSlice } from "./apiSlice";
import { MODEL_URL } from "../constants";

export const modelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createModel: builder.mutation({
            query: (newModel) => ({
                url: `${MODEL_URL}`,
                method: 'POST',
                body: newModel,
            })
        }),

        updateModel: builder.mutation({
            query: ({modelId, updatedModel}) => ({
                url: `${MODEL_URL}/${modelId}`,
                method: 'PUT',
                body: updatedModel,
            })
        }),

        deleteModel: builder.mutation({
            query: (modelId) => ({
                url: `${MODEL_URL}/${modelId}`,
                method: 'DELETE',
            })
        }),

        fetchModels: builder.query({
            query: () => `${MODEL_URL}/models`
        }),
    })
})

export const {
    useCreateModelMutation,
    useUpdateModelMutation,
    useDeleteModelMutation,
    useFetchModelsQuery,   
} = modelApiSlice