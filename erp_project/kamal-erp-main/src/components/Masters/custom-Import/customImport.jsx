import React, { useState, useRef, useEffect } from "react";
import "./customImport.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const REQUIRED_FIELDS = [
  "customer_id",
  "customer_name",
  "customer_type",
  "company_name",
  "status",
  "email",
  "credit_limit",
  "city",
];

export default function customImport({ setshowCustomImport, setcustomMaster }) {
  const [files, setFiles] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [validRowCount, setValidRowCount] = useState(0);
  const [invalidRowCount, setInvalidRowCount] = useState(0);
  const [skippedRowCount, setSkippedRowCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const inpRef = useRef(null);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      const ext = file.name.split(".").pop().toLowerCase();
      if (ext === "csv") {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    let allValidRows = [];
    let totalValid = 0;
    let totalInvalid = 0;
    let totalSkipped = 0;

    const seencustomerIDs = new Set();
    const seencustomerNames = new Set();

    for (const file of files) {
      try {
        const ext = file.name.split(".").pop().toLowerCase();
        const content = await readFile(file);
        let rows = [];

        if (ext === "csv") {
          const result = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
          });
          rows = result.data;
        } else if (ext === "xlsx" || ext === "xls") {
          const workbook = XLSX.read(content, { type: "binary" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(worksheet);
        } else {
          throw new Error("Unsupported file format");
        }

        for (const row of rows) {
          const hasAllRequired = REQUIRED_FIELDS.every(
            (key) => row[key] !== undefined && row[key] !== ""
          );

          if (!hasAllRequired) {
            totalInvalid++;
            continue;
          }

          const pid = row["customer_id"];
          const pname = row["customer_name"];

          if (seencustomerIDs.has(pid) || seencustomerNames.has(pname)) {
            totalSkipped++;
            continue;
          }

          seencustomerIDs.add(pid);
          seencustomerNames.add(pname);
          allValidRows.push(row);
          totalValid++;
        }
      } catch (err) {
        console.error(`Error processing ${file.name}`, err);
      }
    }

    setProcessedData(allValidRows);
    setValidRowCount(totalValid);
    setInvalidRowCount(totalInvalid);
    setSkippedRowCount(totalSkipped);
  };

  useEffect(() => {
    processFiles();
  }, [files]);

  const fileChange = (e) => {
    const selected = Array.from(e.target.files);
    const existingNames = new Set(files.map((f) => f.name));
    const newUnique = selected.filter((f) => !existingNames.has(f.name));
    setFiles((prev) => [...prev, ...newUnique]);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
    setIsDragging(false);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = () => setIsDragging(false);

  const handleReset = () => {
    setFiles([]);
    setProcessedData([]);
    setValidRowCount(0);
    setInvalidRowCount(0);
    setSkippedRowCount(0);
    inpRef.current.value = null;
  };

  const handleImportFileSubmit = (e) => {
    e.preventDefault();

    processedData.length > 0
      ? setcustomMaster((prev) => {
          return [...prev, ...processedData];
        })
      : console.log("No files to be imported!");

    setshowCustomImport(false);
  };
  return (
    <>
      <div
        className="customImport-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form onSubmit={handleImportFileSubmit}>
          <div className="customImport-head">
            <p>Import customers from CSV/Excel</p>
            <nav onClick={() => setshowCustomImport(false)}>
              <svg
                className="circle-x-logo-customImport"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <p>Close</p>
            </nav>
          </div>

          <div className="customImport-downloadTemplate-container">
            <nav className="customImport-downloadTemplate-title">
              1. Download Template :
            </nav>
            <a
              href="/sample_products.csv"
              download
              className="customImport-download-btn-container"
            >
              <svg
                className="customImport-download-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32v242.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64v-32c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              <span>Download Sample Template (CSV/XLSX)</span>
            </a>

            <div>
              <svg
                className="customImport-tickbox-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              <p>Ensure all mandatory fields are filled.</p>
            </div>

            <div>
              <svg
                className="customImport-download-blue-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32v242.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64v-32c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              <p>
                After importing, review and update customer data for
                completeness and accuracy.
              </p>
            </div>
          </div>

          <div className="customImport-upload-container">
            <input
              type="file"
              hidden
              multiple
              ref={inpRef}
              onChange={fileChange}
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <p>2. Upload File :</p>
            <nav className="customImport-uploadbox-container">
              <nav>
                <button
                  className="customImport-reser-img-btn"
                  type="button"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </nav>
              <div
                className="customImport-uploadbox"
                onClick={() => inpRef.current.click()}
                style={
                  isDragging
                    ? { backgroundColor: "seagreen", opacity: ".5" }
                    : {}
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="customImport-file-logo"
                  viewBox="0 0 29 32"
                  fill="none"
                >
                  <path
                    d="M8.11523 7.15295C8.11523 6.23489 8.47993 5.35443 9.1291 4.70527C9.77826 4.0561 10.6587 3.69141 11.5768 3.69141H23.1152C23.5698 3.69141 24.0199 3.78094 24.4399 3.9549C24.8599 4.12886 25.2415 4.38383 25.5629 4.70527C25.8843 5.0267 26.1393 5.4083 26.3133 5.82827C26.4872 6.24824 26.5768 6.69837 26.5768 7.15295V20.2299C26.5768 20.6844 26.4872 21.1346 26.3133 21.5545C26.1393 21.9745 25.8843 22.3561 25.5629 22.6775C25.2415 22.999 24.8599 23.254 24.4399 23.4279C24.0199 23.6019 23.5698 23.6914 23.1152 23.6914H11.5768C10.6587 23.6914 9.77826 23.3267 9.1291 22.6775C8.47993 22.0284 8.11523 21.1479 8.11523 20.2299V7.15295Z"
                    fill="url(#paint0_linear_794_2019)"
                  />
                  <path
                    d="M8.11523 7.15295C8.11523 6.23489 8.47993 5.35443 9.1291 4.70527C9.77826 4.0561 10.6587 3.69141 11.5768 3.69141H23.1152C23.5698 3.69141 24.0199 3.78094 24.4399 3.9549C24.8599 4.12886 25.2415 4.38383 25.5629 4.70527C25.8843 5.0267 26.1393 5.4083 26.3133 5.82827C26.4872 6.24824 26.5768 6.69837 26.5768 7.15295V20.2299C26.5768 20.6844 26.4872 21.1346 26.3133 21.5545C26.1393 21.9745 25.8843 22.3561 25.5629 22.6775C25.2415 22.999 24.8599 23.254 24.4399 23.4279C24.0199 23.6019 23.5698 23.6914 23.1152 23.6914H11.5768C10.6587 23.6914 9.77826 23.3267 9.1291 22.6775C8.47993 22.0284 8.11523 21.1479 8.11523 20.2299V7.15295Z"
                    fill="url(#paint1_linear_794_2019)"
                  />
                  <path
                    d="M1.96094 4.07677C1.96094 3.15872 2.32563 2.27826 2.9748 1.6291C3.62396 0.979931 4.50442 0.615234 5.42248 0.615234H19.2686C20.1867 0.615234 21.0671 0.979931 21.7163 1.6291C22.3655 2.27826 22.7302 3.15872 22.7302 4.07677V20.2306C22.7302 21.1487 22.3655 22.0291 21.7163 22.6783C21.0671 23.3275 20.1867 23.6922 19.2686 23.6922H5.42248C4.50442 23.6922 3.62396 23.3275 2.9748 22.6783C2.32563 22.0291 1.96094 21.1487 1.96094 20.2306V4.07677Z"
                    fill="url(#paint2_radial_794_2019)"
                  />
                  <path
                    d="M3.88439 9.8457C2.96633 9.8457 2.08588 10.2104 1.43671 10.8596C0.787548 11.5087 0.422852 12.3892 0.422852 13.3072V26.3842C0.422852 27.0408 0.55218 27.691 0.803454 28.2976C1.05473 28.9042 1.42302 29.4554 1.88732 29.9197C2.35161 30.384 2.90281 30.7523 3.50943 31.0036C4.11606 31.2548 4.76624 31.3842 5.42285 31.3842H23.1152C23.7718 31.3842 24.4219 31.2548 25.0286 31.0036C25.6352 30.7523 26.1864 30.384 26.6507 29.9197C27.115 29.4554 27.4833 28.9042 27.7346 28.2976C27.9858 27.691 28.1152 27.0408 28.1152 26.3842V24.0765C28.1152 23.1584 27.7505 22.278 27.1013 21.6288C26.4521 20.9796 25.5717 20.6149 24.6536 20.6149H20.2752C20.1163 20.615 19.9591 20.5822 19.8135 20.5186C19.6679 20.4551 19.537 20.3622 19.429 20.2457L10.7982 10.9534C10.4747 10.6045 10.0827 10.3261 9.64673 10.1355C9.21077 9.94494 8.74019 9.84628 8.26439 9.8457H3.88439Z"
                    fill="url(#paint3_linear_794_2019)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_794_2019"
                      x1="29.346"
                      y1="27.5376"
                      x2="32.1752"
                      y2="6.4191"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#BB45EA" />
                      <stop offset="1" stop-color="#9C6CFE" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_794_2019"
                      x1="26.5768"
                      y1="10.6145"
                      x2="21.9614"
                      y2="10.6145"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0.338"
                        stop-color="#5750E2"
                        stop-opacity="0"
                      />
                      <stop offset="1" stop-color="#5750E2" />
                    </linearGradient>
                    <radialGradient
                      id="paint2_radial_794_2019"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(8.19171 19.0768) rotate(-52.6548) scale(22.2546 35.8718)"
                    >
                      <stop offset="0.228" stop-color="#2764E7" />
                      <stop offset="0.685" stop-color="#5CD1FF" />
                      <stop offset="1" stop-color="#6CE0FF" />
                    </radialGradient>
                    <linearGradient
                      id="paint3_linear_794_2019"
                      x1="6.3567"
                      y1="9.8457"
                      x2="6.3567"
                      y2="39.2165"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.241" stop-color="#FFD638" />
                      <stop offset="0.637" stop-color="#FAB500" />
                      <stop offset="0.985" stop-color="#CA6407" />
                    </linearGradient>
                  </defs>
                </svg>
                <p>Choose or Drag and drop your file here</p>

                {files.length > 0 && (
                  <p style={{ fontSize: "10px", textAlign: "center" }}>
                    {files.map((file, ind) => {
                      return <span key={ind}>{file.name}, </span>;
                    })}
                  </p>
                )}

                <nav>
                  Supported formats<div>.csv , .xlsx</div>
                </nav>
              </div>
            </nav>
          </div>

          <div className="customImport-validation-container">
            <div className="customImport-validation-tit">
              <svg
                className="customImport-validation-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              <p>Validation</p>
            </div>
            <nav>
              <table>
                <thead className="customImport-validation-head">
                  <tr>
                    <th>Valid Rows</th>
                    <th>Invalid Rows</th>
                    <th>Skipped</th>
                  </tr>
                </thead>
                <tbody className="customImport-validation-body">
                  <tr>
                    <td>{validRowCount}</td>
                    <td>{invalidRowCount}</td>
                    <td>{skippedRowCount}</td>
                  </tr>
                </tbody>
              </table>
            </nav>
          </div>
          <div className="customImport-info-container">
            <nav className="customImport-info-tit">
              <svg
                className="customImport-alert-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
              </svg>
              <p>No file uploaded yet</p>
            </nav>
            <div>
              <nav className="customImport-info-tit">
                <svg
                  className="customImport-alert-red-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
                <p>Errors Detected:</p>
              </nav>
              <p>1.Missing "UOM" in Row 10, 12, 13</p>
              <p>1.Missing "UOM" in Row 10, 12, 13</p>
              <p>1.Missing "UOM" in Row 10, 12, 13</p>
            </div>
            <div>
              <nav className="customImport-info-tit">
                <svg
                  className="customImport-skipped-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                </svg>
                <p>Skipped Row:</p>
              </nav>
              <p>1.Missing "UOM" in Row 10, 12, 13</p>
            </div>
          </div>
          <div className="customImport-checkbox">
            <input type="checkbox" required />
            <p>Import validated rows only</p>
          </div>
          <div className="customImport-submit-container">
            <nav
              onClick={() => {
                setshowCustomImport(false);
                setFiles([]);
              }}
            >
              Cancel
            </nav>
            <button>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
