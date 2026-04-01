document.addEventListener('DOMContentLoaded', () => {
    const EMAILS_CSV = 'output/processed_emails.csv';
    const ENTITIES_CSV = 'output/extracted_entities.csv';

    let allEmails = [];
    let allEntities = [];

    // 1. Set current date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);

    // 2. Fetch and Parse CSVs
    Promise.all([
        fetchData(EMAILS_CSV),
        fetchData(ENTITIES_CSV)
    ]).then(([emails, entities]) => {
        if (!emails || emails.length === 0) {
            console.warn("No data found. Please run main.py first.");
            return;
        }
        
        allEmails = emails;
        allEntities = entities;

        renderOverview(emails, entities);
        renderTable(emails);
        renderEntities(entities);
        
        // Initialize Charts (from charts.js)
        if (typeof initCharts === 'function') {
            initCharts(emails);
        }

        // Setup Nav
        setupNavigation();
    });

    function setupNavigation() {
        const navItems = document.querySelectorAll('.sidebar nav li');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const view = item.getAttribute('data-view');
                handleViewChange(view);
            });
        });
    }

    function handleViewChange(view) {
        if (view === 'overview') {
            renderTable(allEmails);
            scrollToElement('.dashboard-header');
        } else if (view === 'analytics') {
            renderTable(allEmails);
            scrollToElement('.chart-container');
        } else if (view === 'leads') {
            const leads = allEmails.filter(e => e.category === 'Sales Lead');
            renderTable(leads);
            scrollToElement('.wide-card');
        } else if (view === 'invoices') {
            const invoices = allEmails.filter(e => e.category === 'Invoice');
            renderTable(invoices);
            scrollToElement('.wide-card');
        }
    }

    function scrollToElement(selector) {
        document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const csvText = await response.text();
            return new Promise((resolve) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => resolve(results.data)
                });
            });
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            return [];
        }
    }

    function renderOverview(emails, entities) {
        document.getElementById('stat-total').innerText = emails.length;
        const leads = emails.filter(e => e.category === 'Sales Lead').length;
        document.getElementById('stat-leads').innerText = leads;
    }

    function renderTable(emails) {
        const tbody = document.querySelector('#emailTable tbody');
        tbody.innerHTML = '';
        const displayList = emails.length > 20 && emails === allEmails ? emails.slice(0, 20) : emails;

        displayList.forEach(email => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="pulse"></div></td>
                <td><strong>${email.sender.split('<')[0].trim()}</strong></td>
                <td>${email.subject}</td>
                <td><span class="category-badge ${getBadgeClass(email.category)}">${email.category}</span></td>
                <td>${formatDate(email.date)}</td>
            `;
            tbody.appendChild(row);
        });

        if (displayList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No data found for this view.</td></tr>';
        }
    }

    function renderEntities(entities) {
        const feed = document.getElementById('entity-feed');
        feed.innerHTML = '';

        entities.slice(0, 15).forEach(item => {
            const keys = Object.keys(item).filter(k => k !== 'email_id' && item[k] !== 'N/A');
            if (keys.length === 0) return;

            const card = document.createElement('div');
            card.className = 'entity-group glass';
            card.style.padding = '1rem';
            card.style.marginBottom = '0.8rem';
            card.style.borderRadius = '12px';
            card.style.fontSize = '0.85rem';

            let html = `<p style="color: var(--text-secondary); margin-bottom: 0.4rem;">ID: ${item.email_id}</p>`;
            keys.forEach(k => {
                html += `<div style="display: flex; justify-content: space-between;">
                            <span style="text-transform: capitalize;">${k.replace('_', ' ')}</span>
                            <span style="color: var(--accent-blue); font-weight: 600;">${item[k]}</span>
                         </div>`;
            });
            card.innerHTML = html;
            feed.appendChild(card);
        });
    }

    function getBadgeClass(cat) {
        const map = {
            'Sales Lead': 'badge-lead',
            'Support': 'badge-support',
            'Invoice': 'badge-invoice',
            'HR': 'badge-hr',
            'Internal': 'badge-internal',
            'Spam': 'badge-spam'
        };
        return map[cat] || 'badge-internal';
    }

    function formatDate(dateStr) {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) { return dateStr; }
    }
});
