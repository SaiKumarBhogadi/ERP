import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function createNewDeliverySearchOption({
  value,
  onChange,
  productOptions,
  BtnAccess,
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (Array.isArray(productOptions) && productOptions.length > 0) {
      const opts = productOptions.map((desc) => ({
        value: desc,
        label: desc,
      }));
      setOptions(opts);
    }
  }, [productOptions]);

  return (
    <div>
      <Select
        value={value ? { label: value, value } : null}
        onChange={(selected) => onChange(selected.value)}
        options={options}
        placeholder="Select product"
        isDisabled={BtnAccess}
      />
    </div>
  );
}
