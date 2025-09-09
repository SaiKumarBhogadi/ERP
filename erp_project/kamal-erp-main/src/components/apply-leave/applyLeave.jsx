import React, { useState } from "react";
import "./applyLeave.css";
export default function applyLeave() {
  const [showPaidType, setShowPaidType] = useState(false);

  const [leaveFrom, setLeaveForm] = useState({
    project_head: "",
    from_date: "",
    to_date: "",
    leave_type: "",
    paid_leave_type: null,
    message: "",
  });

  function handleFormChange(e) {
    setLeaveForm((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleFormDateChange(e) {
    setLeaveForm((prev) => ({
      ...prev,
      [e.target.id]: new Date(e.target.value).toISOString(),
    }));
  }

  function handleFormRadioChange(e) {
    if (e.target.checked) {
      setLeaveForm((prev) => {
        return { ...prev, paid_leave_type: e.target.value };
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (leaveFrom.leave_type !== "Paid Leave") {
      setLeaveForm((prev) => {
        return { ...prev, paid_leave_type: "" };
      });
    }

    console.log(leaveFrom);
    setLeaveForm({
      project_head: "",
      from_date: "",
      to_date: "",
      leave_type: "",
      paid_leave_type: "",
      message: "",
    });
  }

  return (
    <>
      <div className="apply-leave">
        <div className="applyleave-cointainer">
          <h3>Apply Leave</h3>
          <nav>
            <div className="leave-date">
              <div>
                <nav>Project Head :</nav>
                <input
                  type="text"
                  name="project_head"
                  id="project_head"
                  value={leaveFrom.project_head}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <nav>From :</nav>
                <input
                  type="date"
                  required
                  name="from_date"
                  id="from_date"
                  value={
                    leaveFrom.from_date !== ""
                      ? leaveFrom.from_date.split("T")[0]
                      : ""
                  }
                  onChange={handleFormDateChange}
                />
              </div>
              <div>
                <nav>To :</nav>
                <input
                  type="date"
                  required
                  name="to_date"
                  id="to_date"
                  value={
                    leaveFrom.to_date !== ""
                      ? leaveFrom.to_date.split("T")[0]
                      : ""
                  }
                  onChange={handleFormDateChange}
                />
              </div>
              <div>
                <nav>Leave type :</nav>
                <select
                  required
                  name="leave_type"
                  id="leave_type"
                  value={leaveFrom.leave_type}
                  onChange={(e) => {
                    handleFormChange(e);
                    setShowPaidType(e.target.value === "Paid Leave");
                  }}
                >
                  <option value="">Select type</option>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>
              <div>
                {showPaidType && (
                  <>
                    <nav>Paid Leave:</nav>
                    <div className="leave-radio">
                      <label>
                        <input
                          type="radio"
                          name="paid_leave_type"
                          id="paid_leave_type"
                          value="Sick"
                          required
                          onChange={handleFormRadioChange}
                        />
                        Sick Leave
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="paid_leave_type"
                          id="paid_leave_type"
                          value="Casual"
                          onChange={handleFormRadioChange}
                          required
                        />
                        Casual Leave
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>
          <div className="reason-cointainer">
            <div>Reason</div>
            <textarea
              placeholder="Reason for applying leave..."
              required
              id="message"
              name="message"
              value={leaveFrom.message}
              onChange={handleFormChange}
            ></textarea>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        <div className="remainingleave-cointainer">
          <h3>Remaining Leave</h3>
          <div className="yearly-leave-cointainer">
            <p>Total number of Leave available from April to March</p>
            <div className="tot-leave-y">Total Leave = 24</div>
            <div className="sick-leave-y">
              Sick Leave = 12 <p> // One days per month only</p>
            </div>
            <div className="casual-leave-y">
              Casual Leave = 12 <p> // One days per month only</p>
            </div>
          </div>
          <div className="monthly-leave-cointainer">
            <p>Leave available for current month</p>
            <div className="sick-leave-m">Sick Leave = 1 </div>
            <div className="casual-leave-m">Casual Leave = 1 </div>
          </div>
        </div>
      </div>
    </>
  );
}
