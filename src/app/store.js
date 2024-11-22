import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from '../features/api/apiSlice';

export const store = configureStore({
    reducer: {
        // apiSlice.reducer : API 호출의 상태(로딩 중, 성공, 실패) 및 캐싱 데이터를 관리
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    // for RTK query
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware), // 커스터마이징
    devTools: true
})

// getDefaultMiddleware() ->   
// serializableCheck(직렬화 검사 ),  immutableStateInvariant(불변성검사), redux-thunk 를 반환

// store 구조

// {
//     "api": {
//       "queries": {
//         "getPosts(undefined)": {
//           "status": "fulfilled", // 현재 상태: "pending", "fulfilled", "rejected" 등
//           "data": {
//             "ids": ["1", "2", "3"], // API에서 받은 데이터의 ID 배열
//             "entities": { // 각 ID에 해당하는 데이터
//               "1": {
//                 "id": "1",
//                 "title": "Post 1",
//                 "content": "Content of post 1",
//                 "date": "2024-11-22T10:00:00.000Z",
//                 "reactions": {
//                   "thumbsUp": 2,
//                   "wow": 0,
//                   "heart": 1,
//                   "rocket": 0,
//                   "coffee": 0
//                 }
//               },
//               "2": {
//                 "id": "2",
//                 "title": "Post 2",
//                 "content": "Content of post 2",
//                 "date": "2024-11-22T10:01:00.000Z",
//                 "reactions": {
//                   "thumbsUp": 0,
//                   "wow": 3,
//                   "heart": 0,
//                   "rocket": 2,
//                   "coffee": 1
//                 }
//               }
//             }
//           }
//         },
//         "getPostsByUserId({id: 1})": {
//           "status": "fulfilled",
//           "data": {
//             "ids": ["2"], // 특정 유저에 해당하는 게시물의 ID
//             "entities": {
//               "2": {
//                 "id": "2",
//                 "title": "Post 2",
//                 "content": "Content of post 2",
//                 "date": "2024-11-22T10:01:00.000Z",
//                 "reactions": {
//                   "thumbsUp": 0,
//                   "wow": 3,
//                   "heart": 0,
//                   "rocket": 2,
//                   "coffee": 1
//                 }
//               }
//             }
//           }
//         }
//       },
//       "mutations": {
//         "addNewPost": {
//           "status": "pending" // 새로운 게시물 추가 상태
//         },
//         "updatePost": {
//           "status": "fulfilled" // 게시물 업데이트 성공
//         },
//         "deletePost": {
//           "status": "rejected", // 게시물 삭제 실패
//           "error": "Network error"
//         }
//       },
//       태그관련 
//       "provided": {
//         "Post": {
//           "LIST": {
//             "data": [
//               "1",
//               "2",
//               "3"
//             ] // 전체 게시물 ID 목록 캐싱
//           },
//           "1": {
//             "data": {
//               "id": "1",
//               "title": "Post 1"
//             }
//           },
//           "2": {
//             "data": {
//               "id": "2",
//               "title": "Post 2"
//             }
//           }
//         }
//       }
//     }
//   }
  


