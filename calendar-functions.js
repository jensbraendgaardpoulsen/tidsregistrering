function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = (firstDay.getDay() + 6) % 7;

    window.app.currentMonthElement.textContent = `${firstDay.toLocaleString('da-DK', { month: 'long' })} ${year}`;

    let calendarHTML = '';
    for (let i = 0, date = 1; i < 6; i++) {
        let row = '<tr>';
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < startingDay) || date > daysInMonth) {
                row += '<td></td>';
            } else {
                const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                const classes = [
                    (j === 5 || j === 6) ? 'weekend' : '',
                    window.app.selectedDates.includes(formattedDate) ? 'selected' : '',
                    window.app.registeredDates.has(formattedDate) ? 'registered' : ''
                ].filter(Boolean).join(' ');
                
                row += `<td class="${classes}" data-date="${formattedDate}">${date}</td>`;
                date++;
            }
        }
        calendarHTML += row + '</tr>';
        if (date > daysInMonth) break;
    }

    window.app.calendarBody.innerHTML = calendarHTML;
}

function updateCalendar() {
    generateCalendar(window.app.currentDate.getFullYear(), window.app.currentDate.getMonth());
}

function toggleDateSelection(cell) {
    const selectedDate = cell.dataset.date;
    const index = window.app.selectedDates.indexOf(selectedDate);

    if (index > -1) {
        window.app.selectedDates.splice(index, 1);
        cell.classList.remove('selected');
    } else {
        window.app.selectedDates.push(selectedDate);
        cell.classList.add('selected');
    }
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}