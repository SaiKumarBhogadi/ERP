import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

export default function createNewSalesComment() {
  const { user } = useSelector((state) => state.auth);
  const [apiComment, setApiComment] = useState({});
  const [commentData, setCommentData] = useState([]);
  const [newComment, setNewComment] = useState("");

  // console.log(user);

  const commentFromApi = {
    comment_data: [
      {
        person_name: "Mandy",
        comment: "Discussed discount approval with manager.",
        timestamp: "May 2, 2025, 09:45 AM",
      },
      {
        person_name: "Director",
        comment: "Discussed discount approval with manager.",
        timestamp: "May 3, 2025, 11:45 AM",
      },
      {
        person_name: "Rose",
        comment: "Customer asked for delivery date confirmation.",
        timestamp: "May 5, 2025, 12:45 AM",
      },
    ],
  };

  useEffect(() => {
    setApiComment(commentFromApi);
  }, []);

  useEffect(() => {
    if (Object.keys(apiComment).length > 0) {
      setCommentData(apiComment.comment_data);
    }
  }, [apiComment]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment === "") return;

    const newEntry = {
      person_name: user.name,
      comment: newComment,
    };

    setCommentData((prev) => [newEntry, ...prev]);

    setNewComment("");
  };

  return (
    <div className="createNewSales-comment-container">
      <p>Add Comment:</p>
      <form>
        <input
          id="createNewSalesComment"
          type="text"
          placeholder="Enter your comment...."
          value={newComment}
          onChange={handleCommentChange}
        />
        <button onClick={handleAddComment} type="submit">
          + Add
        </button>
      </form>

      <div className="createNewSales-comment-brline"></div>

      <div className="createNewSales-showarea">
        {commentData.length > 0 &&
          commentData.map((ele, ind) => (
            <div key={[-ind]} className="createNewSales-message-container">
              <svg
                className="createNewSales-comment-profile-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect width="24" height="24" rx="12" fill="#E0E4E7" />
                <path
                  d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="createNewSales-message-box">
                <p>
                  {ele.person_name} - {ele.timestamp}
                </p>
                <nav>{ele.comment}</nav>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
