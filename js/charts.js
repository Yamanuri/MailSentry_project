/**
 * Chart Initialization for MailSentry Dashboard
 * Uses Chart.js for premium web visualizations.
 */

function initCharts(emails) {
    if (!emails || emails.length === 0) return;

    // 1. Data Preparation for Category Chart
    const categories = ['Sales Lead', 'Support', 'Invoice', 'HR', 'Internal', 'Spam'];
    const counts = categories.map(cat => emails.filter(e => e.category === cat).length);

    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(0, 132, 255, 0.6)',   // Sales Lead
                    'rgba(255, 107, 107, 0.6)', // Support
                    'rgba(0, 210, 132, 0.6)',   // Invoice
                    'rgba(156, 39, 176, 0.6)',  // HR
                    'rgba(153, 170, 181, 0.6)', // Internal
                    'rgba(255, 212, 59, 0.6)'    // Spam
                ],
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#99aab5', font: { family: 'Inter', size: 10 } }
                }
            },
            cutout: '70%'
        }
    });

    // 2. Data Preparation for Volume Chart (Last 7 Days)
    const dailyVolume = processVolumeData(emails);
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    
    new Chart(volumeCtx, {
        type: 'line',
        data: {
            labels: dailyVolume.labels,
            datasets: [{
                label: 'Email Volume',
                data: dailyVolume.counts,
                fill: true,
                backgroundColor: 'rgba(0, 132, 255, 0.1)',
                borderColor: '#0084ff',
                tension: 0.4,
                pointBackgroundColor: '#0084ff',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#99aab5' } },
                x: { grid: { display: false }, ticks: { color: '#99aab5' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function processVolumeData(emails) {
    // Basic day-over-day count logic
    const countsByDate = {};
    emails.forEach(email => {
        try {
            const date = new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            countsByDate[date] = (countsByDate[date] || 0) + 1;
        } catch (e) {}
    });

    const labels = Object.keys(countsByDate).reverse().slice(0, 7).reverse();
    const counts = labels.map(l => countsByDate[l]);
    
    return { labels, counts };
}
