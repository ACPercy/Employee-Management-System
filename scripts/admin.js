import { EmployeeController } from "./controllers/employee-controller.js";
import { UserController } from "./controllers/user-controller.js";

export class AdminController {
  constructor({ employeeController, userController }) {
    this.employeeController = employeeController;
    this.userController = userController;

    // Cache DOM elements
    this.cacheDOM();

    // Bind events
    this.bindEvents();

    // Default view
    this.showSection("dashboard"); // optional
  }

  cacheDOM() {
    // Sidebar / navigation
    this.dashboardLabel = document.querySelector(".dashboard-label");
    this.dashboardNav = document.getElementById("admin-dashboard");
    this.employeeNav = document.getElementById("employee-records");
    this.userNav = document.getElementById("user-accounts");
    this.logoutNav = document.getElementById("logout");

    // Dashboard sections
    this.employeeSection = document.getElementById("employee-section");
    this.userSection = document.getElementById("user-section");
  }
   
  bindEvents() {
    this.dashboardNav.addEventListener("click", () => this.showSection("dashboard"));
    this.employeeNav.addEventListener("click", () => this.showSection("employee"));
    this.userNav.addEventListener("click", () => this.showSection("user"));
    this.logoutNav.addEventListener("click", () => this.logout());
  }

  showSection(section) {
    // Hide all sections
    //this.dashboardSection.style.display = "none";
    this.employeeSection.style.display = "none";
    this.userSection.style.display = "none";
    // Add other sections if needed

    // Reset nav active classes
    //this.dashboardNav.classList.remove("active");
    this.employeeNav.classList.remove("active");
    this.userNav.classList.remove("active");

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
      default:
        // Dashboard home
        //this.dashboardSection.style.display = "block";
        //this.dashboardNav.classList.add("active");
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

