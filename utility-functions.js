function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('da-DK', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
}

function formatTimeToHoursAndMinutes(time) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}