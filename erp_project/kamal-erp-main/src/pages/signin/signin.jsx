import React, { useState } from "react";
import "./signin.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { toast } from "react-toastify";
import siteLogo from "../../assets/signin/sitelogo.png";
import axios from "axios";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userMail, setUserMail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusname, setfocusname] = useState(false);
  const [focuspassword, setfocuspassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/login/";

  async function handleSignIn(e) {
    e.preventDefault();

    if (!userMail || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          email: userMail,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.token) {
        const userData = {
          user: {
            id: response.data.user?.id || Date.now(),
            name: response.data.user?.name || "User",
            email: response.data.user?.email || userMail,
            profilePic:
              response.data.user?.profilePic ||
              "https://m.media-amazon.com/images/I/51T6MpbpQLL.jpg",
            jobRole: response.data.user?.jobRole || "User",
            mobile: response.data.user?.mobile || "",
            token: response.data.token,
          },
        };

        dispatch(login(userData));
        toast.success("Signed in successfully!");
        navigate("/");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.detail ||
            JSON.stringify(error.response.data);
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="signin-page">
        <div className="signin-img">
          <img src={siteLogo} />
          <p>Think the design, design the thinking</p>
        </div>
        <div className="signin-form">
          <div className="signin-cointained">
            <div className="welcome">Sign In</div>
            <p>Welcome back! Let’s make work smarter, not harder.</p>
            <div
              className={`username-cointainer ${
                focusname ? "user-border" : " "
              }`}
            >
              <input
                type="email"
                onFocus={() => setfocusname(true)}
                onBlur={() => setfocusname(false)}
                className="username"
                placeholder="Email"
                required
                value={userMail}
                onChange={(e) => {
                  setUserMail(e.target.value);
                }}
              />
            </div>
            <div
              className={`password-cointainer ${
                focuspassword ? "mail-border" : ""
              }`}
            >
              {showPassword ? (
                <input
                  type={"text"}
                  onFocus={() => setfocuspassword(true)}
                  onBlur={() => setfocuspassword(false)}
                  className="password"
                  placeholder="Password"
                  required
                  minLength="8"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              ) : (
                <input
                  type={"password"}
                  onFocus={() => setfocuspassword(true)}
                  onBlur={() => setfocuspassword(false)}
                  className="password"
                  placeholder="Password"
                  required
                  minLength="8"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              )}
              {showPassword ? (
                <svg
                  className="openeye-logo"
                  onClick={() => {
                    setShowPassword(false);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
              ) : (
                <svg
                  className="closeeye-logo"
                  onClick={() => {
                    setShowPassword(true);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                </svg>
              )}
            </div>
            {/* <div className="tearms-cointainer">
              <input type="checkbox" id="terms" required />
              <label form="terms" className="agree">
                I agree with{" "}
                <a href="#" target="_blank">
                  Terms & Conditions
                </a>
              </label>
            </div> */}
            <button onClick={handleSignIn} className="login-button">
              Sign In
            </button>
            <div id="changer-link">
              Don't have an account?{" "}
              <Link to={"/sign-up"} className="link">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
