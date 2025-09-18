// User class
class User {
  constructor(userid, role, username, password) {
    this.userid = userid;
    this.role = role; // "Admin", "Manager", or "Employee"
    this.username = username;
    this.password = password;
  }
}

// Login Manager class
class LoginManager {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;

    // Create default Admin if none exist
    if (this.users.length === 0) {
      const defaultAdmin = new User(1, "Admin", "admin", "adminpass123");
      this.users.push(defaultAdmin);
      this.saveUsers();
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }
  }

  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }

  handleLogin(e) {
    e.preventDefault();

    const role = document.getElementById("role").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = this.users.find(
      (u) => u.username === username && u.password === password && u.role.toLowerCase() === role.toLowerCase()
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

  logout() {
  localStorage.removeItem("loggedInUser"); // clear session
  window.location.href = "index.html"; // go back to login page
  }
}

const loginManager = new LoginManager();

