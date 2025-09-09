// import React, { useState } from "react";

// export default function categoryInput({
//   handleNewProjectCustomData,
//   newProductData,
//   newProductcustom,
//   id,
//   customApi,
//   handleCustomChange,
// }) {
//   const [custom, setCustom] = useState(false);

//   const changeCustom = (e) => {
//     if (e.target.value !== "custom") handleCustomChange(e);
//     else setCustom(true);
//   };

//   return (
//     <>
//       {custom ? (
//         <input
//           id={id}
//           type="text"
//           placeholder="Enter Custom Input"
//           value={newProductcustom[id]}
//           onChange={handleNewProjectCustomData}
//         />
//       ) : (
//         <select
//           id={id}
//           value={newProductData[id] || ""}
//           onChange={(e) => handleCustomChange(e)}
//           required
//         >
//           <option value="">Select Option</option>
//           {customApi.map((item, idx) => (
//             <option key={idx} value={item.name}>
//               {item.name}
//             </option>
//           ))}
//         </select>
//       )}
//     </>
//   );
// }
import React, { useState } from "react";

export default function CategoryInput({
  handleNewProjectCustomData,
  newProductData,
  newProductcustom,
  id,
  customApi,
  handleCustomChange,
  required,
  multiple,
}) {
  const [custom, setCustom] = useState(false);

  const changeCustom = (e) => {
    if (e.target.value === "custom") {
      setCustom(true);
      handleCustomChange({ target: { id, value: "custom" } });
    } else {
      setCustom(false);
      handleCustomChange(e);
    }
  };

  return (
    <>
      {custom ? (
        <input
          id={id}
          type="text"
          placeholder="Enter Custom Input"
          value={newProductcustom?.[id] || ""}
          onChange={(e) => {
            handleNewProjectCustomData(e);
            handleCustomChange({ target: { id, value: "custom" } });
          }}
          required={required}
        />
      ) : (
        <select
          id={id}
          value={newProductData?.[id] === "custom" ? "" : newProductData?.[id] || ""}
          onChange={changeCustom}
          required={required}
          multiple={multiple}
        >
          <option value="" disabled>
            Select Option
          </option>
          {Array.isArray(customApi) &&
            customApi.map((item, idx) => (
              <option key={idx} value={item.id}>
                {item.name}
              </option>
            ))}
          <option value="custom">Custom</option>
        </select>
      )}
    </>
  );
}
