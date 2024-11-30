import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date) // 내림차순
})
// selectAll 또는 selectIds와 같은 배열 기반 메서드에서만 sortComparer가 영향

const initialState = postsAdapter.getInitialState()
// console.log(initialState); // ids[], entities{}


// extend apiSlice
export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            
            query: () => '/posts',
            transformResponse: responseData => {
                console.log("Fetching data from /posts...");
                // date, reactions 속성 추가
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    // console.log("getPosts post", post);
                    return post;
                });
                // set normalized data  : [ ids , entities ] -> result
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                // 전체 Post 목록에 대한 태그를 제공 : addNewPost 에서 무효화시킴
                { type: 'Post', id: "LIST" },   
                // if any one of those ids are invalidated -> refetch!
                // 개별 Post 태그 제공
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        // getPosts의 쿼리를 덮어쓰기 하지 않고 쿼리 데이터를 따로 만듬
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,  // newwork탭에  http://localhost:5000/posts/?userId=2  
           
            transformResponse: responseData => {
                console.log("Fetching data from /posts/?userId=${id}");
                
                // console.log("API responseData:", responseData); // API 응답 확인
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    // console.log("API responseData posts:", post); // API 응답 확인
                    return post;
                });
                console.log("Normalized posts data:", postsAdapter.setAll(initialState, loadedPosts));

                return postsAdapter.setAll(initialState, loadedPosts) // -> result
            },
            // responseData 가공 처리 -> result
            providesTags: (result, error, arg) => [
                // console.log('getPostsByUserId result', result),
              
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId), // userId 오버라이딩, 숫자로 만들려고
                    date: new Date().toISOString(),     //현재 날짜와 시간을 ISO 8601 형식으로 반환
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: [
                //  getPosts 무효화 -> getPosts 쿼리가 리패치
                //  getPostsByUserId 무효화 안됨
                { type: 'Post', id: "LIST" } 
            ]
        }),
        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            // arg = initialPost
            // invalidatesTags: (result, error, arg) => [
            //     { type: 'Post', id: arg.id }
            // ],

            // getPosts 에서 리패칭
            invalidatesTags: (result, error, arg) => {
                console.log('updatePost arg', arg); 
                return [{ type: 'Post', id: arg.id }]; // to getPosts -> ...result.ids.map(id => ({ type: 'Post', id })) 리패칭 
            }
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            // invalidatesTags: (result, error, arg) => [
            //     { type: 'Post', id: arg.id }
            // ]

            // getPosts 에서 리패칭
            invalidatesTags: (result, error, arg) => {
                console.log('deletePost arg', arg); 
                return [{ type: 'Post', id: arg.id }]; // to getPosts -> ...result.ids.map(id => ({ type: 'Post', id })) 리패칭 
            }
        }),

        
        addReaction: builder.mutation({
            // postId = post.id from reactionButtons component
            // query: ({ postId, reactions }) => ({
            //     url: `posts/${postId}`,
            //     method: 'PATCH',
            //     // In a real app, we'd probably need to base this on user ID somehow
            //     // so that a user can't do the same reaction more than once
            //     body: { reactions }
            // }),
            query: ({ postId, reactions }) => {
                // Logging postId and reactions
                console.log('Logging postId in query:', postId);
                console.log('Logging reactions in query:', reactions);
            
                return {
                    url: `posts/${postId}`,
                    method: 'PATCH',
                    // In a real app, we'd probably need to base this on user ID somehow
                    // so that a user can't do the same reaction more than once
                    body: { reactions }
                };
            },
            

            // Optimistic Update
            // { postId, reactions } : 요청데이터
            // queryFulfilled :  서버 요청의 성공 또는 실패를 처리하는 Promise
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                // undefined: 업데이트 범위: 전체 게시물 목록
                // { userId: 1 } : 특정게시물 reactions 업데이트 
            
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // draft는 createEntityAdapter가 생성한 엔티티 상태 형식
                        // (ids, entities)을 따릅니다.
                        
                        const post = draft.entities[postId]  // object look up
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo() // 서버 실패시 복원
                }
            }
        })
    })
})

// RTK query hooks
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice



// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

// Creates memoized selector
const selectPostsData = createSelector(
    // iuput fucntion
    selectPostsResult,
    // output function
    // return { ids: [1, 2], entities: { 1: { ... }, 2: { ... }... } }
    postsResult => postsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,   //  모든 Post 객체 배열을 반환, 내림차순 정렬 반영됨
    selectById: selectPostById,  //  특정 ID에 해당하는 Post 객체를 반환
    selectIds: selectPostIds     //  Post의 ID(key) 배열을 반환
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)


// selectAllPosts
// [
//     { id: 1, title: 'First Post', ... },
//     { id: 2, title: 'Second Post', ... }
// ]

// selectById(state, 1)
// { id: 1, title: 'First Post', ... }

// selectIds(state)
// [1, 2]

