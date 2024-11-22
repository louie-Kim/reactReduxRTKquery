import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api', // optional
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({}),
});

// export const {
//     useFetchPostsQuery,
//     useFetchPostByIdQuery,
//     useCreatePostMutation,
//     useUpdatePostMutation,
//     useDeletePostMutation,
// } = apiSlice;