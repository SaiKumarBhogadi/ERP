import React, { useEffect, useState } from "react";
import "./projectBugsPage.css";
import { Link } from "react-router-dom";

export default function projectBugsPage(projectId) {
  const [apibug, setapibug] = useState({});
  const [bugdata, setbugdata] = useState([]);

  const bugFromAPI = {
    bugdata: [
      {
        id: 0,
        Title: "Error Title",
        priority: "High",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat?ipsum dolor sit amet consue tempora...",
      },
      {
        id: 1,
        Title: "Error Title",
        priority: "Medium",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat?usamus dolorum exercitationem quidem? Quo Lorem ipsum...",
      },
      {
        id: 2,
        Title: "Error Title",
        priority: "Low",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamusLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat? dolorum exercitationem quidem? Quo Lorem ipsum...",
      },
      {
        id: 3,
        Title: "Error Title",
        priority: "High",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamus Qutae quidem iLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat?nciduntolorum dolor voluptatum...",
      },
      {
        id: 4,
        Title: "Stack Overflow Error",
        priority: "High",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamus dolorumLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat? exercitationem quidem? Quo Lorem ipsum...",
      },
      {
        id: 5,
        Title: "Syntax Error",
        priority: "Medium",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamus dolorumLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat? exercitationem quidem? Quo Lorem ipsum...",
      },
      {
        id: 6,
        Title: "Unhandled Exception",
        priority: "High",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamus dolorum Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat?exercitationem quidem? Quo Lorem ipsum...",
      },
      {
        id: 7,
        Title: "Null Pointer Exception",
        priority: "Medium",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamus dolorum exLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat?ercitationem quidem? Quo Lorem ipsum...",
      },
      {
        id: 8,
        Title: "Memory Leak Issue",
        priority: "Low",
        bugimage:
          "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/reactjs-websites-1024x512.png.webp",
        content:
          "Vitae accusamuLorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officia odio vel impedit error? Nisi reprehenderit voluptate, voluptas sapiente quis reiciendis saepe explicabo, ullam ab doloribus impedit unde? Consequuntur, repellat?s dolorum exercitationem quidem? Quo Lorem ipsum...",
      },
    ],
  };

  useEffect(() => {
    setapibug(bugFromAPI);
  }, []);

  useEffect(() => {
    if (Object.keys(apibug).length > 0) {
      setbugdata(apibug.bugdata || []);
    }
  }, [apibug]);

  return (
    <div className="project">
      <h2>Bug Tracker</h2>
      <div className="bug-cointainer">
        {bugdata.length > 0 ? (
          bugdata.map((ele, ind) => (
            <Link to={`/bug-detalis/${ele.id}`} className="bug-box" key={ind}>
              <div className="bug-box-head">
                <nav>
                  <p>{ele.Title}</p>
                  <h3 className="priority">
                    {ele.priority}
                    {ele.priority === "High" ? (
                      <svg
                        className="priority-symbol priority-high"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                      </svg>
                    ) : ele.priority === "Medium" ? (
                      <svg
                        className="priority-symbol priority-medium"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                      </svg>
                    ) : (
                      <svg
                        className="priority-symbol priority-low"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                      </svg>
                    )}
                  </h3>
                </nav>
                <img src={ele.bugimage} />
              </div>
              <div className="bug-discription">{ele.content}</div>
            </Link>
          ))
        ) : (
          <p>No Bugs</p>
        )}
      </div>
    </div>
  );
}
