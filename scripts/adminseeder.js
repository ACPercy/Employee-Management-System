import { User } from "./models/user.js";

export class AdminSeeder {
  constructor(userManager, employeeManager) {
    this.userManager = userManager;
    this.employeeManager = employeeManager;
  }

  seedDefaultAdmin() {

    const users = this.userManager.getAll();
    const adminExists = users.some(u => u.role.toLowerCase() === "admin");

    if (!adminExists) {
      // Create User object for login
      const defaultAdmin = {
        id: 1,
        eid: "A001",
        firstName: "Percy",
        lastName: "Perseus",
        email: "admin@example.com",
        department: "System Administration",
        position: "System Administrator",
        role: "Admin",
        salary: 30000,
        username: "admin",
        password: "admin123",
        mustChangePassword: false,
        status: "Active"
      };
      // Add to user storage
      this.userManager.add(defaultAdmin);

      // Add to employee storage
      this.employeeManager.addEmployee(
        defaultAdmin.eid,
        defaultAdmin.firstName,
        defaultAdmin.lastName,
        defaultAdmin.email,
        defaultAdmin.department,
        defaultAdmin.position,
        defaultAdmin.role,
        defaultAdmin.salary,
        defaultAdmin.id
      );
    }
  }
}
