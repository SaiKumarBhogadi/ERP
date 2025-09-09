import React, { useState, useEffect } from "react";
import "./project.css";
export default function project({ openProjectBugsPage }) {
  const [apiproject, setapiproject] = useState({});
  const [project, setproject] = useState([]);

  const projectFromAPI = {
    project: [
      {
        ProjectId: 0,
        ProjectName: "Stackly Bug Tracker",
        BugCount: "5",
        Assignedby: "Livin nanand",
      },
      {
        ProjectId: 1,
        ProjectName: "Stackly ERP System",
        BugCount: "3",
        Assignedby: "Kamal",
      },
      {
        ProjectId: 2,
        ProjectName: "Stackly Support System",
        BugCount: "1",
        Assignedby: "Sai",
      },
      {
        ProjectId: 3,
        ProjectName: "Stackly Task Manager",
        BugCount: "5",
        Assignedby: "Livin",
      },
      {
        ProjectId: 4,
        ProjectName: "Stackly HR Portal",
        BugCount: "3",
        Assignedby: "Kamal",
      },
      {
        ProjectId: 5,
        ProjectName: "Stackly CRM Dashboard",
        BugCount: "1",
        Assignedby: "Sai",
      },
      {
        ProjectId: 6,
        ProjectName: "Stackly Inventory System",
        BugCount: "5",
        Assignedby: "Livin",
      },
      {
        ProjectId: 7,
        ProjectName: "Stackly Payroll Management",
        BugCount: "3",
        Assignedby: "Kamal",
      },
      {
        ProjectId: 8,
        ProjectName: "Stackly Recruitment System",
        BugCount: "1",
        Assignedby: "Sai",
      },
      {
        ProjectId: 9,
        ProjectName: "Stackly Attendance Tracker",
        BugCount: "5",
        Assignedby: "Livin",
      },
      {
        ProjectId: 10,
        ProjectName: "Stackly Finance Manager",
        BugCount: "3",
        Assignedby: "Kamal",
      },
      {
        ProjectId: 11,
        ProjectName: "Stackly Feedback System",
        BugCount: "1",
        Assignedby: "Sai",
      },
      {
        ProjectId: 12,
        ProjectName: "Stackly Learning Portal",
        BugCount: "5",
        Assignedby: "Livin",
      },
      {
        ProjectId: 13,
        ProjectName: "Stackly Analytics Dashboard",
        BugCount: "3",
        Assignedby: "Kamal",
      },
      {
        ProjectId: 14,
        ProjectName: "Stackly Client Management",
        BugCount: "1",
        Assignedby: "Sai",
      },
    ],
  };

  useEffect(() => {
    setapiproject(projectFromAPI);
  }, []);
  useEffect(() => {
    if (Object.keys(apiproject).length > 0) {
      setproject(apiproject.project || []);
    }
  }, [apiproject]);
  return (
    <>
      <div className="project-page">
        <h2>Projects Bugs</h2>
        <div className="project-list">
          <table>
            <thead>
              <tr>
                <th className="table-line">#</th>
                <th className="table-line">Project</th>
                <th className="table-line">No.of.Bugs</th>
                <th className="table-line">Assigned by</th>
                <th className="table-line">Action</th>
              </tr>
            </thead>
            <tbody>
              {project.length > 0 ? (
                project.map((ele, ind) => (
                  <tr key={ind}>
                    <td className="table-line" id="black">
                      {ind + 1}
                    </td>
                    <td className="table-line">
                      <abbr title={ele.ProjectName}>
                        {ele.ProjectName.length < 19
                          ? ele.ProjectName
                          : ele.ProjectName.slice(0, 16) + "..."}
                      </abbr>
                    </td>
                    <td className="table-line">{ele.BugCount}</td>
                    <td className="table-line">{ele.Assignedby}</td>
                    <td className="table-line">
                      <button
                        onClick={() => {
                          openProjectBugsPage(ele.ProjectId);
                        }}
                        className="view-project"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Bugs</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
