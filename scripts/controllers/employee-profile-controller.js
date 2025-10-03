export class EmployeeProfileController {
  constructor(employeeManager, containerId) {
    this.employeeManager = employeeManager; // EmployeeManager instance
    this.employeeContainer = document.getElementById(containerId); // Employee profile container
  }

  // Employee Profile
  renderEmployee(employeeEid) {
    const employee = this.employeeManager.getAll().find(emp => emp.eid === employeeEid);
    if (!employee || !this.employeeContainer) return;

    const formatDate = (isoDate) => isoDate ? new Date(isoDate).toLocaleString() : "-";

    // Manager: find by managerId
    let managerName = "-";
    if (employee.managerId) {
      const manager = this.employeeManager.getAll().find(emp => emp.eid === employee.managerId);
      if (manager) {
        managerName = `${manager.firstName} ${manager.lastName}`;
      }
    }

    const profileImg = this.employeeContainer.querySelector(".employee-profile-icon");
    const profileContainer = this.employeeContainer.querySelector(".employee-profile-container");
    const profileDetails = this.employeeContainer.querySelector(".employee-profile-details");
    const container = this.employeeContainer.querySelector(".employee-profile-icon-container");

    profileImg.src = employee.profilePicture || "images/profile.png";
    profileImg.style.cursor = "pointer";

    // Toggle enlarged picture for employee profile
    let showingImageOnly = false;
    profileImg.onclick = () => {
      if (!showingImageOnly) {
        [...profileContainer.children].forEach(child => {
          if (!child.classList.contains("employee-profile-icon-container")) child.style.display = "none";
        });
        profileDetails.style.display = "none";
        container.classList.add("enlarged");
        showingImageOnly = true;
      } else {
        [...profileContainer.children].forEach(child => {
          if (!child.classList.contains("employee-profile-icon-container")) child.style.display = "";
        });
        profileDetails.style.display = "";
        container.classList.remove("enlarged");
        showingImageOnly = false;
      }
    };

    // Populate employee profile fields
    this.employeeContainer.querySelector("#employee-profile-eid").textContent = employee.eid;
    this.employeeContainer.querySelector("#employee-profile-detail-name").textContent = `${employee.firstName} ${employee.lastName}`;
    this.employeeContainer.querySelector("#employee-profile-email").textContent = employee.email;
    this.employeeContainer.querySelector("#employee-profile-department").textContent = employee.department;
    this.employeeContainer.querySelector("#employee-profile-detail-role").textContent = employee.role;
    this.employeeContainer.querySelector("#employee-profile-position").textContent = employee.position;
    this.employeeContainer.querySelector("#employee-profile-salary").textContent = employee.salary;
    this.employeeContainer.querySelector("#employee-profile-manager").textContent = managerName; 
    this.employeeContainer.querySelector("#employee-profile-status").textContent = employee.status || "-";
    this.employeeContainer.querySelector("#employee-profile-join-date").textContent = formatDate(employee.joinDate);
    this.employeeContainer.querySelector("#employee-profile-last-login").textContent = formatDate(employee.lastLogin);

    this.employeeContainer.querySelector("#employee-profile-display-name").textContent = `${employee.firstName} ${employee.lastName}`;
    this.employeeContainer.querySelector("#employee-profile-display-role").textContent = employee.role;
  }
}
