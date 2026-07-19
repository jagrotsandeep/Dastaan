import { useState } from 'react'
import Avatar from './Avatar'

function CommentItem({ comment, onReply, depth = 0 }) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyText, setReplyText] = useState('')

  const submitReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(comment._id, replyText)
    setReplyText('')
    setShowReplyBox(false)
  }

  return (
    <div className={depth > 0 ? 'ml-4 sm:ml-10 mt-3 border-l pl-4 border-[#4e312a]/13' : ''}>
      <div className="rounded-2xl border p-4 border-[#4e312a]/13">
        <div className="flex items-center gap-2">
          <Avatar src={comment.author?.avatar} alt={comment.author?.username} className="h-8 w-8 rounded-full object-cover" />
          <strong className="text-[#211b1a] dark:text-[#f8eee8]">{comment.author?.username}</strong>
        </div>
        <p className="mt-2 text-[#706766]">{comment.text}</p>
        <button onClick={() => setShowReplyBox(!showReplyBox)} className="mt-2 text-sm font-bold text-[#c94531]">
          Reply
        </button>

        {showReplyBox && (
          <form onSubmit={submitReply} className="mt-3 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply likho..."
              className="flex-1 rounded-xl border p-2 text-sm bg-transparent border-[#4e312a]/13"
            />
            <button type="submit" className="rounded-xl bg-[#c94531] px-4 text-sm font-bold text-white">Post</button>
          </form>
        )}
      </div>

      {(comment.children || []).map((child) => (
        <CommentItem key={child._id} comment={child} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  )
}

export default CommentItem