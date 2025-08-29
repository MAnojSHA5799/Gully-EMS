import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import axios from "axios";
import { FaMugHot } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import '../../../assets/css/dashboard.css';
import festivalData from '../festivalData';
const Dashboard = () => {
  const location = useLocation(); // Use useLocation hook
  const { user } = location.state || {}; // Destructure the user from state
  console.log(user)
  const [timesheetData, setTimesheetData] = useState([]);
  const [vacationLeaveData, setVacationLeaveData] = useState([]);
  const [sickLeaveData, setSickLeaveData] = useState([]);
  const [materinityLeaveData, setMaterinityLeaveData] = useState([]);
  const todayDate = new Date();
const localDate = todayDate.toLocaleDateString("en-CA"); // "en-CA" gives the date in YYYY-MM-DD format
console.log(localDate);
  const [trackingData, setTrackingData] = useState([]);
  const [totalleave, setTotalLeave] = useState([]);
  const [takingLeave, setTakingLeave] = useState([]);
  const [timeCount, setTimeCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveData, setLeaveData] = useState([]);
  
  let intervalId; // Declare intervalId

  // Cleanup interval when the component is unmounted
  useEffect(() => {
    // if (user) {
    //   localStorage.setItem("user", JSON.stringify(user));
    // }
  
    // Fetch data
    // fetchVacationLeaveData();
    // fetchSickLeaveData();
    // fetchMaterinityLeaveData();
    // fetchTrackingLeaves();
    fetchTimeCount();
    fetchTimesheetAndLeaveData();
  
    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId); // Use intervalId safely
    };
  }, [user]);
  
  const fetchTimeCount = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const response = await axios.get(
        `https://gully-ems.onrender.com/userTimeCount?employeeCode=${employeeCode}`
      );
      setTimeCount(response.data);
    } catch (error) {
      console.error("Error fetching sick leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheetAndLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;

      const url = `https://gully-ems.onrender.com/timesheet22?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`;
      const response = await axios.get(url);
      console.log("asadaddf",response.data.timeSheet,response.data.leaves)
      setTimesheetData(response.data.timeSheet);
      setLeaveData(response.data.leaves);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchVacationLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;
      const response = await axios.get(
        `https://gully-ems.onrender.com/vacation-leave?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`
      );
      setVacationLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching vacation leave data:", error);
    }
  };

  const fetchSickLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;
      const response = await axios.get(
        `https://gully-ems.onrender.com/sick-leave?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`
      );
      setSickLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching sick leave data:", error);
    }
  };

  const fetchMaterinityLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;
      const response = await axios.get(
        `https://gully-ems.onrender.com/materinity-leave?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`
      );
      setMaterinityLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching Materinity leave data:", error);
    }
  };

  const fetchTrackingLeaves = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No user found in localStorage");
      }
  
      const employeeCode = JSON.parse(storedUser).emp_code;
      const response = await axios.get(
        `https://gully-ems.onrender.com/api/tracking-leaves?employeeCode=${employeeCode}`
      );
  
      const leaveData = response.data[0];
      
      if (leaveData) {
        setTotalLeave(leaveData.total_leaves);
        setTakingLeave(leaveData.taking_leaves); // Adjust the property names according to your data
        setTrackingData(leaveData.balance_leave); // Adjust the property names according to your data
      } else {
        console.log("No leave data found for the employee.");
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const handleTimeInClick = async () => {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const morningLimit = 9 * 3600 + 30 * 60; // 10:15:00 in seconds
    const afternoonStart = 13 * 3600; // 13:00:00 in seconds
    const afternoonEnd = 14 * 3600 + 30 * 60; // 14:30:00 in seconds
  
    // Check for leave conditions
    if (Array.isArray(leaveData) && leaveData.length > 0) {
      const leave = leaveData[0]; // Now safe to access the first item in leaveData
      if (leave) {
        if (leave.leave_duration === "FirstHalf" && (currentTime < afternoonStart || currentTime > afternoonEnd)) {
          alert("For FirstHalf leave, you can Time In only between 1:00 PM to 2:30 PM.");
          return;
        } else if (leave.leave_duration === "SecondHalf" && currentTime > morningLimit) {
          alert("For SecondHalf leave, you cannot Time In after 10:15 AM.");
          return;
        }
      }
    } else if (currentTime > morningLimit) {
      alert("The current time is after 09:30:00. You cannot Time In.");
      return;
    }
  
    const confirmation = window.confirm("Are you sure you want to Time In?");
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const { emp_code, name } = JSON.parse(storedUser);
          const url = `https://gully-ems.onrender.com/timein`;
  
          const requestData = {
            employeeCode: emp_code,
            employeeUsername: name,
          };
          const response = await axios.post(url, requestData);
          window.location.reload();
        } else {
          console.error("No user data found in localStorage.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
 
  const handleTimeOutClick = async () => {
    const now = new Date();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const targetTime = 18 * 3600 + 20 * 60; // 9:45:00 in seconds
    if (currentTime <= targetTime) {
      alert("The current time is before 06:20:00. You cannot Time Out.");
      return;
    }
    const confirmation = window.confirm("Are you sure you want to Time out?");
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/timeout`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakInOneClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-1 time in?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/teabreakIn`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakOutOneClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-1 Time Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/teabreakOut`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakInTwoClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-2  Time In  ?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/teabreakInTwo`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakOutTwoClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-2 Time Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/teabreakOutTwo`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakInThreeClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-3 Time In ?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/teabreakInThree`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakOutThreeClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-3 Time Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/teabreakOutThree`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleSmokingBreakClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Lunch Break Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/smokingbreak`;

        // Prepare data to send to the backend
        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleSmokingBreakInClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Lunch Break In?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://gully-ems.onrender.com/smokingbreakIn`;

        // Prepare data to send to the backend
        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

   const currentDate = new Date();
 const currentMonth = currentDate.toLocaleString("default", { month: "short" });

 const filteredFestivals = festivalData.filter(
   (festival) => festival.id === currentMonth
 );
  return (
    <div>
      {/* Card widget */}
     

      

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
        <Container className="timesheet-container p-0">
          <Row>
            <Col className="text-left">
              <h3 className="timesheet-title">Timesheet</h3>
            </Col>
          </Row>
          <Row className="justify-content-between align-items-left mb-3">
  <Col md={3} xs={6}>
    {/* Time In Button Logic */}
    {
      timesheetData.length === 0 ? (
        <div>
          <Button className="btn1" onClick={handleTimeInClick}>
            Time In
          </Button>
        </div>
      ) : (
        timesheetData.map((item, index) => {
          // Function to format the date to "YYYY-MM-DD"
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          };

          const formattedUserCurrentDate = formatDate(item.user_current_date);
{console.log(formattedUserCurrentDate,localDate,"554")}
          return (
            <React.Fragment key={index}>
              {formattedUserCurrentDate === localDate ? (
                <Button
                  className="btn2"
                  onClick={handleTimeInClick}
                  disabled // Add disabled attribute to disable the icon
                >
                  Time In
                </Button>
              ) : (
                <Button className="btn1" onClick={handleTimeInClick}>
                  Time In
                </Button>
              )}
            </React.Fragment>
          );
        })
      )
    }

    {/* Time Out Button Logic */}
    {
      timesheetData.length === 0 ? (
        <div>
          <Button className="btn1" onClick={handleTimeOutClick}>
            Time Out
          </Button>
        </div>
      ) : (
        timesheetData.map((item, index) => {
          // Function to format the date to "YYYY-MM-DD"
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          };

          const formattedUserCurrentDate = formatDate(item.user_current_date);

          return (
            <React.Fragment key={index}>
              {formattedUserCurrentDate === localDate && item.time_out != null ? (
                <Button
                  className="btn2"
                  onClick={handleTimeOutClick}
                  disabled // Add disabled attribute to disable the icon
                >
                  Time Out
                </Button>
              ) : (
                <Button className="btn1" onClick={handleTimeOutClick}>
                  Time Out
                </Button>
              )}
            </React.Fragment>
          );
        })
      )
    }
  </Col>
</Row>

        </Container>

        <Container className="timesheet-container p-5">
          <Row>
            <Col md={6} className="text-center">
              <h5 className="timesheet-subtitle">View timesheet</h5>
              {
  timesheetData.length === 0 ? (
    <p>No timesheet data available.</p>
  ) : (
    timesheetData.map((index) => (
      <div key={index}>
        <strong style={{ fontWeight: "600", color: "#230B54" }}>
          Time in :
        </strong>{" "}
        {index.time_in ? index.time_in.slice(11, 19)  : "Not Time in"}
        <br />
        <strong style={{ fontWeight: "600", color: "#230B54" }}>
          Time out :
        </strong>{" "}
        {index.time_out ? index.time_out.slice(11, 19)  : "Not Time out"}

      </div>
    ))
  )
}
            </Col>
          </Row>
        </Container>
      </div>

     

      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-3 xl:grid-cols-3">
        <div className="grid grid-cols-1 rounded-[20px]">
          <MiniCalendar />
        </div>
        


      </div>
    </div>
  );
};

export default Dashboard;
