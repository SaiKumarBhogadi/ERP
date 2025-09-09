import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./attendance.css";

export default function Attendance() {
  const [apiData, setApiData] = useState({});
  const [date, setDate] = useState(new Date());
  const [checkInOutTimes, setCheckInOutTimes] = useState([]);
  const [totalCheckInTime, setTotalCheckInTime] = useState(0);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [governmentHolidays, setGovernmentHolidays] = useState([]);
  const [attendance, setAttendance] = useState({});

  // const [leaves, setLeaves] = useState({});

  // API Data

  const govHolidaysAPI = {
    govHolidays: [
      "2024-01-01",
      "2024-01-15",
      "2024-10-31",
      "2024-12-25",
      "2025-02-12",
    ],
  };

  const dateDataAPI = {
    dateData: {
      "2025-02-01": [
        [
          "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
          "Sat Feb 01 2025 18:00:00 GMT+0530 (India Standard Time)",
        ],
        9.0,
      ],
      "2025-02-02": [
        [
          "Sun Feb 02 2025 09:15:00 GMT+0530 (India Standard Time)",
          "Sun Feb 02 2025 17:45:00 GMT+0530 (India Standard Time)",
        ],
        8.5,
      ],
      "2025-02-03": [
        [
          "Mon Feb 03 2025 08:55:00 GMT+0530 (India Standard Time)",
          "Mon Feb 03 2025 17:50:00 GMT+0530 (India Standard Time)",
        ],
        8.92,
      ],
      "2025-02-14": [
        [
          "Sat Feb 15 2025 17:54:16 GMT+0530 (India Standard Time)",
          "Sat Feb 15 2025 17:54:18 GMT+0530 (India Standard Time)",
        ],
        0.0,
      ],
      "2025-02-15": [
        [
          "Sat Feb 15 2025 09:05:00 GMT+0530 (India Standard Time)",
          "Sat Feb 15 2025 18:10:00 GMT+0530 (India Standard Time)",
        ],
        9.08,
      ],
      "2025-02-16": [[], 0],
      "2025-02-17": [[], 0],
      "2025-02-18": [[], 0],
      "2025-02-19": [[], 0],
      "2025-02-20": [[], 0],
      "2025-02-21": [[], 0],
      "2025-02-22": [[], 0],
      "2025-02-23": [[], 0],
      "2025-02-24": [[], 0],
      "2025-02-25": [[], 0],
      "2025-02-26": [[], 0],
      "2025-02-27": [[], 0],
      "2025-02-28": [[], 0],
    },
  };

  useEffect(() => {
    setApiData(dateDataAPI);
    setGovernmentHolidays(govHolidaysAPI.govHolidays);
  }, []);

  useEffect(() => {
    const setupPresentDates = () => {
      for (let ele in apiData.dateData) {
        if (apiData.dateData[ele][1] > 8) {
          setAttendance((prev) => {
            return { ...prev, [ele]: "present" };
          });
        }
      }
    };
    if (Object.keys(apiData).length > 0) {
      setupPresentDates();
    }
  }, [apiData]);

  useEffect(() => {
    if (Object.keys(apiData).length > 0) {
      const dateString = date.toISOString().split("T")[0];
      if (apiData.dateData[dateString]) {
        setCheckInOutTimes(apiData.dateData[dateString][0]);
        setTotalCheckInTime(apiData.dateData[dateString][1]);
      } else {
        setCheckInOutTimes([]);
        setTotalCheckInTime(0);
      }
    }
  }, [date, apiData]);

  // Detect window close and perform checkout
  useEffect(() => {
    const handleUnload = () => {
      if (isCheckedIn) {
        handleCheckInOut();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [isCheckedIn, checkInOutTimes]);

  // Auto-checkout at midnight

  // yet to code

  const handleCheckInOut = () => {
    const now = new Date();
    const currentDateString = now.toISOString().split("T")[0];

    // Prevent checking in/out for past dates
    if (date.toISOString().split("T")[0] !== currentDateString) {
      alert("You can only check-in & check-out on today's date.");
      return;
    }

    setCheckInOutTimes((prevTimes) => {
      const updatedTimes = [...prevTimes, now.toString()];

      setApiData((prev) => {
        return {
          ...prev,
          dateData: {
            ...prev.dateData,
            [currentDateString]: [
              updatedTimes,
              prev.dateData[currentDateString]?.[1] || 0,
            ],
          },
        };
      });

      let totalActiveTime = 0;
      const times = updatedTimes.map((ts) => new Date(ts));

      // Calculate active time from check-in/check-out pairs
      for (let i = 0; i < times.length - 1; i += 2) {
        totalActiveTime += (times[i + 1] - times[i]) / (1000 * 60 * 60);
      }

      setTotalCheckInTime(totalActiveTime);

      setApiData((prev) => {
        const updatedDateString = prev;
        updatedDateString.dateData[currentDateString][1] = totalActiveTime;

        return updatedDateString;
      });

      setIsCheckedIn(!isCheckedIn);
      return updatedTimes;
    });
  };

  const handleSetDate = (dateValue) => {
    dateValue.setMinutes(
      dateValue.getMinutes() - dateValue.getTimezoneOffset()
    );
    setDate(dateValue);
  };

  const getTileClass = ({ date }) => {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const dateString = date.toISOString().split("T")[0];

    let className = "bold-text"; // Default: Bold font

    // Weekends in red font
    if (date.getDay() === 0 || date.getDay() === 6) {
      className += " weekend";
    }

    // Government holidays in orange font
    if (governmentHolidays.includes(dateString)) {
      className += " govt-holiday";
    }

    return className;
  };

  const tileContent = ({ date }) => {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const dateString = date.toISOString().split("T")[0];

    return (
      <div className="date-container">
        {/* Attendance Status */}
        {attendance[dateString] === "present" && (
          <div className="attendance-present-strip"></div>
        )}
      </div>
    );
  };

  return (
    <div className="attendance-container">
      <h2 className="title">Attendance Calendar</h2>

      <div className="calendar-wrapper">
        <Calendar
          onChange={handleSetDate}
          value={date}
          tileClassName={getTileClass}
          tileContent={tileContent}
        />
      </div>

      <div className="controls">
        <p>Selected Date: {date.toDateString()}</p>
        {/* <button onClick={applyLeave}>Apply Leave</button> */}
        <button onClick={handleCheckInOut}>
          {isCheckedIn ? "Check-Out" : "Check-In"}
        </button>
      </div>

      {/* Display Check-in & Check-out Times */}
      <div className="checkin-times">
        <p className="today-in-out">Today's Check-in & Check-out</p>
        {checkInOutTimes.length != 0 ? (
          checkInOutTimes.map((time, index) => (
            <p className="display-time" key={index}>
              {index % 2 === 0 ? "Check-in" : "Check-out"}:{" "}
              {new Date(time).toLocaleTimeString()}
            </p>
          ))
        ) : (
          <p>No Check In</p>
        )}
        <p>
          <strong className="total-time">
            Total Check-in Time: {totalCheckInTime.toFixed(2)} hrs
          </strong>
        </p>
      </div>
    </div>
  );
}
