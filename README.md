# Capminds Hospital Appointment Scheduling App

A professional, high-performance, and "gorgeous" medical appointment scheduling prototype. This application is built using **Vanilla JavaScript**, focusing on clean code, responsive design, and a seamless user experience across Mobile, Tablet, and Desktop devices.

**Developed by:** Rithik Mathew

---

## 🚀 Live Demo & Repository
*   **Live Deployment:** [Insert your Netlify/Vercel Link Here]
*   **GitHub Repository:** [Insert your GitHub Link Here]

---

## ✨ Core Features

### 📅 Advanced Calendar View
*   **Dynamic Rendering:** Automatically displays the current month and year upon loading.
*   **Hybrid Mobile View:** On mobile devices, the calendar switches to a "Dot Indicator" mode. Tapping a day reveals a beautiful appointment list below the grid.
*   **Doctor Filtering:** Interactive tabs to filter appointments by specific doctors in real-time.
*   **Navigation:** Quickly jump between months or return to "Today."

### 🗂️ Practice Dashboard
*   **Smart Desktop View:** A clean, organized table for large screens.
*   **Card-Based Mobile View:** The table automatically transforms into elegant cards on smaller screens for better readability.
*   **Powerful Search:** Three-way search functionality (Real-time as you type, Enter key, or manual Update button).
*   **Filter System:** Search by Patient Name, Doctor Name, or a specific Date Range.

### 📝 Appointment Management
*   **Validation:** Strict form validation for all mandatory fields (Patient, Doctor, Hospital, Specialty, Date, Time, and Reason).
*   **Error Handling:** Visual error states (red highlighting) and physical feedback (shake animation) on invalid submission.
*   **Data Persistence:** Uses `localStorage` to save, edit, and delete appointments without needing a database.
*   **Success Notifications:** Sleek green "Toast" popups for successful bookings and updates.

### 📱 Fully Responsive Design
*   **Desktop/Laptop:** Sidebar navigation and wide data grids.
*   **Mobile:** Bottom app-bar navigation and card-based layout for a native app feel.

---

## 🛠️ Technology Stack
*   **HTML5:** Semantic structure and `<datalist>` for searchable inputs.
*   **CSS3:** Custom properties (variables), Flexbox, Grid, and Keyframe animations.
*   **JavaScript (ES6+):** Pure Vanilla JS (No frameworks/libraries) for all logic and DOM manipulation.
*   **Storage:** Browser LocalStorage API.

---

## 📂 Project Structure
```text
CAPMINDS-APPOINTMENT-APP/
├── assets/
│   └── frame.png          # Logo Asset
├── css/
│   └── styles.css         # Main stylesheet with Responsive Design
├── js/
│   └── app.js             # Consolidated logic (Validation, Calendar, Dashboard)
├── index.html             # Main entry point
└── README.md              # Documentation