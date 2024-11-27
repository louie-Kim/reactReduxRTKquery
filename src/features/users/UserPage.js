import { useSelector } from 'react-redux'
import { selectUserById } from './usersSlice'
import { Link, useParams } from 'react-router-dom'
import { useGetPostsByUserIdQuery } from '../posts/postsSlice'

const UserPage = () => {
    const { userId } = useParams()
    console.log(userId);
    
    const user = useSelector(state => selectUserById(state, Number(userId)))

    const {
        // 패칭된 데이터
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId);

    
    

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        // 정규화된 데이터 가져오기
        // {entities[id]} : 유저의 특정 게시물
        console.log("???????????????",postsForUser); 
        const { ids, entities } = postsForUser
        content = ids.map(id => (
            <li key={id}>
                <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
        ))
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{content}</ol>
        </section>
    )
}

export default UserPage