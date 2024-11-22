import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api', // optional
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        // // Fetch all posts (GET)
        // fetchPosts: builder.query({
        //     query: () => '/posts',
        //     providesTags: ['Post'], 
        // }),

        // // Fetch a single post by ID (GET)
        // fetchPostById: builder.query({
        //     query: (id) => `/posts/${id}`,
        //     // 특정 ID에 태그 제공
        //     providesTags: (result, error, id) => [{ type: 'Post', id }], 
        // }),

        // // Create a new post (POST)
        // createPost: builder.mutation({
        //     query: (newPost) => ({
        //         url: '/posts',
        //         method: 'POST',
        //         body: newPost,
        //     }),
        //     invalidatesTags: ['Post'],
        // }),

        // // Update an existing post by ID (PUT)
        // updatePost: builder.mutation({
        //     query: ({ id, ...updatedPost }) => ({
        //         url: `/posts/${id}`,
        //         method: 'PATCH',
        //         body: updatedPost,
        //     }),
        //     // 특정 ID 태그 무효화
        //     // (fetchPostById)를 다시 실행하도록 트리거 -> 리패칭
        //     invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
        // }),

        // // Delete a post by ID (DELETE)
        // deletePost: builder.mutation({
        //     query: (id) => ({
        //         url: `/posts/${id}`,
        //         method: 'DELETE',
        //     }),
        //      // 특정 ID에 태그 무효화
        //     // (fetchPostById)를 다시 실행하도록 트리거 -> 리패칭
        //     invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
        // }),
    }),
});

// export const {
//     useFetchPostsQuery,
//     useFetchPostByIdQuery,
//     useCreatePostMutation,
//     useUpdatePostMutation,
//     useDeletePostMutation,
// } = apiSlice;
