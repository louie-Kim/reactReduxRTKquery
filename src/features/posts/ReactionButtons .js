import { useAddReactionMutation } from './postsSlice'

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}

const ReactionButtons = ({ post }) => {

    // console.log("ReactionButtons post",post);
    console.log("ReactionButtons post",post.reactions);
    

    const [addReaction] = useAddReactionMutation()

    // Object.entries(reactionEmoji) : 객체를 배열로 변환
    // console.log(Object.entries(reactionEmoji));
    /**
     * [
        *   [  key  ,  value],
            ['thumbsUp', '👍'],
            ['wow', '😮'],
            ['heart', '❤️'],
            ['rocket', '🚀'],
            ['coffee', '☕']
        ]

     */

        
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        // console.log(name); 
        // console.log(post.reactions[name]);  숫자
        // post.reactions[name] -> 해당객체의 값 : +1
        // 기존의 reactions 객체를 유지하면서 특정 부분( [name] )만 newValue으로 오버라이딩
        return (
            <button
                key={name}
                type="button"
                className="reactionButton"
                onClick={() => {
                    const newValue = post.reactions[name] + 1;
                    console.log(name, newValue);
                    addReaction({ postId: post.id, reactions: { ...post.reactions, [name]: newValue } })
                }}
            >
                {emoji} {post.reactions[name]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}
export default ReactionButtons