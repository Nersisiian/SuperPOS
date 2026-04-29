# 🛒 SuperPOS — Next-Gen Supermarket System

[![CI](https://github.com/YOUR_USERNAME/SuperPOS/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/SuperPOS/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

**Production-ready point-of-sale system with offline mode, barcode/QR scanning, analytics dashboard, and Docker support.**

![SuperPOS Dashboard](screenshots/dashboard.png)  *(добавишь скриншот позже)*

## 🚀 Features
- 🧾 **Cashier terminal** (React + Vite) with keyboard-emulated barcode/QR scanner
- 📊 **Admin panel** with product management and sales dashboard
- 📈 **Analytics**: daily revenue chart, top products, summary stats
- 📡 **Offline mode**: IndexedDB cache, auto-sync pending receipts
- 🎯 **Promo engine** (buy X get Y, percent discounts)
- 🐳 **Docker Compose** for one-command start
- ⚙️ **CI/CD** via GitHub Actions
- 🗃️ **SQLite** (better-sqlite3 / sql.js) – zero configuration

## 🏁 Quick Start
### With Docker
```bash
docker-compose up -d
API: http://localhost:3000

Cashier: http://localhost:5173

Admin: http://localhost:3001
# Terminal 1 – backend
cd backend && npm install && npm run start:dev

# Terminal 2 – pos client
cd pos-client && npm install && npm run dev

# Terminal 3 – admin panel
cd admin-panel && npm install && npm run dev
📚 Documentation
Architecture

API Reference

Hardware setup

🤝 Contributing
Pull requests are welcome. Please read CONTRIBUTING.md first.

📄 License
MIT License. See LICENSE for details.
