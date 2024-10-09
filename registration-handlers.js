function updateRegistrationsTable() {
    const tbody = window.app.registrationsTable.querySelector('tbody');
    tbody.innerHTML = '';
    window.app.registrations.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentWeek = null;
    let weekTotal = 0;
    let weekExpected = 0;

    window.app.registrations.forEach((reg, index) => {
        const regDate = new Date(reg.date);
        const weekNumber = getWeekNumber(regDate);

        if (weekNumber !== currentWeek) {
            if (currentWeek !== null) {
                insertWeekTotalRow(tbody, currentWeek, weekTotal, weekExpected);
            }
            currentWeek = weekNumber;
            weekTotal = 0;
            weekExpected = 37;
        }

        weekTotal += reg.workTime;
        const dailyFlex = reg.type === 'arbejde' ? calculateFlexTime(reg.workTime, 7.4) : 0;

        const row = createRegistrationRow(reg, index, dailyFlex);
        tbody.appendChild(row);
    });

    if (currentWeek !== null) {
        insertWeekTotalRow(tbody, currentWeek, weekTotal, weekExpected);
    }

    window.app.registeredDates = new Set(window.app.registrations.map(reg => reg.date));
    updateCalendar();
    updateFlexTime();
}

function createRegistrationRow(reg, index, dailyFlex) {
    const row = document.createElement('tr');
    const regDate = new Date(reg.date);
    const dayName = regDate.toLocaleDateString('da-DK', { weekday: 'long' });
    row.innerHTML = `
        <td>${formatDate(reg.date)}, ${dayName}</td>
        <td>${reg.startTime}</td>
        <td>${reg.endTime}</td>
        <td>${reg.type}</td>
        <td>${formatTimeToHoursAndMinutes(reg.workTime)}</td>
        <td>7:24</td>
        <td>${formatTimeToHoursAndMinutes(dailyFlex)}</td>
        <td><button class="delete-btn" data-index="${index}">Slet</button></td>
    `;
    return row;
}

function deleteRegistration(index) {
    window.app.registrations.splice(index, 1);
    updateRegistrationsTable();
    updateFlexTime();
}

function calculateWorkTime(start, end) {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    let workMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (workMinutes < 0) workMinutes += 24 * 60;
    
    return workMinutes / 60;
}

function insertWeekTotalRow(tbody, weekNumber, total, expected) {
    const row = document.createElement('tr');
    row.classList.add('week-total');
    const flex = calculateFlexTime(total, expected);
    const flexFormatted = formatTimeToHoursAndMinutes(Math.abs(flex));
    const flexSign = flex < 0 ? '-' : '+';
    row.innerHTML = `
        <td colspan="4">Uge ${weekNumber} total</td>
        <td>${formatTimeToHoursAndMinutes(total)}</td>
        <td>${formatTimeToHoursAndMinutes(expected)}</td>
        <td>${flexSign}${flexFormatted}</td>
        <td></td>
    `;
    tbody.appendChild(row);
}