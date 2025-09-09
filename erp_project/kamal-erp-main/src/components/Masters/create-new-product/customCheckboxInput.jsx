import React, { useState, useEffect } from "react";

export default function customCheckboxInput({
  handleNewProjectCustomData,
  newProductcustom,
  id,
  customApi,
  setnewProductData,
}) {
  const [custom, setCustom] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    setnewProductData((prev) => {
      return { ...prev, [id]: selectedOptions };
    });
  }, [selectedOptions]);

  return (
    <>
      {custom ? (
        <input
          id={id}
          type="text"
          placeholder="Enter Custom Input"
          value={newProductcustom[id]}
          onChange={handleNewProjectCustomData}
        />
      ) : (
        <div className="newproduct-ckeckbox-dropdown-container">
          <div
            className="newproduct-ckeckbox-dropdown-button"
            onClick={() => setOpen(!open)}
          >
            {selectedOptions.length > 0
              ? selectedOptions.join(", ")
              : "Select Product"}
          </div>

          {open && (
            <div className="newproduct-ckeckbox-dropdown-menu">
              <p
                onClick={() => {
                  setCustom(true);
                  setSelectedOptions([]);
                }}
              >
                custom
              </p>
              {customApi.map((option) => (
                <label
                  key={option}
                  className="newproduct-ckeckbox-dropdown-option"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
