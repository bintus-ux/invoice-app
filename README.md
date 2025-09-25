# 📄 Invoicing App

A Vue 3 + Vite project implementing an **Invoice Management App** with authentication, a mock backend, and **real-time updates via WebSockets**.

Built as part of the **Frontend Engineer Selection Task – Youverify (Sept 2025)**.

---

## 🚀 Features

- User Authentication (Firebase)
- Create & Update Invoices
- Real-time sync with **Socket.IO**
- Activity Timeline (logs invoice changes)
- **Browser Notifications** → Make sure to allow notifications in Chrome (or your browser) when prompted
- Responsive UI (Figma design)
- Error handling for invalid routes & network issues
- Unit + Integration tests (Jest)

---

## 🛠 Tech Stack

- Vue 3 + Vite + TypeScript
- Pinia (state management)
- Socket.IO (real-time updates)
- Firebase (authentication)
- TailwindCSS (styling)
- Vitest + Vue Test Utils (testing)

---

## ⚙️ Setup

```bash
# Clone repository
git clone https://github.com/yourusername/invoicing-app.git
cd invoicing-app

# Install dependencies
npm install

# Run frontend + mock socket server together
npm run dev:with-socket

# Or run separately
npm run dev          # Vue frontend
npm run mock-server  # Mock socket backend

# Run tests
npm run test
```

Assumptions
	1.	Dashboard Design
The provided design only includes the invoice UI. No design specifications are provided for the dashboard. Therefore, the dashboard page displays the necessary components by default upon mounting, without any additional styling or layout assumptions beyond the invoice UI.
	2.	Authentication Flow
	•	Users who are not authenticated are redirected to the /login page.
	•	Upon successful login, users are redirected directly to the /invoice page instead of the dashboard. This decision is based on the absence of a dashboard design and to ensure immediate access to the primary functionality (invoice management).
	3.	Page Mounting Behavior
	•	On mounting the app, the system checks the authentication state.
	•	Unauthenticated users see the login page, and authenticated users see the invoice page directly.
