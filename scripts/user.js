// User class
class User {
  constructor(role, username, password) {
    this.role = role; // "Admin", "Manager", or "Employee"
    this.username = username;
    this.password = password;
  }
}

// Employee Manager class
class UserManager {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];

    // If no users exist, create a default Admin
    if (this.users.length === 0) {
      const defaultAdmin = new User("Admin", "admin", "adminpass123");
      this.users.push(defaultAdmin);
      this.saveUsers();
    }

    this.loginForm = document.getElementById("loginForm");
    this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
  }

  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  createUser(role, username, password) {
    // Only Admin can add users
    const user = new User(role, username, password);
    this.users.push(user);
    this.saveUsers();
  }

  handleLogin(e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = this.users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      alert(`Welcome ${user.username}`);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      this.redirectByRole(user.role);
    } else {
      alert("Invalid credentials! Try again.");
    }
  }

  redirectByRole(role) {
    if (role === "Admin") {
      // Show admin dashboard
      window.location.href = "admin.html"; 
    }
  }
}

const userManager = new UserManager();

function logout() {
  localStorage.removeItem("loggedInUser"); // clear session
  window.location.href = "index.html"; // go back to login page
}