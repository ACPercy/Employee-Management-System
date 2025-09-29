export class NavigationManager {
  redirectByRole(role) {
    const lowerRole = role.toLowerCase();

    if (lowerRole === "admin") {
      window.location.href = "admin.html";
    } else if (lowerRole === "manager") {
      window.location.href = "manager.html";
    } else if (lowerRole === "employee") {
      window.location.href = "employee.html";
    }
  }
}