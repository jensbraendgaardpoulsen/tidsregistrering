function updateFlexTime() {
    const start = new Date(window.app.startDate);
    const today = new Date();
    let totalWorkTime = 0;
    let totalExpectedTime = 0;

    for (let currentDate = new Date(start); currentDate <= today; currentDate.setDate(currentDate.getDate() + 1)) {
        if (isWeekday(currentDate) && !isDanishHoliday(currentDate)) {
            totalExpectedTime += 7.4;
        }
    }

    window.app.registrations.forEach(reg => {
        const regDate = new Date(reg.date);
        if (regDate >= start && regDate <= today) {
            totalWorkTime += (reg.type === 'arbejde') ? reg.workTime : 7.4;
        }
    });

    const flexTime = totalWorkTime - totalExpectedTime;
    const formattedFlexTime = formatTimeToHoursAndMinutes(Math.abs(flexTime));
    const sign = flexTime < 0 ? '-' : '+';
    
    document.getElementById('flexTime').textContent = `${sign}${formattedFlexTime}`;
}

function isWeekday(date) {
    const day = date.getDay();
    return day !== 0 && day !== 6;
}

function isDanishHoliday(date) {
    // Implementer logik for danske helligdage her
    return false;
}

function calculateFlexTime(actual, expected) {
    return actual - expected;
}