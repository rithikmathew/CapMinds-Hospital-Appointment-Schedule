document.addEventListener('DOMContentLoaded', () => {
    // --- 1. State & DOM Elements ---
    let currentDate = new Date(); // Automatically uses current date
    let currentDoctorFilter = 'All'; 
    
    const views = {
        calendar: document.getElementById('view-calendar'),
        dashboard: document.getElementById('view-dashboard')
    };
    const navBtns = {
        calendar: document.getElementById('nav-calendar'),
        dashboard: document.getElementById('nav-dashboard')
    };
    const modal = document.getElementById('appointment-modal');
    const form = document.getElementById('appointment-form');

    // --- 2. Data Management (localStorage) ---
    const STORAGE_KEY = 'capminds_appointments';

    function getAppointments() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function saveAppointment(apptData) {
        let appointments = getAppointments();
        if (apptData.id) {
            appointments = appointments.map(a => a.id === apptData.id ? apptData : a);
        } else {
            apptData.id = '_' + Math.random().toString(36).substr(2, 9);
            appointments.push(apptData);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    }

    function deleteAppointment(id) {
        let appointments = getAppointments();
        appointments = appointments.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    }

    // --- 3. View Switching & Sidebar Logic ---
    function switchView(viewName) {
        Object.keys(views).forEach(key => {
            views[key].classList.add('hidden');
            views[key].classList.remove('active');
            navBtns[key].classList.remove('active');
        });
        views[viewName].classList.remove('hidden');
        views[viewName].classList.add('active');
        navBtns[viewName].classList.add('active');
        
        if(viewName === 'calendar') renderCalendar();
        if(viewName === 'dashboard') renderDashboard();
    }

    navBtns.calendar.addEventListener('click', () => switchView('calendar'));
    navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));

    const sidebar = document.getElementById('app-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                sidebarToggle.innerHTML = '&raquo;';
                sidebarToggle.title = "Expand";
            } else {
                sidebarToggle.innerHTML = '&laquo;';
                sidebarToggle.title = "Collapse";
            }
        });
    }

    // --- 4. Modal & Form Logic with Validation ---
    
    // Function to validate mandatory fields as per Task Overview 
    function validateForm() {
        let isValid = true;
        const requiredFields = [
            { id: 'appt-patient', label: 'Patient Name' },
            { id: 'appt-doctor', label: 'Doctor Name' },
            { id: 'appt-hospital', label: 'Hospital Name' },
            { id: 'appt-specialty', label: 'Specialty' },
            { id: 'appt-date', label: 'Date' },
            { id: 'appt-time', label: 'Time' },
            { id: 'appt-reason', label: 'Reason' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const wrapper = input.closest('.input-with-icon');
            const container = input.closest('.input-group');

            // Reset previous error states
            if (container) container.classList.remove('has-error');
            if (wrapper) wrapper.classList.remove('error');
            if (input.tagName === 'TEXTAREA') input.style.borderColor = "var(--border)";

            // Validate if empty or just spaces
            if (!input.value || input.value.trim() === "") {
                isValid = false;
                if (container) container.classList.add('has-error');
                if (wrapper) {
                    wrapper.classList.add('error');
                } else if (input.tagName === 'TEXTAREA') {
                    input.style.borderColor = "var(--danger)";
                }
            }
        });

        return isValid;
    }

    document.getElementById('btn-book-appointment').addEventListener('click', () => {
        form.reset();
        document.getElementById('appt-id').value = ''; 
        // Clear any leftover validation styles
        form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        modal.classList.remove('hidden');
    });

    const closeModal = () => modal.classList.add('hidden');
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        // --- STEP 1: VALIDATE ---
        if (!validateForm()) {
            // Shake the modal for visual feedback
            const modalContent = document.querySelector('.modal-content');
            modalContent.classList.add('shake');
            setTimeout(() => modalContent.classList.remove('shake'), 400);
            return;
        }

        // --- STEP 2: SAVE ---
        const isEdit = document.getElementById('appt-id').value !== '';

        const newAppt = {
            id: document.getElementById('appt-id').value || null,
            patient: document.getElementById('appt-patient').value,
            doctor: document.getElementById('appt-doctor').value,
            hospital: document.getElementById('appt-hospital').value,
            specialty: document.getElementById('appt-specialty').value,
            date: document.getElementById('appt-date').value, 
            time: document.getElementById('appt-time').value,
            reason: document.getElementById('appt-reason').value
        };

        saveAppointment(newAppt);
        closeModal();
        renderCalendar();
        renderDashboard();
        
        showToastNotification(isEdit ? "Appointment updated successfully!" : "Appointment booked successfully!");
    });

    // Clear error states automatically as the user types
    form.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', () => {
            const container = element.closest('.input-group');
            const wrapper = element.closest('.input-with-icon');
            if (container) container.classList.remove('has-error');
            if (wrapper) wrapper.classList.remove('error');
        });
    });

    window.editAppt = function(id) {
        const appt = getAppointments().find(a => a.id === id);
        if (appt) {
            document.getElementById('appt-id').value = appt.id;
            document.getElementById('appt-patient').value = appt.patient;
            document.getElementById('appt-doctor').value = appt.doctor;
            document.getElementById('appt-hospital').value = appt.hospital;
            document.getElementById('appt-specialty').value = appt.specialty;
            document.getElementById('appt-date').value = appt.date;
            document.getElementById('appt-time').value = appt.time;
            document.getElementById('appt-reason').value = appt.reason;

            // Clear old validation errors before opening
            form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            
            modal.classList.remove('hidden');
        }
    };

    window.deleteAppt = function(id) {
        if(confirm("Delete this appointment?")) {
            deleteAppointment(id);
            renderDashboard();
            renderCalendar();
        }
    };

    // --- Success Popup Logic ---
    function showToastNotification(message) {
        const toast = document.getElementById('toast-notification');
        const toastMessage = toast.querySelector('.toast-message'); 
        
        if (message) {
            toastMessage.textContent = message;
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500); 
    }

    // --- 5. Calendar Render Logic ---
    function renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const monthDisplay = document.getElementById('current-month-display');
        const monthSelector = document.getElementById('month-selector'); 
        if (!grid) return;

        grid.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        monthDisplay.textContent = `${monthNames[month]} ${year}`; 
        
        if (monthSelector) monthSelector.value = month; 

        // Render Headers
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            grid.appendChild(header);
        });

        // Render Empty Start Cells
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-cell empty';
            grid.appendChild(emptyCell);
        }

        // Render Days & Appointments
        const allAppts = getAppointments();

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            const dateNum = document.createElement('div');
            dateNum.className = 'date-number';
            dateNum.textContent = day;
            
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dateNum.style.color = 'var(--primary)';
                dateNum.style.fontWeight = 'bold';
            }
            cell.appendChild(dateNum);

            const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            let daysAppts = allAppts.filter(a => a.date === checkDate);
            
            if (currentDoctorFilter !== 'All') {
                daysAppts = daysAppts.filter(a => a.doctor.includes(currentDoctorFilter) || currentDoctorFilter.includes(a.doctor));
            }
            
            daysAppts.forEach(appt => {
                const badge = document.createElement('div');
                badge.className = 'appt-badge';
                
                const timeParts = appt.time.split(':');
                const hours = parseInt(timeParts[0]);
                const ampm = hours >= 12 ? 'pm' : 'am';
                const displayHours = hours % 12 || 12;
                const formatTime = `${String(displayHours).padStart(2, '0')}:${timeParts[1]} ${ampm}`;

                badge.innerHTML = `
                    <span title="${appt.doctor}">👤 ${appt.patient} - ${formatTime}</span>
                    <div class="appt-icons">
                        <span onclick="window.editAppt('${appt.id}'); event.stopPropagation();" title="Edit">✏️</span>
                        <span style="color:var(--danger);" onclick="window.deleteAppt('${appt.id}'); event.stopPropagation();" title="Delete">🗑️</span>
                    </div>
                `;
                badge.onclick = () => window.editAppt(appt.id);
                cell.appendChild(badge);
            });

            grid.appendChild(cell);
        }
    }

    // Calendar Navigation Buttons
    document.getElementById('btn-prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('btn-next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('btn-today').addEventListener('click', () => {
        currentDate = new Date(); 
        renderCalendar();
    });

    const monthSelector = document.getElementById('month-selector');
    if (monthSelector) {
        monthSelector.addEventListener('change', (e) => {
            currentDate.setMonth(parseInt(e.target.value)); 
            renderCalendar();
        });
    }

    // --- Interactive Doctor Tabs Logic ---
    const docTabs = document.querySelectorAll('.doc-tab');
    if (docTabs.length > 0) {
        docTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                docTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                currentDoctorFilter = e.target.getAttribute('data-doctor');
                renderCalendar();
            });
        });
    }

    // --- 6. Dashboard Render Logic ---
    function renderDashboard(filteredData = null) {
        const tbody = document.getElementById('table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const appointments = filteredData || getAppointments();

        appointments.forEach(appt => {
            const timeParts = appt.time.split(':');
            const hours = parseInt(timeParts[0]);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const formatTime = `${String(displayHours).padStart(2, '0')}:${timeParts[1]} ${ampm}`;

            const tr = document.createElement('tr');
            // We add data-label so the mobile CSS knows what name to show for each card row
            tr.innerHTML = `
                <td data-label="Patient" class="text-blue">${appt.patient}</td>
                <td data-label="Doctor" class="text-blue">${appt.doctor}</td>
                <td data-label="Hospital">${appt.hospital}</td>
                <td data-label="Specialty">${appt.specialty}</td>
                <td data-label="Date">${appt.date}</td>
                <td data-label="Time" class="text-blue">${formatTime}</td>
                <td data-label="Actions" class="text-right">
                    <button class="action-btn" onclick="window.editAppt('${appt.id}')" title="Edit">✏️</button>
                    <button class="action-btn" style="color:var(--danger);" onclick="window.deleteAppt('${appt.id}')" title="Delete">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- 7. Dashboard Filter & Search Logic ---
    
    function applyDashboardFilters() {
        const pSearch = document.getElementById('search-patient').value.toLowerCase();
        const dSearch = document.getElementById('search-doctor').value.toLowerCase();
        const start = document.getElementById('filter-date-start').value;
        const end = document.getElementById('filter-date-end').value;

        let filtered = getAppointments();
        
        if(pSearch) {
            filtered = filtered.filter(a => a.patient.toLowerCase().includes(pSearch));
        }
        if(dSearch) {
            filtered = filtered.filter(a => a.doctor.toLowerCase().includes(dSearch));
        }
        if(start) {
            filtered = filtered.filter(a => a.date >= start);
        }
        if(end) {
            filtered = filtered.filter(a => a.date <= end);
        }

        renderDashboard(filtered);
    }

    const btnApplyFilters = document.getElementById('btn-apply-filters');
    if (btnApplyFilters) {
        btnApplyFilters.addEventListener('click', applyDashboardFilters);
    }

    const patientInput = document.getElementById('search-patient');
    const doctorInput = document.getElementById('search-doctor');

    if (patientInput) {
        patientInput.addEventListener('input', applyDashboardFilters);
    }
    if (doctorInput) {
        doctorInput.addEventListener('input', applyDashboardFilters);
    }

    const allFilterInputs = [patientInput, doctorInput, document.getElementById('filter-date-start'), document.getElementById('filter-date-end')];
    
    allFilterInputs.forEach(inputEl => {
        if (inputEl) {
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    applyDashboardFilters();
                }
            });
        }
    });

    // --- Initialize App ---
    renderCalendar();
    renderDashboard();
});