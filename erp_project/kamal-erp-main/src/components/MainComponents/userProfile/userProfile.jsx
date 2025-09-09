import React, { useEffect, useRef, useState } from "react";
import "./userProfile.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function userProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState(user);
  const BackFromProfile = useNavigate();

  const inputRef = useRef(0);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setUserDetails((prev) => {
        return {
          ...prev,
          profilePic: preview,
        };
      });

      toast.success("Profile Picture Uploaded Successflly ");
    }
  };

  function handleDetailChange(e) {
    setUserDetails((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(userDetails);

    BackFromProfile(-1);
  }

  return (
    <div className="userProfile">
      <nav>
        <div className="profife-cointainer">
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            hidden
          />
          {userDetails.profilePic === true ? (
            <img
              className="profilePicture"
              src={userDetails.profilePic}
              alt=""
              onClick={() => {
                inputRef.current.click();
              }}
            />
          ) : (
            <svg
              className="profilePicture"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
            </svg>
          )}
          .<h2>{userDetails.name}</h2>
          <h2>{userDetails.email}</h2>
        </div>
      </nav>

      <form className="profile-info" onSubmit={handleSubmit}>
        <div className="box-layout-coinntainer">
          <p>Job role</p>
          <input
            type="text"
            id="jobRole"
            value={userDetails.jobRole}
            onChange={handleDetailChange}
          />
        </div>

        <div className="box-layout-coinntainer">
          <p>Mobile Number</p>
          <input
            type="text"
            id="mobile"
            value={userDetails.mobile}
            onChange={handleDetailChange}
          />
        </div>

        <div className="profile-submit-cointainer">
          <button type="submit" className="profile-submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
