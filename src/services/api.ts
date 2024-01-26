import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  tagTypes: ['products', 'comments'],
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://iim.etherial.fr/' }),
  endpoints: (builder) => ({
    getProducts: builder.query<Record<string, unknown>, void>({
      query: () => 'products',
      providesTags: ['products'],
    }),
    getComments: builder.query<Record<string, unknown>, { id: string }>({
      query: (data) => `/products/${data.id}/comments`,
      providesTags: ['comments'],
    }),
    createComment: builder.mutation({
      query: (data: { id: string, username: string, comment: string }) => ({
        url: `/products/${data.id}/comments`,
        method: 'POST',
        body: {
          username: data.username,
          comment: data.comment,
        },
      }),
      invalidatesTags: ['comments'],
    }),
  }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery, useGetCommentsQuery, useCreateCommentMutation } = productApi
