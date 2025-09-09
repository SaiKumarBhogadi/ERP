import React, { useEffect, useRef, useState } from "react";
import "./bugDetailPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function bugDetailPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { errorId } = useParams();
  const [apiResponse, setApiResponse] = useState(null);
  const [errorImg, setErrorImg] = useState([]);
  const [errorDes, setErrorDesc] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [writeReply, setWriteReply] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState("");
  const [replyCommentUser, setReplyCommentUser] = useState("");
  const [replyCommnetText, setReplyCommentText] = useState("");
  const replyRef = useRef(0);

  useEffect(() => {
    setApiResponse(dataFromApi);
  }, []);

  useEffect(() => {
    if (apiResponse) {
      setErrorDesc(apiResponse.errorData.errorDescription);
      setErrorImg(apiResponse.errorData.errorImages);
      setComments(apiResponse.commentSectionData.comments);
    }
  }, [apiResponse]);

  const dataFromApi = {
    errorData: {
      projectTitle: "ERP-Client Management",
      errorId: "12345",
      errorTitle: "Database connection timeout",
      errorDescription:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident perspiciatis commodi ea veritatis repellat dolorem eaque voluptatum tempora incidunt omnis doloremque, repudiandae fugit quo illum ratione. Quae, nisi numquam dolore eligendi optio est, aliquam quas soluta suscipit tempore praesentium unde impedit repellendus, magnam officia esse perspiciatis minima. Harum facere libero distinctio ea, consequatur eum aliquam corrupti illum, numquam culpa modi. Ex hic tempora modi animi perspiciatis, amet distinctio cupiditate vitae cum ipsum numquam sapiente ipsa rem blanditiis delectus rerum odio, atque nostrum laborum consectetur accusantium nihil aspernatur quam culpa. Veniam cupiditate excepturi necessitatibus voluptatem nihil totam officia, nemo, deserunt unde quaerat inventore, natus enim dolore quae velit quo ipsum perferendis quidem. Cupiditate et adipisci architecto unde, nam ipsa aperiam fugit incidunt laborum accusamus, asperiores, quod ipsum! Voluptate numquam atque quia adipisci, excepturi aspernatur cum suscipit culpa? Eum, esse praesentium. Autem ullam earum fuga eligendi quidem minus vero cum facere expedita?",
      errorImages: [
        "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
      ],
    },

    commentSectionData: {
      comments: [
        {
          commentId: "cmt1",
          user: {
            userId: "dev123",
            name: "John Doe",
            role: "Developer",
            avatar:
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
          },
          message:
            "I have checked the logs, and it seems like the DB server is overloaded.",
          timestamp: "2024-03-12T10:15:00Z",
          replies: [
            {
              replyId: "rpl1",
              user: {
                userId: "usr456",
                name: "Alice Smith",
                role: "Reporter",
                avatar:
                  "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
              },
              message: "Is there a workaround for now?",
              timestamp: "2024-03-12T10:20:00Z",
            },
          ],
        },
        {
          commentId: "cmt2",
          user: {
            userId: "dev789",
            name: "Mike Johnson",
            role: "Developer",
            avatar:
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
          },
          message:
            "We might need to increase the connection pool size. I'll push an update soon.",
          timestamp: "2024-03-12T11:00:00Z",
          replies: [],
        },
      ],
    },
  };

  function handleSendComment() {
    if (commentText === "") {
      return;
    }

    setComments((prev) => {
      prev.push({
        commentId: crypto.randomUUID(),
        user: {
          userId: user.id,
          name: user.name,
          role: user.jobRole,
          avatar: user.profilePic,
        },
        message: commentText,
        timestamp: new Date().toISOString(),
        replies: [],
      });

      return prev;
    });

    setCommentText("");
  }
  function handleReplyComment() {
    const index = comments.findIndex((ele) => {
      return ele.commentId === replyCommentId;
    });
    if (replyCommnetText === "") {
      return;
    }
    setComments((prev) => {
      prev[index].replies.push({
        replyId: crypto.randomUUID(),
        user: {
          userId: user.id,
          name: user.name,
          role: user.jobRole,
          avatar: user.profilePic,
        },
        message: replyCommnetText,
        timestamp: new Date().toISOString(),
      });

      return prev;
    });

    setReplyCommentText("");
    setReplyCommentId("");
    setReplyCommentUser("");
    setWriteReply("");
  }

  function handleDeleteComment(cmtId) {
    setComments((prev) => {
      const temp = prev.filter((ele) => {
        return ele.commentId !== cmtId;
      });
      return temp;
    });
  }

  function handleDeleteReplyComment(cmtId, reId) {
    setComments((prev) => {
      return prev.map((comment) => {
        if (comment.commentId === cmtId) {
          return {
            ...comment,
            replies: comment.replies.filter((rep) => rep.replyId !== reId),
          };
        }
        return comment;
      });
    });
  }

  return (
    <div className="bugDetailPage">
      <div className="titleCont">
        <h2>{apiResponse && apiResponse.errorData.projectTitle}</h2>
        <button onClick={() => navigate(-1)}>Goback</button>
      </div>
      <div className="bugdetail-cointainer">
        <div className="bugDetail-left">
          <h3>{apiResponse && apiResponse.errorData.errorTitle}</h3>
          <nav className="error-img-cointainer">
            {errorImg.map((ele, ind) => (
              <img className="error-img" src={ele} key={ind} />
            ))}
          </nav>
          <div className="error-description">{errorDes}</div>
        </div>
        <div className="bugDetail-right">
          <div className="error-state">
            <label>Select Status: </label>
            <select name="bug-status" id="bug-status" required>
              <option value="">Select Status</option>
              <option value="in-progress">In-Progress</option>
              <option value="not-a-bug">Not a Bug</option>
              <option value="qa">QA</option>
            </select>
          </div>
          <nav className="chat-cointainer">
            <div className="chat-box">
              <h3 className="error-title">
                {apiResponse && apiResponse.errorData.errorTitle}
              </h3>

              <div className="comments-container">
                {comments.map((comment) => (
                  <div key={comment.commentId} className="comment">
                    <div className="comment-header">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="avatar"
                      />
                      <span className="user-name">
                        {comment.user.name} ({comment.user.role})
                      </span>
                    </div>
                    <p className="comment-message">{comment.message}</p>
                    <div className="comment-time">
                      {new Date(comment.timestamp).toLocaleString()}
                      <span
                        onClick={async () => {
                          await setWriteReply(true);
                          await setReplyCommentId(comment.commentId);
                          await setReplyCommentUser(comment.user.name);
                          replyRef.current.focus();
                        }}
                      >
                        reply
                      </span>
                      {comment.user.userId === user.id && (
                        <span
                          className="delete"
                          onClick={() => {
                            handleDeleteComment(comment.commentId);
                          }}
                        >
                          delete
                        </span>
                      )}
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="replies">
                        {comment.replies.map((reply) => (
                          <div key={reply.replyId} className="reply">
                            <div className="reply-header">
                              <img
                                src={reply.user.avatar}
                                alt={reply.user.name}
                                className="avatar"
                              />
                              <span className="user-name">
                                {reply.user.name} ({reply.user.role})
                              </span>
                            </div>
                            <p className="reply-message">{reply.message}</p>
                            <span className="reply-time">
                              {new Date(reply.timestamp).toLocaleString()}
                              {reply.user.userId === user.id && (
                                <span
                                  className="delete"
                                  onClick={() => {
                                    handleDeleteReplyComment(
                                      comment.commentId,
                                      reply.replyId
                                    );
                                  }}
                                >
                                  delete
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="input-chat-container">
                {writeReply && (
                  <div className="reply-indicator">
                    <p>
                      Replying to <span>{replyCommentUser}</span>
                    </p>
                    <svg
                      onClick={() => {
                        setWriteReply(false);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#5f6368"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </div>
                )}

                {writeReply ? (
                  <input
                    className="chat-input"
                    type="text"
                    placeholder="Write reply comment..."
                    value={replyCommnetText}
                    onChange={(e) => setReplyCommentText(e.target.value)}
                    required
                    ref={replyRef}
                  />
                ) : (
                  <input
                    className="chat-input"
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                )}

                <svg
                  className="send-logo"
                  onClick={writeReply ? handleReplyComment : handleSendComment}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                </svg>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
