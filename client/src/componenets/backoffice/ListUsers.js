import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import SideNav from "./SideNav";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import './listUsers.css'
function ListUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    // Add form fields based on your user schema
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    loginCount:0,
    subscriptionType: "Free", // Default subscription type
  });
  useEffect(() => {
    // Fetch user data from the API
    axios
      .get("http://localhost:5000/api/users/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  const handleEditClick = (user) => {
    setEditingUser(user);
    // Update the form data with the selected user's details
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      loginCount: user.loginCount,
      subscriptionType: user.subscriptionType || "Free",

    });
  };
  const handleDeleteClick = (userId) => {
    // Make an API call to delete the user
    axios
      .delete(`http://localhost:5000/api/users/users/${userId}`)
      .then((response) => {
        // Handle successful deletion
        console.log(response.data.message);
        // Update the local state to reflect the deletion
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };
  const handleDeleteSubmit =() =>{

  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();

    // Make an API call to update the user
    axios
      .put(`http://localhost:5000/api/users/users/${editingUser._id}`, formData)
      .then((response) => {
        // Update the local state with the edited user
        const updatedUsers = users.map((user) =>
          user._id === editingUser._id ? response.data : user
        );
        setUsers(updatedUsers);
        // Close the modal or perform any other necessary actions
        // Reset the editingUser and formData state
        setEditingUser(null);
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          subscriptionType: "Free",
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (<>
    <Helmet>
    <meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
<title>Bootstrap CRUD Data Table for Database with Modal Form</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round"/>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
<script>
          {`
            $(document).ready(function(){
              $('[data-toggle="tooltip"]').tooltip();
              var checkbox = $('table.custom-table tbody input[type="checkbox"]');
              $("#selectAll").click(function(){
                if(this.checked){
                  checkbox.each(function(){
                    this.checked = true;                        
                  });
                } else {
                  checkbox.each(function(){
                    this.checked = false;                        
                  });
                }
              });
              checkbox.click(function(){
                if(!this.checked){
                  $("#selectAll").prop("checked", false);
                }
              });
            });
          `}
        </script>
      </Helmet>
      <div className="wrapper">
        <Header />
        <div className="App">
          {/* Content Wrapper. Contains page content */}
          <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0">Users List</h1>
                  </div>
                  {/* /.col */}
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item">
                        <a href="http://localhost:3000/admin">Admin dashboard</a>
                      </li>
                      <li className="breadcrumb-item active">Users List</li>
                    </ol>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.container-fluid */}
            </div>
            {/* /.content-header */}
            {/* Main content */}
            <section className="content">
              <div className="container-fluid">
                {/* Small boxes (Stat box) */}
                
                {/* /.row */}
                {/* Main row */}
                <div className="row">
                <div className="body custom-body">
  <div className="container-xl">
    <div className="table-responsive custom-table-responsive">
      <div className="table-wrapper custom-table-wrapper">
        <div className="table-title custom-table-title">
          <div className="row">
            <div className="col-sm-6">
              <h2>Manage <b>Users</b></h2>
            </div>
            <div className="col-sm-6">
              <a href="#addEmployeeModal" className="btn btn-success" data-toggle="modal"><i className="material-icons"></i> <span>Add New User</span></a>
              <a href="#deleteEmployeeModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons"></i> <span>Delete</span></a>						
            </div>
          </div>
        </div>
        <table className="table custom-table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <span className="custom-checkbox custom-custom-checkbox">
                  <input type="checkbox" id="selectAll" />
                  <label htmlFor="selectAll" />
                </span>
              </th>
              <th>Username</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Login count</th>
              <th>Subscription Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {users.map((user) => (
    <tr key={user._id}>
      <td>
        <span className="custom-checkbox custom-custom-checkbox">
          <input type="checkbox" id={`checkbox${user._id}`} name="options[]" value={user._id} />
          <label htmlFor={`checkbox${user._id}`} />
        </span>
      </td>
      <td>{user.username}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td>{user.loginCount}</td>
      <td>{user.subscriptionType}</td>
      <td>
        <a href="#editEmployeeModal" className="edit" data-toggle="modal"onClick={() => handleEditClick(user)}>
          <i className="material-icons" data-toggle="tooltip" title="Edit"></i>
        </a>
        <a href="#deleteEmployeeModal" className="delete" data-toggle="modal" >
          <i className="material-icons" data-toggle="tooltip" title="Delete"></i>
        </a>
      </td>
    </tr>
  ))}
</tbody>
        </table>
        <div className="clearfix">
          <div className="hint-text custom-hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
          <ul className="pagination custom-pagination">
            <li className="page-item disabled"><a href="#">Previous</a></li>
            <li className="page-item"><a href="#" className="page-link">1</a></li>
            <li className="page-item"><a href="#" className="page-link">2</a></li>
            <li className="page-item active"><a href="#" className="page-link">3</a></li>
            <li className="page-item"><a href="#" className="page-link">4</a></li>
            <li className="page-item"><a href="#" className="page-link">5</a></li>
            <li className="page-item"><a href="#" className="page-link">Next</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  {/* Edit Modal HTML */}
  <div id="addEmployeeModal" className="modal custom-modal fade">
    <div className="modal-dialog">
      <div className="modal-content">
        <form>
          <div className="modal-header">						
            <h4 className="modal-title">Add Employee</h4>
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
          </div>
          <div className="modal-body">					
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-control" required defaultValue={""} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" className="form-control" required />
            </div>					
          </div>
          <div className="modal-footer">
            <input type="button" className="btn btn-default" data-dismiss="modal" defaultValue="Cancel" />
            <input type="submit" className="btn btn-success" defaultValue="Add" />
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* Edit Modal HTML */}
  <div id="editEmployeeModal" className="modal custom-modal fade">
    <div className="modal-dialog">
      <div className="modal-content">
      <form onSubmit={handleEditFormSubmit}>
          <div className="modal-body">
            {/* Add form fields based on your user schema */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Subscription Type</label>
              <select
                className="form-control"
                value={formData.subscriptionType}
                onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value })}
              >
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <input type="button" className="btn btn-default" data-dismiss="modal" defaultValue="Cancel" />
            <input type="submit" className="btn btn-info" defaultValue="Save" />
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* Delete Modal HTML */}
  <div id="deleteEmployeeModal" className="modal custom-modal fade">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">						
        <h4 className="modal-title">Delete Employee</h4>
        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
      </div>
      <div className="modal-body">					
        <p>Are you sure you want to delete these Records?</p>
        <p className="text-warning"><small>This action cannot be undone.</small></p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
        <button
  type="button"
  className="btn btn-danger"
  onClick={() => {
    handleDeleteClick(editingUser._id);
    // Close the modal after deletion if needed
    document.getElementById('deleteEmployeeModal').style.display = 'none';
  }}
>
  Delete
</button>      </div>
    </div>
  </div>
</div>
</div>

                </div>
                {/* /.row (main row) */}
              </div>
              {/* /.container-fluid */}
            </section>
            {/* /.content */}
          </div>
        </div>
        <SideNav />
        
        <Footer/>

      </div>
      </>
    
  );
}

export default ListUsers;
