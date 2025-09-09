import React, { useState, useRef } from "react";
import "./createNewStockReturn.css";

export default function returnAttachment({ inputDisable }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [backendFiles, setBackendFiles] = useState([
    // Example backend files — you will fetch this from an API
    {
      name: "customer_po.pdf — uploaded by Alice at May 2, 10:30 AM",
      url: "https://example.com/files/invoice.pdf",
    },
    {
      name: "product_specs.xlsx — uploaded by John at May 2, 09:40 AM",
      url: "https://example.com/files/quote.docx",
    },
  ]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeUploadedFile = (index) => {
    if (window.confirm("Are you sure you want to remove this file?")) {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const removeBackendFile = (index) => {
    if (window.confirm("Are you sure you want to remove this file?")) {
      setBackendFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <div className="createNewReturn-attachment-container">
      <div className="createNewReturn-upload-container">
        <input
          type="file"
          ref={fileInputRef}
          hidden
          id="upload_documents"
          name="upload_documents"
          onChange={handleFileChange}
          multiple
        />
        <div className="createNewReturn-upload-btn" onClick={handleUploadClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
          >
            <path
              d="M5 4.25C5 3.65326 5.23705 3.08097 5.65901 2.65901C6.08097 2.23705 6.65326 2 7.25 2H14.75C15.0455 2 15.3381 2.0582 15.611 2.17127C15.884 2.28434 16.1321 2.45008 16.341 2.65901C16.5499 2.86794 16.7157 3.11598 16.8287 3.38896C16.9418 3.66194 17 3.95453 17 4.25V12.75C17 13.0455 16.9418 13.3381 16.8287 13.611C16.7157 13.884 16.5499 14.1321 16.341 14.341C16.1321 14.5499 15.884 14.7157 15.611 14.8287C15.3381 14.9418 15.0455 15 14.75 15H7.25C6.65326 15 6.08097 14.7629 5.65901 14.341C5.23705 13.919 5 13.3467 5 12.75V4.25Z"
              fill="url(#paint0_linear_888_3201)"
            />
            <path
              d="M5 4.25C5 3.65326 5.23705 3.08097 5.65901 2.65901C6.08097 2.23705 6.65326 2 7.25 2H14.75C15.0455 2 15.3381 2.0582 15.611 2.17127C15.884 2.28434 16.1321 2.45008 16.341 2.65901C16.5499 2.86794 16.7157 3.11598 16.8287 3.38896C16.9418 3.66194 17 3.95453 17 4.25V12.75C17 13.0455 16.9418 13.3381 16.8287 13.611C16.7157 13.884 16.5499 14.1321 16.341 14.341C16.1321 14.5499 15.884 14.7157 15.611 14.8287C15.3381 14.9418 15.0455 15 14.75 15H7.25C6.65326 15 6.08097 14.7629 5.65901 14.341C5.23705 13.919 5 13.3467 5 12.75V4.25Z"
              fill="url(#paint1_linear_888_3201)"
            />
            <path
              d="M1 2.25C1 1.65326 1.23705 1.08097 1.65901 0.65901C2.08097 0.237053 2.65326 0 3.25 0H12.25C12.8467 0 13.419 0.237053 13.841 0.65901C14.2629 1.08097 14.5 1.65326 14.5 2.25V12.75C14.5 13.3467 14.2629 13.919 13.841 14.341C13.419 14.7629 12.8467 15 12.25 15H3.25C2.65326 15 2.08097 14.7629 1.65901 14.341C1.23705 13.919 1 13.3467 1 12.75V2.25Z"
              fill="url(#paint2_radial_888_3201)"
            />
            <path
              d="M2.25 6C1.65326 6 1.08097 6.23705 0.65901 6.65901C0.237053 7.08097 0 7.65326 0 8.25V16.75C0 17.1768 0.0840637 17.5994 0.247391 17.9937C0.410719 18.388 0.650112 18.7463 0.951903 19.0481C1.25369 19.3499 1.61197 19.5893 2.00628 19.7526C2.40059 19.9159 2.8232 20 3.25 20H14.75C15.1768 20 15.5994 19.9159 15.9937 19.7526C16.388 19.5893 16.7463 19.3499 17.0481 19.0481C17.3499 18.7463 17.5893 18.388 17.7526 17.9937C17.9159 17.5994 18 17.1768 18 16.75V15.25C18 14.6533 17.7629 14.081 17.341 13.659C16.919 13.2371 16.3467 13 15.75 13H12.904C12.8007 13 12.6986 12.9787 12.604 12.9374C12.5093 12.8961 12.4242 12.8357 12.354 12.76L6.744 6.72C6.5337 6.49324 6.2789 6.31227 5.99552 6.18839C5.71215 6.06451 5.40627 6.00038 5.097 6H2.25Z"
              fill="url(#paint3_linear_888_3201)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_888_3201"
                x1="18.8"
                y1="17.5"
                x2="20.639"
                y2="3.773"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#BB45EA" />
                <stop offset="1" stopColor="#9C6CFE" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_888_3201"
                x1="17"
                y1="6.5"
                x2="14"
                y2="6.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.338" stopColor="#5750E2" stopOpacity="0" />
                <stop offset="1" stopColor="#5750E2" />
              </linearGradient>
              <radialGradient
                id="paint2_radial_888_3201"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(5.05 12) rotate(-52.6548) scale(14.4655 23.3167)"
              >
                <stop offset="0.228" stopColor="#2764E7" />
                <stop offset="0.685" stopColor="#5CD1FF" />
                <stop offset="1" stopColor="#6CE0FF" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_888_3201"
                x1="3.857"
                y1="6"
                x2="3.857"
                y2="25.091"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.241" stopColor="#FFD638" />
                <stop offset="0.637" stopColor="#FAB500" />
                <stop offset="0.985" stopColor="#CA6407" />
              </linearGradient>
            </defs>
          </svg>
          <nav>Upload Files</nav>
        </div>
      </div>
      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <>
          <nav className="createNewReturn-attached-files">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M9.79 5.09172L5.18334 9.69755C4.77579 10.1052 4.54687 10.6581 4.54695 11.2345C4.54703 11.811 4.77609 12.3638 5.18375 12.7713C5.59141 13.1789 6.14428 13.4078 6.72072 13.4077C7.29716 13.4076 7.84995 13.1785 8.2575 12.7709L13.2425 7.78589C13.5968 7.43354 13.8779 7.01464 14.0697 6.55328C14.2615 6.09193 14.3603 5.5972 14.3603 5.09755C14.3603 4.5979 14.2615 4.10318 14.0697 3.64182C13.8779 3.18047 13.5968 2.76157 13.2425 2.40922C12.5255 1.7141 11.5633 1.3299 10.5647 1.34004C9.56613 1.35018 8.61188 1.75385 7.90917 2.46339L2.88084 7.39505C1.8968 8.42033 1.35383 9.79047 1.36845 11.2115C1.38307 12.6325 1.9541 13.9912 2.95903 14.996C3.96395 16.0008 5.3227 16.5717 6.74372 16.5862C8.16475 16.6007 9.53484 16.0575 10.56 15.0734L16.7075 8.98005"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Currently Attached Files:</p>
          </nav>
          {uploadedFiles.map((file, index) => (
            <div key={`upload-${index}`} className="createNewReturn-file-item">
              <nav>{file.name}</nav>
              <div className="createNewReturn-file-actions">
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeUploadedFile(index);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {/* Backend files */}
      {backendFiles.length > 0 && (
        <>
          <nav className="createNewReturn-attached-files">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M9.79 5.09172L5.18334 9.69755C4.77579 10.1052 4.54687 10.6581 4.54695 11.2345C4.54703 11.811 4.77609 12.3638 5.18375 12.7713C5.59141 13.1789 6.14428 13.4078 6.72072 13.4077C7.29716 13.4076 7.84995 13.1785 8.2575 12.7709L13.2425 7.78589C13.5968 7.43354 13.8779 7.01464 14.0697 6.55328C14.2615 6.09193 14.3603 5.5972 14.3603 5.09755C14.3603 4.5979 14.2615 4.10318 14.0697 3.64182C13.8779 3.18047 13.5968 2.76157 13.2425 2.40922C12.5255 1.7141 11.5633 1.3299 10.5647 1.34004C9.56613 1.35018 8.61188 1.75385 7.90917 2.46339L2.88084 7.39505C1.8968 8.42033 1.35383 9.79047 1.36845 11.2115C1.38307 12.6325 1.9541 13.9912 2.95903 14.996C3.96395 16.0008 5.3227 16.5717 6.74372 16.5862C8.16475 16.6007 9.53484 16.0575 10.56 15.0734L16.7075 8.98005"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Previously Attached Files:</p>
          </nav>

          {backendFiles.map((file, index) => (
            <div key={`backend-${index}`} className="createNewReturn-file-item">
              <nav>{file.name}</nav>
              <div className="createNewReturn-file-actions">
                <a
                  href={file.url}
                  download={file.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>{" "}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeBackendFile(index);
                  }}
                  disabled={inputDisable}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
