import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Pagination, Container, Spinner, Modal, Form,Row,Col } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { format, isAfter, set } from 'date-fns';
import { useNavigate, useLocation } from "react-router-dom";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { IoDocuments } from "react-icons/io5";
import {
  MdBarChart,
  MdDashboard,
  MdOutlineHolidayVillage,
} from "react-icons/md";
// import "../../../../src/assets/css/TimeinDetails.css";
import "../../../../src/assets/css/App.css";
import Widget from "components/widget/Widget";
const columnHelper = createColumnHelper();

function TimeInDetails() {
  const [users, setUser] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [profilesPerPage, setProfilesPerPage] = useState(15); // Initialize with a default value



  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      const admin = JSON.parse(storedUser);
      setUser(admin);
      
      fetchUserProfiles();
    fetchEmployees();
    }
  }, []);

  const fetchUserProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://gully-ems.onrender.com/timeinDetails");
      const sortedData = response.data.sort((a, b) => {
        // First, compare by date in descending order
        const dateComparison =
          new Date(b.user_current_date) - new Date(a.user_current_date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
  
        // Check if name exists before calling localeCompare
        const nameA = a.name || '';  // Default to empty string if 'name' is undefined
        const nameB = b.name || '';  // Default to empty string if 'name' is undefined
  
        // If dates are the same, compare alphabetically by name
        return nameA.localeCompare(nameB);
      });
  
      // Filter profiles based on today's date
      const today = new Date().toISOString().split("T")[0];
      const todayProfiles = sortedData.filter(
        (profile) => profile.user_current_date.split("T")[0] === today
      );
  
      // Update profilesPerPage dynamically
      const newProfilesPerPage =
        todayProfiles.length > 0 ? Math.min(15, todayProfiles.length) : 15;
      setProfilesPerPage(newProfilesPerPage);
  
      setUserProfiles(sortedData);
      setFilteredProfiles(sortedData);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
    setIsLoading(false);
  };
  
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://gully-ems.onrender.com/employees");
      // Sort employees alphabetically by name (ensure 'name' field exists)
      const sortedEmployees = response.data.sort((a, b) => {
        const nameA = a.name || '';  // Default to empty string if 'name' is undefined
        const nameB = b.name || '';  // Default to empty string if 'name' is undefined
        return nameA.localeCompare(nameB);
      });
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  

  const handleDateFilter = () => {
    let filtered = userProfiles;

    if (startDate && endDate) {
      filtered = filtered.filter((profile) => {
        const profileDate = new Date(profile.user_current_date);
        return (
          profileDate >= new Date(startDate) && profileDate <= new Date(endDate)
        );
      });
    }

    if (selectedEmployee) {
      filtered = filtered.filter(
        (profile) => profile.emp_code === selectedEmployee
      );
    }

    setFilteredProfiles(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const clearFilters = (e) => {
    e.preventDefault(); // Prevents the default form submission
    setStartDate("");
    setEndDate("");
    setSelectedEmployee("");
    setFilteredProfiles(userProfiles);
    setCurrentPage(1); // Reset to the first page
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(/\//g, "-");
  };

  const compareTime = (time1, time2) => {
    const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
    const [hours2, minutes2, seconds2] = time2.split(":").map(Number);
    return (
      new Date(0, 0, 0, hours1, minutes1, seconds1) >
      new Date(0, 0, 0, hours2, minutes2, seconds2)
    );
  };

  const getPaginatedProfiles = () => {
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    return filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  };

  const currentProfiles = getPaginatedProfiles();

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  const totalProfiles = filteredProfiles.length;
  for (let i = 1; i <= Math.ceil(totalProfiles / profilesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Card extra={"mt-5 w-full h-full sm:overflow-auto px-8"}>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6 2xl:grid-cols-6 6xl:grid-cols-6">
     
      </div>
        <header className="relative flex items-center text-center justify-between pt-4">
          {/* <div className="text-xl font-bold text-navy-700 dark:text-white">User Timein Table</div> */}
        </header>

        <div className="mt-0 overflow-x-scroll xl:overflow-x-scroll">
        

              {isLoading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="sr-only"></span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <table  className="mt-3">
                    <thead className="text-center">
                      <tr>
                        <th>Sn. no</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                       
                        {/* <th>Taking Break Time</th> */}
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {currentProfiles.map((profile, index) => (
                        <tr key={profile.emp_code + profile.user_current_date}>
                          <td data-label="Sn. No.">
                            {(currentPage - 1) * profilesPerPage + index + 1}
                          </td>{" "}
                          {/* Display serial number */}
                          {/* <td>{profile.emp_code}</td> */}
                          <td data-label="Name">{profile.username}</td>
                          <td data-label="Date">{formatDate(profile.user_current_date)}</td>
                          <td data-label="Time In">
                            {profile.time_in ? (
                              <span
                                style={{
                                  background: compareTime(
                                    profile.time_in,
                                    "10:15:00"
                                  )
                                    ? "#9A1B15"
                                    : "#52c41a",
                                  color: "white",
                                  padding: "3px",
                                  borderRadius: "3px",
                                }}
                              >
                                {profile.time_in ? profile.time_in.slice(11, 19)  : "Not Time in"}
                              </span>
                            ) : (
                              <span>--</span>
                            )}
                          </td>
                          <td data-label="Time Out">
                            {profile.time_out ? (
                              <span
                                style={{
                                  background: compareTime(
                                    profile.time_out,
                                    "15:27:00"
                                  )
                                    ? "#52c41a"
                                    : "#9A1B15",
                                  color: "white",
                                  padding: "3px",
                                  borderRadius: "3px",
                                }}
                              >
                                {profile.time_out ? profile.time_out.slice(11, 19)  : "Not Time out"}

                              </span>
                            ) : (
                              <span>--</span>
                            )}
                          </td>
                         
                         
                        </tr>
                      ))}
                    </tbody>
                  </table>

  
                </>
              )}
        </div>
      </Card>
     
      <Pagination className="mt-3">
                   

                    <Pagination.Item
                      onClick={() => paginate(1)}
                    >
                      1
                    </Pagination.Item>

                    {currentPage > 3 && <Pagination.Ellipsis disabled />}

                    {pageNumbers.map((number) => {
                      if (number > 1 && number < pageNumbers.length) {
                        if (
                          number >= currentPage - 1 &&
                          number <= currentPage + 1
                        ) {
                          return (
                            <Pagination.Item
                              key={number}
                              onClick={() => paginate(number)}
                            >
                              {number}
                            </Pagination.Item>
                          );
                        }
                      }
                      return null;
                    })}

                    {currentPage < pageNumbers.length - 2 && (
                      <Pagination.Ellipsis disabled />
                    )}

                    {pageNumbers.length > 1 && (
                      <Pagination.Item
                        // active={pageNumbers.length === currentPage}
                        onClick={() => paginate(pageNumbers.length)}
                      >
                        {pageNumbers.length}
                      </Pagination.Item>
                    )}
                   
                  </Pagination>

    </>
  );
}

export default TimeInDetails;