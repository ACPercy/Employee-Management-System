export class SidebarProfileController {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Sidebar container with id "${containerId}" not found.`);
    }
  }

  render(user = null) {
    if (!user) {
      user = JSON.parse(localStorage.getItem("loggedInUser"));
    }
    if (!user || !this.container) return;

    const employeeProfile = document.getElementById("employee-profile-main-container");
    if (employeeProfile) employeeProfile.style.display = "none";

    const formatDate = (isoDate) => isoDate ? new Date(isoDate).toLocaleString() : "-";

    // Elements
    const profileImg = this.container.querySelector(".profile-icon");
    const profileContainer = this.container.querySelector(".profile-container");
    const profileDetails = this.container.querySelector(".profile-details");

    const displayName = this.container.querySelector("#profile-display-name");
    const displayRole = this.container.querySelector("#profile-display-role");
    const eidEl = this.container.querySelector("#profile-eid");
    const nameEl = this.container.querySelector("#profile-detail-name");
    const emailEl = this.container.querySelector("#profile-email");
    const departmentEl = this.container.querySelector("#profile-department");
    const roleEl = this.container.querySelector("#profile-detail-role");
    const positionEl = this.container.querySelector("#profile-position");
    const salaryEl = this.container.querySelector("#profile-salary");
    const managerEl = this.container.querySelector("#profile-manager");
    const statusEl = this.container.querySelector("#profile-status");
    const joinDateEl = this.container.querySelector("#profile-join-date");
    const lastLoginEl = this.container.querySelector("#profile-last-login");

    // Profile image
    profileImg.src = user.profilePicture || "images/profile.png";
    profileImg.style.cursor = "pointer";

    // Toggle enlarged image
    let showingImageOnly = false;
    profileImg.onclick = () => {
      if (!showingImageOnly) {
        [...profileContainer.children].forEach(child => {
          if (!child.classList.contains("profile-icon-container")) child.style.display = "none";
        });
        profileDetails.style.display = "none";
        profileImg.classList.add("enlarged");
        showingImageOnly = true;
      } else {
        [...profileContainer.children].forEach(child => {
          if (!child.classList.contains("profile-icon-container")) child.style.display = "";
        });
        profileDetails.style.display = "";
        profileImg.classList.remove("enlarged");
        showingImageOnly = false;
      }
    };

    // Populate sidebar display
    displayName.textContent = `${user.firstName} ${user.lastName}` || "-";
    displayRole.textContent = user.role || "-";

    // Populate detailed fields
    eidEl.textContent = user.eid || "-";
    nameEl.textContent = `${user.firstName} ${user.lastName}` || "-";
    emailEl.textContent = user.email || "-";
    departmentEl.textContent = user.department || "-";
    roleEl.textContent = user.role || "-";
    positionEl.textContent = user.position || "-";
    salaryEl.textContent = user.salary || "-";
    managerEl.textContent = user.manager || "-";
    statusEl.textContent = user.status || "-";
    joinDateEl.textContent = formatDate(user.joinDate);
    lastLoginEl.textContent = formatDate(user.lastLogin);
  }
}
