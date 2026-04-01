# 🛡️ MailSentry Insight™ | Enterprise Email Intelligence Suite

MailSentry Insight™ is an advanced, automated email analytics engine that transforms raw inbox data into actionable business intelligence. Designed with a **Stitch-inspired Premium Web Dashboard**, it enables users to categorize and visualize complex communications with ease.

## 🚀 Vision
Built for operations, sales, and support teams to overcome "Inbox Overload" by automatically classifying emails and extracting high-value structured entities.

---

## 🎨 Premium Dashboard Features
The suite features a **Stitch-Edition Web Interface** that provides:
- **📊 Interactive Analytics**: Real-time category distribution and volume trend visualization.
- **🤝 Sales Intelligence**: Filtered leads identifying new revenue opportunities.
- **💰 Finance Hub**: Clear visibility into invoices, payments, and billing events.
- **🔍 Entity Hub**: Automated extraction of Phone Numbers, Order IDs, and Currency data.

---

## 🛠️ Technical Implementation
### Core Technologies
- **Python (Intelligence Engine)**: Modular backend using `imaplib`, `pandas`, and `re`.
- **HTML5/CSS3 (Dashboard)**: Featuring **Glassmorphism** and responsive dark-mode aesthetics.
- **JavaScript (Data Layer)**: Asynchronous CSV ingestion and interactive charting via **Chart.js**.

### Security & Robustness
- **IMAP + App Passwords**: Secure, 2FA-compliant communication with Gmail.
- **Modular Design**: Decoupling connection, processing, and visualization for maintainability.
- **Error Resilience**: Designed to skip malformed data without interrupting the intelligence pipeline.

---

## 🏗️ Getting Started
### 1. Configuration
Update your `config.json` with your credentials:
```json
{
    "email": "your_email@gmail.com",
    "app_password": "xxxx xxxx xxxx xxxx",
    "imap_server": "imap.gmail.com"
}
```

### 2. Run Engine
Execute the processing layer to fetch and analyze your latest inbox data:
```bash
python main.py
```

### 3. Launch Dashboard
Start the local server and visualize your insights:
```bash
python run_dashboard.py
```

---
> [!IMPORTANT]
> This project was developed as a case study in **Advanced Agentic Coding** and modern AI-driven software design.
