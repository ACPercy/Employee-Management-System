// Only run if admin.html is loaded
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || loggedInUser.role !== "Admin") {
    alert("Access denied! Login as Admin.");
    window.location.href = "index.html";
    return;
  }

  let activeManager; // can be UserManager or EmployeeManager

  // Sidebar links
  const manageEmployees = document.getElementById("manageEmployees");
  const manageUsers = document.getElementById("manageUsers");

  // Switch to employee management
  const activateEmployees = () => {
    activeManager = new EmployeeManager();
    // Show employee UI
    document.getElementById("employeeSection").style.display = "block";
    document.getElementById("userSection").style.display = "none";
  };

  // Switch to user management
  const activateUsers = () => {
    activeManager = new UserManager();
    // Show user UI
    document.getElementById("employeeSection").style.display = "none";
    document.getElementById("userSection").style.display = "block";
  };

  // Bind events
  manageEmployees.addEventListener("click", (e) => {
    e.preventDefault();
    activateEmployees();
  });

  manageUsers.addEventListener("click", (e) => {
    e.preventDefault();
    activateUsers();
  });

  // Default view (employees first, for example)
  activateEmployees();
});