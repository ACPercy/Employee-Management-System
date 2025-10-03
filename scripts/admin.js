import { EmployeeManager } from "./managers/employee-manager.js";
import { EmployeeController } from "./controllers/employee-controller.js";
import { UserController } from "./controllers/user-controller.js";
import { AdminHomeController } from "./controllers/admin-home-controller.js";
import { SidebarProfileController } from "./controllers/sidebar-profile-controller.js";
import { EmployeeProfileController } from "./controllers/employee-profile-controller.js";

export class AdminController {
  constructor({ employeeController, userController }) {
    this.employeeController = employeeController;
    this.userController = userController;
    
    // EmployeeProfileController for employee profiles (from table)
    this.employeeProfileController = new EmployeeProfileController(
      this.employeeController.empManager,
      "employee-profile-main-container" // separate container for employee profiles
    );

    // Sidebar profile controller (for logged-in user)
    this.sidebarProfileController = new SidebarProfileController("profile-main-container");

    // Create Home/Dashboard controller
    this.homeController = new AdminHomeController({
      employeeController: this.employeeController,
      userController: this.userController,
    });

    // link back
    this.employeeController.adminController = this;
    this.userController.adminController = this;
    
    // Cache DOM elements
    this.cacheDOM();

    // Bind events
    this.bindEvents();

    // Render sidebar profile for logged-in user
    this.sidebarProfileController.render();

    // Default view
    this.showSection("dashboard"); // optional
  }

  cacheDOM() {
    // Sidebar / navigation
    this.dashboardLabel = document.querySelector(".dashboard-label");
    this.dashboardNav = document.getElementById("admin-dashboard");
    this.employeeNav = document.getElementById("employee-records");
    this.userNav = document.getElementById("user-accounts");
    this.profileNav = document.getElementById("profile-link");
    this.logoutNav = document.getElementById("logout");

    // Dashboard sections
    this.dashboardSection = document.getElementById("home-dashboard-section");
    this.employeeSection = document.getElementById("employee-section");
    this.userSection = document.getElementById("user-section");
    this.profileSection = document.getElementById("profile-section");
  }
   
  bindEvents() {
    this.dashboardNav.addEventListener("click", () => this.showSection("dashboard"));
    this.employeeNav.addEventListener("click", () => this.showSection("employee"));
    this.userNav.addEventListener("click", () => this.showSection("user"));
    this.profileNav.addEventListener("click", () => this.showSection("profile"));
    this.logoutNav.addEventListener("click", () => this.logout());
  }

  showSection(section, selectedEmployeeEid = null) {
    // Hide all sections
    this.dashboardSection.style.display = "none";
    this.employeeSection.style.display = "none";
    this.userSection.style.display = "none";
    this.profileSection.style.display = "none";
    // Add other sections if needed

    // Hide employee profile always
    const employeeProfile = document.getElementById("employee-profile-main-container");
    if (employeeProfile) employeeProfile.style.display = "none";

    // Reset nav active classes
    this.dashboardNav.classList.remove("active");
    this.employeeNav.classList.remove("active");
    this.userNav.classList.remove("active");
    this.profileNav.classList.remove("active");

    // Show selected section
    switch (section) {
      case "employee":
        this.employeeSection.style.display = "block";
        this.employeeNav.classList.add("active");
      break;
      case "user":
        this.userSection.style.display = "block";
        this.userNav.classList.add("active");
      break;
      case "profile":
        this.profileSection.style.display = "block";
        this.profileNav.classList.add("active");

        // Render sidebar/admin profile
        this.sidebarProfileController.render();
      break;
      default:
        // Dashboard home
        this.dashboardSection.style.display = "block";
        this.dashboardNav.classList.add("active");
        this.homeController.render();
      break;
    }
  }

  logout() {
    // Handle logout logic
    alert("Logging out...");
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  }
}

