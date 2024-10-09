function convertToCSV(data) {
    const headers = ['date', 'startTime', 'endTime', 'type', 'workTime'];
    const rows = data.map(reg => headers.map(header => reg[header]).join(','));
    return [headers.join(','), ...rows].join('\n');
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    const requiredHeaders = ['date', 'startTime', 'endTime', 'type', 'workTime'];
    
    if (!requiredHeaders.every(header => headers.includes(header))) {
        throw new Error('CSV-filen mangler nødvendige kolonner.');
    }

    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        return headers.reduce((entry, header, index) => {
            entry[header] = values[index];
            return entry;
        }, {});
    });
}

async function handleSaveData() {
    const csvContent = convertToCSV(window.app.registrations);
    
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                types: [{ description: 'CSV Files', accept: {'text/csv': ['.csv']} }],
                suggestedName: 'registrations.csv'
            });
            const writable = await handle.createWritable();
            await writable.write(csvContent);
            await writable.close();
            alert('Data er gemt i registrations.csv.');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Fejl ved gemning af fil:', err);
                alert('Der opstod en fejl ved gemning af filen. Prøv igen.');
            }
        }
    } else if (confirm('Din browser understøtter ikke filsystem-adgang. Vil du gemme filen i din downloads-mappe?')) {
        fallbackSaveMethod(csvContent);
    }
}

function fallbackSaveMethod(csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "registrations.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Data er gemt i din downloads-mappe som registrations.csv.');
    } else {
        alert('Din browser understøtter ikke direkte filgemning. Prøv venligst en anden browser.');
    }
}

function handleLoadData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const parsedData = parseCSV(e.target.result);
                window.app.registrations = parsedData.map(reg => ({
                    ...reg,
                    workTime: parseFloat(reg.workTime)
                }));
                updateRegistrationsTable();
                updateFlexTime();
                alert('Data er indlæst fra CSV-filen.');
            } catch (error) {
                alert(error.message);
            }
        };
        reader.readAsText(file);
    };
    fileInput.click();
}