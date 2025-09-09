import React, { useEffect, useState } from "react";
import CreateNewDeliverySearchOption from "./createNewDeliverySearchOption";

export default function DeliveryListItems({
  deleteDeliveryProduct,
  unique_key,
  BtnAccess,
  setShowSerial,
  deliveryData,
  deliveryInput,
}) {
  const [productData, setProductData] = useState({
    product_name: "",
    product_id: "--",
    quantity: "",
    umo: "--",
    serial_num: "",
  });

  useEffect(() => {
    // Find the selected order
    const selectedOrder = deliveryData.find(
      (order) => order.sales_order_ref === deliveryInput.sales_order_ref
    );

    if (
      selectedOrder &&
      selectedOrder.delivery_table_data.length > unique_key
    ) {
      // Get the product data for this specific row
      const product = selectedOrder.delivery_table_data[unique_key];
      setProductData({
        product_name: product.product_name,
        product_id: product.product_id,
        quantity: product.Quantity,
        umo: product.umo,
        serial_num: product.serial_num,
      });
    } else {
      // Reset if no product data available for this row
      setProductData({
        product_name: "",
        product_id: "--",
        quantity: "",
        umo: "--",
        serial_num: "",
      });
    }
  }, [deliveryInput.sales_order_ref, deliveryData, unique_key]);

  const handleQuantityChange = (e) => {
    setProductData((prev) => ({
      ...prev,
      quantity: e.target.value,
    }));
  };

  return (
    <>
      <tr>
        <td>{unique_key + 1}</td>
        <td style={{ position: "relative", minWidth: "200px" }}>
          <CreateNewDeliverySearchOption
            value={productData.product_name}
            onChange={(selectedProductName) => {
              // Find the selected product from the current order's products
              const selectedOrder = deliveryData.find(
                (order) =>
                  order.sales_order_ref === deliveryInput.sales_order_ref
              );

              if (selectedOrder) {
                const selectedProduct = selectedOrder.delivery_table_data.find(
                  (p) => p.product_name === selectedProductName
                );

                if (selectedProduct) {
                  setProductData({
                    product_name: selectedProduct.product_name,
                    product_id: selectedProduct.product_id,
                    quantity: selectedProduct.Quantity,
                    umo: selectedProduct.umo,
                    serial_num: selectedProduct.serial_num,
                  });
                }
              }
            }}
            productOptions={
              deliveryData
                .find(
                  (order) =>
                    order.sales_order_ref === deliveryInput.sales_order_ref
                )
                ?.delivery_table_data.map((p) => p.product_name) || []
            }
            BtnAccess={BtnAccess}
          />
        </td>
        <td>{productData.product_id}</td>
        <td>
          <input
            type="number"
            value={productData.quantity}
            onChange={handleQuantityChange}
            disabled={BtnAccess}
          />
        </td>
        <td>{productData.umo}</td>
        <td>
          <button
            className={`"createNewDelivery-select-serials" ${
              productData.serial_num === "Completed"
                ? "createNewDelivery-table-green"
                : productData.serial_num === "Incompleted"
                ? "createNewDelivery-table-red"
                : "createNewDelivery-select-serials"
            }`}
            onClick={(e) => {
              setShowSerial(true);
              e.preventDefault();
            }}
            disabled={BtnAccess || !productData.product_id}
          >
            <svg
              className={
                productData.serial_num === "Completed"
                  ? "createNewDelivery-table-green"
                  : productData.serial_num === "Incompleted"
                  ? "createNewDelivery-table-red"
                  : "createNewDelivery-search-logo"
              }
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="19"
              viewBox="0 0 17 19"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.49431 17.8762L9.48514 17.8778L9.42598 17.907L9.40931 17.9103L9.39764 17.907L9.33848 17.8778C9.32959 17.8751 9.32292 17.8764 9.31848 17.882L9.31514 17.8903L9.30098 18.247L9.30514 18.2637L9.31348 18.2745L9.40014 18.3362L9.41264 18.3395L9.42264 18.3362L9.50931 18.2745L9.51931 18.2612L9.52264 18.247L9.50848 17.8912C9.50625 17.8823 9.50153 17.8773 9.49431 17.8762ZM9.71514 17.782L9.70431 17.7837L9.55014 17.8612L9.54181 17.8695L9.53931 17.8787L9.55431 18.237L9.55848 18.247L9.56514 18.2528L9.73264 18.3303C9.7432 18.3331 9.75125 18.3309 9.75681 18.3237L9.76014 18.312L9.73181 17.8003C9.72903 17.7903 9.72348 17.7842 9.71514 17.782ZM9.11931 17.7837C9.11564 17.7814 9.11125 17.7807 9.10706 17.7816C9.10286 17.7826 9.09919 17.7851 9.09681 17.7887L9.09181 17.8003L9.06348 18.312C9.06403 18.322 9.06875 18.3287 9.07764 18.332L9.09014 18.3303L9.25764 18.2528L9.26598 18.2462L9.26931 18.237L9.28348 17.8787L9.28098 17.8687L9.27264 17.8603L9.11931 17.7837Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.75021 0.164063C6.62071 0.164159 5.5076 0.434366 4.50376 0.952141C3.49992 1.46992 2.63446 2.22024 1.97957 3.14052C1.32469 4.0608 0.899386 5.12435 0.739135 6.24243C0.578884 7.36051 0.688336 8.5007 1.05836 9.56788C1.42838 10.6351 2.04825 11.5983 2.86624 12.3772C3.68423 13.1561 4.67663 13.728 5.76064 14.0454C6.84465 14.3628 7.98883 14.4163 9.09773 14.2015C10.2066 13.9867 11.2481 13.5099 12.1352 12.8107L15.1785 15.8541C15.3357 16.0059 15.5462 16.0899 15.7647 16.088C15.9832 16.0861 16.1922 15.9984 16.3467 15.8439C16.5012 15.6894 16.5889 15.4804 16.5908 15.2619C16.5927 15.0434 16.5087 14.8329 16.3569 14.6757L13.3135 11.6324C14.1369 10.5879 14.6495 9.33273 14.7928 8.0105C14.9361 6.68827 14.7042 5.35241 14.1237 4.15581C13.5433 2.9592 12.6376 1.95019 11.5105 1.24426C10.3833 0.538318 9.08018 0.163973 7.75021 0.164063ZM2.33354 7.2474C2.33354 5.81081 2.90423 4.43306 3.92005 3.41723C4.93587 2.40141 6.31362 1.83073 7.75021 1.83073C9.1868 1.83073 10.5646 2.40141 11.5804 3.41723C12.5962 4.43306 13.1669 5.81081 13.1669 7.2474C13.1669 8.68399 12.5962 10.0617 11.5804 11.0776C10.5646 12.0934 9.1868 12.6641 7.75021 12.6641C6.31362 12.6641 4.93587 12.0934 3.92005 11.0776C2.90423 10.0617 2.33354 8.68399 2.33354 7.2474Z"
              />
            </svg>
            <p
              className={
                productData.serial_num === "Completed"
                  ? "createNewDelivery-table-green"
                  : productData.serial_num === "Incompleted"
                  ? "createNewDelivery-table-red"
                  : ""
              }
            >
              {productData.serial_num !== ""
                ? productData.serial_num
                : "Select Serials"}
            </p>
          </button>
        </td>
        <td>
          <svg
            onClick={() => deleteDeliveryProduct(unique_key)}
            className={`createNewDelivery-table-delete-logo ${
              BtnAccess ? "disabled" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 16"
          >
            <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
          </svg>
        </td>
      </tr>
    </>
  );
}
