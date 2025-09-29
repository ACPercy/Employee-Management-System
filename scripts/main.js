import { LoginManager } from "./managers/login-manager.js";
import { EmployeeController } from "./controllers/employee-controller.js";
import { UserController } from "./controllers/user-controller.js";
import { AdminController } from "./admin.js";
import "./adminseeder.js"; 

document.addEventListener("DOMContentLoaded", () => {
  // If login form exists → initialize LoginManager
  if (document.getElementById("login-form")) {
    new LoginManager();
  }

  // If employee section exists → initialize EmployeeController
  let employeeApp = null;
  if (document.getElementById("employee-section")) {
    employeeApp = new EmployeeController();
  }

  // If user section exists → initialize UserController
  let userApp = null;
  if (document.getElementById("user-section")) {
    userApp = new UserController();
  }

  // If admin dashboard exists → initialize AdminController
  if (document.querySelector(".main-dashboard")) {
    new AdminController({
      employeeController: employeeApp,
      userController: userApp
    });
  }
});

