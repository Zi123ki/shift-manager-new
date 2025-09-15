// Export utilities for CSV and PDF generation
export async function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToPDF(data: any[], title: string, filename: string) {
  // This would use jsPDF and autotable
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();

  // Add Hebrew font support (would need to load font file)
  doc.setLanguage('he');

  // Add title
  doc.text(title, 20, 20);

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => item[header]));

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },
    });
  }

  doc.save(`${filename}.pdf`);
}

// Example usage functions
export const exportShifts = async (shifts: any[]) => {
  const processedData = shifts.map(shift => ({
    'שם משמרת': shift.name,
    'תאריך': shift.date,
    'שעת התחלה': shift.startTime,
    'שעת סיום': shift.endTime,
    'הערות': shift.notes || '',
  }));

  return {
    csv: () => exportToCSV(processedData, 'shifts'),
    pdf: () => exportToPDF(processedData, 'דוח משמרות', 'shifts-report'),
  };
};

export const exportEmployees = async (employees: any[]) => {
  const processedData = employees.map(employee => ({
    'שם מלא': employee.fullName,
    'דואר אלקטרוני': employee.email || '',
    'טלפון': employee.phone || '',
    'מחלקה': employee.department?.name || '',
    'סטטוס': employee.isActive ? 'פעיל' : 'לא פעיל',
  }));

  return {
    csv: () => exportToCSV(processedData, 'employees'),
    pdf: () => exportToPDF(processedData, 'דוח עובדים', 'employees-report'),
  };
};