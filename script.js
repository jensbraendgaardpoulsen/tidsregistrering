document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Globale variabler
    window.app = {
        calendarBody: document.getElementById('calendarBody'),
        currentMonthElement: document.getElementById('currentMonth'),
        registrationsTable: document.getElementById('registrationsTable'),
        currentDate: new Date(),
        selectedDates: [],
        registeredDates: new Set(),
        registrations: [],
        startDate: new Date().toISOString().split('T')[0]
    };

    const elements = {
        prevMonthButton: document.getElementById('prevMonth'),
        nextMonthButton: document.getElementById('nextMonth'),
        registrationForm: document.getElementById('registrationForm'),
        saveDataBtn: document.getElementById('saveDataBtn'),
        loadDataBtn: document.getElementById('loadDataBtn'),
        startDateInput: document.getElementById('startDate')
    };

    function initializeApp() {
        elements.startDateInput.value = window.app.startDate;
        setupEventListeners();
        updateCalendar();
        updateRegistrationsTable();
        updateFlexTime();
    }

    function setupEventListeners() {
        elements.startDateInput.addEventListener('change', handleStartDateChange);
        elements.prevMonthButton.addEventListener('click', handlePrevMonth);
        elements.nextMonthButton.addEventListener('click', handleNextMonth);
        window.app.calendarBody.addEventListener('click', handleCalendarClick);
        elements.registrationForm.addEventListener('submit', handleFormSubmit);
        window.app.registrationsTable.addEventListener('click', handleTableClick);
        elements.saveDataBtn.addEventListener('click', handleSaveData);
        elements.loadDataBtn.addEventListener('click', handleLoadData);
    }

    function handleStartDateChange() {
        window.app.startDate = this.value;
        updateFlexTime();
    }

    function handlePrevMonth() {
        window.app.currentDate.setMonth(window.app.currentDate.getMonth() - 1);
        updateCalendar();
    }

    function handleNextMonth() {
        window.app.currentDate.setMonth(window.app.currentDate.getMonth() + 1);
        updateCalendar();
    }

    function handleCalendarClick(e) {
        if (e.target.tagName === 'TD' && e.target.textContent) {
            toggleDateSelection(e.target);
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        if (window.app.selectedDates.length === 0) {
            alert('Vælg venligst mindst én dato for registrering.');
            return;
        }

        const formData = {
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            type: document.querySelector('input[name="registrationType"]:checked').value
        };

        const workTime = calculateWorkTime(formData.startTime, formData.endTime);

        const newRegistrations = window.app.selectedDates.map(date => ({
            date: date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            type: formData.type,
            workTime: workTime
        }));

        window.app.registrations = window.app.registrations.concat(newRegistrations);
        updateRegistrationsTable();
        this.reset();
        window.app.selectedDates = [];
        updateCalendar();
    }

    function handleTableClick(e) {
        if (e.target.classList.contains('delete-btn')) {
            deleteRegistration(e.target.dataset.index);
        }
    }

    initializeApp();
});