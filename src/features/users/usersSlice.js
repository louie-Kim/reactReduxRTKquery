import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            
            // query: () => '/users',
            query: () => {
                console.log("Fetching data from /users...");
                return '/users';
            },
            transformResponse: responseData => {
                 // set normalized data  : [ ids , entities ] -> result
                return usersAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => [
                // id: "SUCK" : User  전체 데이터를 대표하거나 그룹화(grouping)하는 역할
                // 이 태그는 데이터 변경 시 한꺼번에 해당 태그와 연결된 모든 데이터를 무효화 
                // 새로고침하는 데 사용
                //   {
                //   "provided": {
                //     "User": {
                //       "SUCK": { /* 모든 사용자 데이터를 대표 */ },
                //       "1": { /* 사용자 ID 1의 데이터 */ },
                //       "2": { /* 사용자 ID 2의 데이터 */ },
                //       "3": { /* 사용자 ID 3의 데이터 */ }
                //     }
                //   }
                // }
                 
                { type: 'User', id: "SUCK" }, // 전체 데이터 리패칭
                ...result.ids.map(id => ({ type: 'User', id })) // 개별 데이터 리패칭
            ]
        })
    })
})

export const {
    useGetUsersQuery
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()


// Creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the posts slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)