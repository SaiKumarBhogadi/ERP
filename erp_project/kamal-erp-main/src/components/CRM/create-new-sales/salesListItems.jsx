import React, { useEffect, useState } from "react";
import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

export default function SalesListItems({
  unique_key,
  sales_table_data,
  setSalesList_data,
  deleteSalesProduct,
  productTotal,
  salesData,
  btnAccess,
}) {
  const [uomOptions, setuomOptions] = useState([]);
  const [taxOptions, settaxOptions] = useState([]);
  const [product_details, setproduct_details] = useState({
    unique_key: unique_key,
    product_id: "--",
    product_name: "",
    stock_level: "--",
    uom: "--",
    unit_price: 0,
    discount: 0,
    tax: "--",
    quantity: 0,
  });
  useEffect(() => {
    setSalesList_data((prev) => {
      return prev.map((ele) => {
        if (ele.unique_key === unique_key) {
          return product_details;
        }
        return ele;
      });
    });
  }, [product_details]);

  // Update product details on name selection
  useEffect(() => {
    const selected = product_details.product_name;
    if (!selected) {
      setproduct_details((prev) => ({
        ...prev,
        product_id: "",
        stock_level: "",
        uom: "--",
        unit_price: 0,
        discount: "--",
        tax: 0,
        quantity: 0,
      }));
      setuomOptions([]);
      settaxOptions([]);
      return;
    }

    const product = sales_table_data.find(
      (ele) => ele.product_name === selected
    );

    if (product) {
      setproduct_details((prev) => ({
        ...prev,
        product_id: product.product_id,
        stock_level: product.stock_level,
        uom: product.uom,
        unit_price: product.unit_price,
        discount: product.discount,
        tax: product.tax,
        quantity: product.quantity,
      }));
      setuomOptions(product.uom || []);
      settaxOptions(product.tax || []);
    } else {
      setuomOptions([]);
      settaxOptions([]);
    }
  }, [product_details.product_name, sales_table_data]);

  return (
    <tr>
      <td>{unique_key + 1}</td>

      <td style={{ position: "relative", minWidth: "200px" }}>
        <CreateNewSalesSearchOption
          value={product_details.product_name}
          onChange={(value) =>
            setproduct_details((prev) => ({
              ...prev,
              product_name: value,
            }))
          }
          productOptions={sales_table_data.map((p) => p.product_name)}
          btnAccess={btnAccess}
        />
      </td>

      <td>{product_details.product_id}</td>
      <td>{product_details.stock_level}</td>

      <td>
        <input
          type="number"
          value={product_details.quantity}
          onChange={(e) => {
            setproduct_details((prev) => {
              return { ...prev, quantity: e.target.value };
            });
          }}
          required
          disabled={btnAccess}
        />
      </td>
      <td>
        <select
          value={product_details.uom}
          onChange={(e) => {
            setproduct_details((prev) => {
              return { ...prev, uom: e.target.value };
            });
          }}
          required
          disabled={btnAccess}
        >
          <option value="">Select UOM</option>
          {uomOptions.map((ele, ind) => (
            <option key={ind} value={ele}>
              {ele}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          onChange={(e) => {
            setproduct_details((prev) => {
              return { ...prev, unit_price: e.target.value };
            });
          }}
          value={product_details.unit_price}
          required
          disabled={btnAccess}
        />
      </td>
      <td>
        <select
          value={product_details.tax}
          onChange={(e) => {
            setproduct_details((prev) => {
              return { ...prev, tax: e.target.value };
            });
          }}
          required
          disabled={btnAccess}
        >
          <option value="">Select Tax</option>

          {taxOptions.map((ele, ind) => (
            <option key={ind} value={ele}>
              {ele}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          value={product_details.discount}
          onChange={(e) => {
            setproduct_details((prev) => {
              return { ...prev, discount: e.target.value };
            });
          }}
          required
          disabled={btnAccess}
        />
      </td>
      <td>
        {salesData.currency === "IND" && <span>₹</span>}
        {salesData.currency === "USD" && <span>$</span>}
        {salesData.currency === "GBP" && <span>£</span>}
        {salesData.currency === "SGD" && <span>S$</span>}
        {salesData.currency === "EUR" && <span>€</span>}
        {productTotal(unique_key)}
      </td>
      <td id="createNewSales-table-content-center">
        <svg
          onClick={() => deleteSalesProduct(unique_key)}
          className={`createNewSales-table-delete-logo ${
            btnAccess ? "disabled" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 16"
        >
          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
        </svg>
      </td>
    </tr>
  );
}
