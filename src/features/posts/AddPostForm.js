import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../users/usersSlice"
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation()
    // const { data: users, isError } = useGetUsersQuery();
    
    

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')

    const users = useSelector(selectAllUsers)
    // console.log(users);
    // index에서 store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    // const onTitleChanged = e => setTitle(e.target.value)
    // const onContentChanged = e => setContent(e.target.value)
    // const onAuthorChanged = e => setUserId(e.target.value)

    useEffect(()=>{
        // 초기값 false -> addNewPost() 호출 true -> 다시 false
        console.log("isLoading", isLoading);
        
    }, [isLoading])


    const canSave = [title, content, userId].every(Boolean) && !isLoading;
    console.log("AddPostForm canSave",canSave);
    

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                
                await addNewPost({ title, body: content, userId }).unwrap()
                // isLoading : true
                setTitle('')
                setContent('')
                setUserId('')
                navigate('/')
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    // onChange={onTitleChanged}
                    onChange={e=>{ setTitle(e.target.value) }}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" 
                    value={userId} 
                    // onChange={onAuthorChanged}
                    onChange={e=>{ setUserId(e.target.value) }}
                    >
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    // onChange={onContentChanged}
                    onChange={e=>{ setContent(e.target.value) }}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    )
}
export default AddPostForm