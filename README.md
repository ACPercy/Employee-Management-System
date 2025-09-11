# Employee Management System

A simple **Employee Management System** built with **HTML, CSS, and JavaScript**.  
This project demonstrates the use of **Object-Oriented Programming (OOP)** concepts and **DOM manipulation** to manage employees dynamically in a web application.

---

## 🌐 Live Demo
🔗 [View Live Project](https://acpercy.github.io/Employee-Management-System/)

---

## 🚀 Features
- Add new employees with details: Employee ID, Name, Email, Department, and Salary
- Auto-generate unique Employee IDs (first letter of employee’s name + incrementing number, e.g., P0001)
- Store and retrieve employee data using Local Storage (for now)
- View employee details in a dynamic, interactive table
- Edit and delete employee records 
- Basic form validation (check correct input for email, salary, etc.)
- Sort employees by EID, Name, Email, Department, or Salary
- Search and filter employees by name, department, or other fields (planned feature)
- User-friendly interface with simple, clean styling

---

## 🛠️ Technologies Used
- **HTML5** – Structure of the web app  
- **CSS3** – Styling and layout  
- **JavaScript (ES6+)** – Logic, DOM manipulation, OOP principles  

---

## 📌 About OOP & DOM Manipulation
- **OOP (Object-Oriented Programming):**  
  - `Employee` class: Represents an employee object with attributes like EID, name, email, department, and salary.  
  - `EmployeeManager` class: Handles adding, deleting, sorting, and managing employee records.  

- **DOM Manipulation:**  
  - Dynamically updates the table when employees are added, edited, or deleted.  
  - Uses event listeners for form submission, sorting columns, and actions on employees.  

---

## 🗺️ Project Roadmap
- PHASE 1: Basic Frontend + Local Storage
- [x] Create an HTML form to add employee details (Employee ID, Name, Email, Department, Salary)
- [x] Show the employee list in a table
- [x] Add buttons: Edit and Delete
- [x] Store/retrieve employees in Local Storage (browser)
- PHASE 2: Add More Features
- [x] Basic form validation for correct input format (email, salary)
- [x] Auto-increment unique EID (first letter of employee’s name + unique incrementing number, e.g., P0001)
- [x] Sort employees by EID / Name / Email / Department / Salary
- [ ] Search/filter employees by name, department, or other fields
- PHASE 3: Authentication & Role-Based Login
- [ ] Add a Login Page with roles:
      • Admin – Full access (add, edit, delete, manage users)
      •	Manager – Limited access (view, edit team members only)
      •	Employee – View own profile/details only
- [ ] Store login credentials in Local Storage 
- [ ] Redirect users to different dashboards based on role

---

## 🚀 Future Improvements
In future iterations of this project, the following enhancements can be added:
- Database Integration – Replace Local Storage with a relational database (e.g., MySQL or PostgreSQL) for more reliable data persistence.
- Backend Development – Implement a backend using Java (Spring Boot) or Node.js/Express to handle server-side logic.
- User & Role Management – Store user accounts and roles in database tables (Employees, Users, Roles) for scalable authentication and authorization.
- RESTful APIs – Create secure CRUD APIs (Create, Read, Update, Delete) for managing employees and user data.
- Deployment – Host the application online with a connected database, making it production-ready.

---

## 📂 Project Structure
Employee-Management-System/
│── index.html
│── styles/
│   └── style.css
│── scripts/
    └── script.js

---

## 👩‍💻 Author
Developed by **[ACPercy](https://github.com/ACPercy)** as a practice project to explore JavaScript OOP and DOM manipulation.  
