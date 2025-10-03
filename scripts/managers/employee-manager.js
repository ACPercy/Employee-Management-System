import { Employee } from "../models/employee.js";
import { BaseManager } from "./base-manager.js";

export class EmployeeManager extends BaseManager {
  constructor() {
    super("employees"); // storage key for localStorage
  }

  // Add employee (specialized for Employee objects)
  addEmployee(eid, firstName, lastName, email, department, position, role, salary, managerEid = null, joinDate = null) {
    const employees = this.getAll();

    // Auto-generate numeric internal ID
    const id = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;

    // Auto-generate EID if not provided
    const finalEid = eid || this.generateEID(firstName);

    // Auto-assign managerEid if employee role is not Manager
    if (role !== "Manager" && !managerEid) {
      const manager = employees.find(emp => emp.department === department && emp.role === "Manager");
      if (manager) managerEid = manager.eid;
    }

    // Managers do not have a managerEid
    if (role === "Manager") managerEid = null;

    const newEmployee = {
      id: Number(id),         // internal numeric ID
      eid: finalEid,          // employee ID (EID)
      firstName,
      lastName,
      email,
      department,
      position,
      role,
      salary,
      managerEid,             // store manager’s EID
      joinDate: joinDate || new Date().toISOString().split("T")[0]
    };

    employees.push(newEmployee);
    this.saveData(employees);
    return true;
  }


  // Auto-generate EID based on first name initial + number
  generateEID(firstName) {
    const initial = firstName.charAt(0).toUpperCase();
    const existing = this.getAll();

    // If initial is A, skip A001 because it's reserved for admin
    const sameInitial = existing.filter(emp => emp.eid && emp.eid.startsWith(initial));

    let maxNumber = 0;
    sameInitial.forEach(emp => {
      const num = parseInt(emp.eid.slice(1));
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    });

    let nextNumber = maxNumber + 1;

    if (initial === "A" && nextNumber === 1) {
      nextNumber = 2; 
    }

    return `${initial}${String(nextNumber).padStart(3, "0")}`;
  }

  updateEmployee(id, updatedData) {
    const employees = this.getAll();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return;

    // If role changed to Manager, clear managerEid
    if (updatedData.role === "Manager") updatedData.managerEid = null;

    // If role changed from Manager to Employee, auto-assign managerEid if missing
    if (updatedData.role !== "Manager" && !updatedData.managerEid) {
      const deptManager = employees.find(emp => emp.department === updatedData.department && emp.role === "Manager");
      if (deptManager) updatedData.managerEid = deptManager.eid;
    }

    employees[index] = { ...employees[index], ...updatedData };
    this.saveData(employees);
  }

  deleteEmployee(id) {
    const employees = this.getAll().filter(emp => Number(emp.id) !== Number(id));
    this.saveData(employees);
  }

  getById(id) {
    const employees = this.getAll();
    return employees.find(emp => Number(emp.id) === Number(id));
  }

  getNonAdminEmployees() {
    return this.getAll().filter(emp => emp.role !== "Admin");
  }
}