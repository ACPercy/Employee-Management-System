import { LoginManager } from "./managers/login-manager.js";
import { EmployeeManager } from "./managers/employee-manager.js";
import { EmployeeController } from "./controllers/employee-controller.js";
import { UserController } from "./controllers/user-controller.js";
import { AdminController } from "./admin.js";
import { SidebarProfileController } from "./controllers/sidebar-profile-controller.js";
import { EmployeeProfileController } from "./controllers/employee-profile-controller.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize login manager
  if (document.getElementById("login-form")) {
    new LoginManager();
  }

  const empManager = new EmployeeManager(); // one shared instance

  // Initialize EmployeeProfileController (for "view employee" section)
  let employeeProfileController = null;
  if (document.getElementById("employee-profile-main-container")) {
    employeeProfileController = new EmployeeProfileController(
      empManager,
      "employee-profile-main-container" // containerId for employee profile view
    );
  }

  // Initialize EmployeeController if section exists
  let employeeApp = null;
  if (document.getElementById("employee-section")) {
    // Create profile controller first
    const employeeProfileController = new EmployeeProfileController(
      empManager,
      "employee-profile-main-container" // containerId
    );
    // Pass both empManager and employeeProfileController
    employeeApp = new EmployeeController(empManager, employeeProfileController);
  }

  // Initialize UserController if section exists
  let userApp = null;
  if (document.getElementById("user-section")) {
    userApp = new UserController(empManager); // pass same instance
  }

  // Initialize AdminController if dashboard exists
  if (document.querySelector(".main-dashboard")) {
    const adminApp = new AdminController({
      employeeController: employeeApp,
      userController: userApp,
    });

    // Link controllers back to admin for dashboard refresh
    if (employeeApp) employeeApp.adminController = adminApp;
    if (userApp) userApp.adminController = adminApp;

    // Render sidebar profile for logged-in user
    const sidebarProfileController = new SidebarProfileController("profile-main-container");
    sidebarProfileController.render();
  }
});

