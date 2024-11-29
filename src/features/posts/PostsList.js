import { useSelector } from "react-redux";
import { selectPostIds } from "./postsSlice";
import  PostsExcerpt  from './PostsExcerpt'
import { useGetPostsQuery } from './postsSlice';

const PostsList = () => {
    const {
        // data: todo
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery()

    const orderedPostIds = useSelector(selectPostIds)
    // console.log('postId',orderedPostIds);  ids[]: 번호
    

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            {content}
        </section>
    )
}
export default PostsList