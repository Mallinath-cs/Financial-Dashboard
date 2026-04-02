export const exportToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  const headers = ['Date', 'Category', 'Description', 'Type', 'Amount'];
  const csvRows = [headers.join(',')];

  transactions.forEach(transaction => {
    const row = [
      transaction.date,
      transaction.category,
      `"${transaction.description || ''}"`,
      transaction.type,
      transaction.amount.toFixed(2)
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};