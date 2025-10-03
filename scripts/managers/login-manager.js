import { UserManager } from "./user-manager.js";
import { EmployeeManager } from "./employee-manager.js";
import { NavigationManager } from "./navigation-manager.js";

export class LoginManager {
  constructor() {
    this.employeeManager = new EmployeeManager();
    this.userManager = new UserManager(this.employeeManager);
    this.navigation = new NavigationManager();

    this.currentUser = null;
    this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;

    this.defaultAdmin();
    this.bindEvents();
  }

  bindEvents() {
    const loginForm = document.getElementById("login-form");
    const changePasswordForm = document.getElementById("change-password-form");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", (e) => this.handleChangePassword(e));
    }
  }

  defaultAdmin() {
    const users = this.userManager.getAll();
    const adminExists = users.some(u => u.username === "admin");

    if (!adminExists) {
      // Add admin to UserManager 
      this.userManager.addUser(
        "A001",       // EID
        "admin",        // username
        "admin123",     // default password
        "Admin",        // role
        false,          // mustChangePassword
        null            // tempPassword
      );
    }
  }

  handleLogin(e) {
    e.preventDefault();

    const role = document.getElementById("role").value.trim();
    const username = document.getElementById("current-username").value.trim();
    const password = document.getElementById("current-password").value.trim();

    const user = this.userManager.findUser(role, username, password);

    if (!user) {
      alert("Invalid credentials! Try again.");
      return;
    }

    this.currentUser = user;

    // Update lastLogin timestamp
    const now = new Date().toISOString(); // full timestamp
    user.lastLogin = now;
    this.userManager.updateUser(user);
    
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.mustChangePassword) {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("change-password-section").style.display = "block";
    } else {
      this.navigation.redirectByRole(user.role);
    }
  }

  handleChangePassword(e) {
    e.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.currentUser.password = newPassword;
    this.currentUser.mustChangePassword = false;
    this.userManager.updateUser(this.currentUser);

    alert("Password updated successfully! Please log in again.");
    window.location.reload();
  }
}