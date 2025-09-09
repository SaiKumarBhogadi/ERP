import React, { useState, useEffect } from "react";
import "./newproductColor.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductColor({
  newproductColor,
  setnewproductColor,
  editnewproductColor,
  setEditnewproductColor,
  editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
}) {
  const [ColorData, setColorData] = useState({
    color_name: "",
    update_color_name: "",
  });
  const [colors, setColors] = useState([]); // Store fetched colors

  // Fetch colors on component mount
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/colors/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setColors(res.data.colors); // Backend returns { colors: [{id, name}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch colors: " + (error.response?.data?.error || error.message));
      }
    };
    fetchColors();
  }, []);

  const handleColorDataChange = (e) => {
    setColorData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleColorDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newproductColor) {
        // ADD NEW COLOR
        const res = await axios.post(
          "http://127.0.0.1:8000/api/colors/",
          { name: ColorData.color_name },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Color created successfully!");
        setColors([...colors, res.data]); // Update local colors
        setTimeout(() => {
          setnewproductColor(false);
          setEditnewproductColor(false);
        }, 3000);
      } else {
        // EDIT EXISTING COLOR
        const selectedColor = colors.find(
          (item) => item.name === ColorData.color_name
        );

        if (!selectedColor) {
          toast.error("Please select a valid color to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/colors/${selectedColor.id}/`,
          { name: ColorData.update_color_name },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Color updated successfully!");
        setColors(
          colors.map((col) =>
            col.id === selectedColor.id ? res.data : col
          )
        ); // Update local colors
        setTimeout(() => {
          setnewproductColor(false);
          setEditnewproductColor(false);
        }, 3000);
      }

      // Reset form
      setColorData({
        color_name: "",
        update_color_name: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newproductColor
          ? "Failed to create color: " + errorMsg
          : "Failed to update color: " + errorMsg
      );
    }
  };

  const handleDeleteColor = async () => {
    if (!editnewproductColor) return;

    const selectedColor = colors.find(
      (item) => item.name === ColorData.color_name
    );

    if (!selectedColor) {
      toast.error("Please select a valid color to delete.");
      return;
    }

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/colors/${selectedColor.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Color deleted successfully!");
      setColors(colors.filter((col) => col.id !== selectedColor.id));
      setColorData({
        color_name: "",
        update_color_name: "",
      });
      setTimeout(() => {
        setEditnewproductColor(false);
        setnewproductColor(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete color: " + errorMsg);
    }
  };
  return (
    <>
      <div className="poductColor-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="color-head">
          <div className="color-headleft">
            <svg
              onClick={() => {
                setnewproductColor(false);
                setEditnewproductColor(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
              className="left-logo-color"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p>{editnewproductColor ? "Edit" : "Add New"} Color</p>
          </div>
          <div className="color-headright">
            {editnewproductColor && (
              <div
                className="add-color-1"
                onClick={() => {
                  setnewproductColor(true);
                  setEditnewproductColor(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                + Add New
              </div>
            )}
            {newproductColor && (
              <div
                className="add-color-2"
                onClick={() => {
                  setEditnewproductColor(true);
                  setnewproductColor(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                Edit Existing
              </div>
            )}
          </div>
        </div>
        <div className="color-form">
          <form onSubmit={handleColorDataSubmit}>
            {newproductColor ? (
              <div className="color-box">
                <label htmlFor="color_name">Color Name</label>
                <input
                  type="text"
                  value={ColorData.color_name}
                  onChange={handleColorDataChange}
                  id="color_name"
                  placeholder="Black"
                  required
                />
              </div>
            ) : (
              <>
                <div className="color-box">
                  <label htmlFor="color_name">Select Color</label>
                  <select
                    id="color_name"
                    value={ColorData.color_name}
                    onChange={handleColorDataChange}
                    required
                  >
                    <option value="">Select Option</option>
                    {colors.map((ele, ind) => (
                      <option key={ind} value={ele.name}>
                        {ele.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="color-box">
                  <label htmlFor="update_color_name">Update Color Name</label>
                  <input
                    type="text"
                    value={ColorData.update_color_name}
                    onChange={handleColorDataChange}
                    id="update_color_name"
                    placeholder="Yellow"
                    required
                  />
                </div>
              </>
            )}

            <div className="color-submit-container">
              <nav
                onClick={() => {
                  setnewproductColor(false);
                  setEditnewproductColor(false);
                  toast.dismiss(); // Clear toasts on cancel
                }}
              >
                Canael
              </nav>
              <button type="submit">{editnewproductColor ? "Update" : "Create"}</button>
              {editnewproductColor && (
                <div className="remove-color" onClick={handleDeleteColor}>
                  Remove
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
