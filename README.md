# new chron

A visual autobiography of your emotional journey. Every square holds a memory, every color tells a story.

**new chron** is a minimalist, year-long journaling app that transforms your daily moods, goals, and reflections into a stunning visual timeline. It's built for introspection, tracking emotional patterns, and owning your personal narrative.

---

## ✨ Features

### 📅 Visual Calendar
- Year-long mood calendar with color-coded days
- Organized by quadrimesters (4 sections of the year)
- Instantly visualize your emotional patterns

### 💭 Daily Journaling
- Log your daily mood: Great, Good, Okay, Hard, or Nightmare
- Write reflections across custom categories (Work, Personal, Learning, Health, + more)
- Plan events and track daily goals
- View future dates for planning

### 🎯 Goal Tracking
- Set daily goals and check them off as you progress
- Edit or delete goals seamlessly
- Track accomplishments alongside mood logging

### 📌 Custom Categories
- Define custom review categories beyond the defaults
- Organize your thoughts the way that makes sense to you

### 💾 Data Privacy
- Your data stays on your personal server (Firebase Firestore)
- Export full backups as JSON
- Import previous backups anytime
- No cloud tracking or analytics

### 🎨 Beautiful Design
- Dark, minimal aesthetic with accent colors
- Smooth animations and transitions
- Responsive design for desktop and tablet
- Motivational GIF banner that updates daily

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Firebase account for Firestore setup

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GIPHY_API_KEY=your_giphy_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

---

## 🛠️ Build & Deploy

### Build for production:
```bash
npm run build
```

### Preview the production build:
```bash
npm run preview
```

### Lint code:
```bash
npm run lint
```

---

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── DayModal.jsx    # Daily journal entry modal
│   ├── DayTile.jsx     # Individual day tile in calendar
│   ├── EventsSection.jsx
│   ├── Footer.jsx
│   ├── GoalSidebar.jsx
│   ├── Header.jsx
│   ├── MonthGrid.jsx   # Monthly calendar grid
│   └── ...
├── contexts/           # React context for auth
│   └── AuthContext.jsx
├── lib/                # Utilities and API
│   ├── api.js          # Firebase API calls
│   ├── constants.js    # Mood legend and configurations
│   ├── dateUtils.js    # Date and calendar utilities
│   └── firebase.js     # Firebase initialization
├── pages/              # Page components
│   ├── HomePage.jsx    # Main dashboard
│   ├── LandingPage.jsx # Public landing page
│   ├── LoginPage.jsx   # Authentication
│   └── SettingsPage.jsx
├── App.jsx             # Main app router
├── main.jsx           # Entry point
└── index.css          # Global styles
```

---

## 🎨 Mood Legend

Your emotional journey is captured in colors:

- **Great** 🟢 - An excellent day
- **Good** 🟡 - A positive day
- **Okay** 🟠 - A neutral day
- **Hard** 🔴 - A challenging day
- **Nightmare** 💀 - A very difficult day
- **No Entry** ⬜ - Day not logged

---

## 🔐 Authentication

- **Email/Password Sign Up:** Create a new account
- **Email/Password Login:** Access your existing account
- **Session Persistence:** Stay logged in across sessions
- **Sign Out:** Securely log out anytime

---

## 📊 Data Structure

### Days Collection
```json
{
  "dateKey": "2026-03-06",
  "legend": "great",
  "timestamp": 1709740800000
}
```

### Reviews Collection
```json
{
  "dateKey": "2026-03-06",
  "category": "work",
  "content": "Had a productive day shipping the new feature."
}
```

### Goals Collection
```json
{
  "dateKey": "2026-03-06",
  "id": "goal_123",
  "title": "Exercise 30 minutes",
  "completed": true
}
```

### Events Collection
```json
{
  "dateKey": "2026-03-06",
  "id": "event_123",
  "title": "Team meeting",
  "description": "Q1 planning session",
  "color": "#22D3EE"
}
```

---

## ⚙️ Settings

- **Profile:** Customize your name
- **Custom Categories:** Add your own review categories
- **Data Management:** Export and import backups
- **Journaling Time:** Set the preferred time to open day modal (auto-opens at this time)

---

## 🎯 Keyboard Shortcuts

- **Esc:** Close modals
- **Enter:** Save entry (in modal)
- **Enter:** Submit category (in settings)

---

## 🖼️ Responsive Design

The app is optimized for:
- **Desktop:** Full featured experience with calendar grid
- **Tablet:** Responsive calendar layout
- **Mobile:** Single column layout (recommended to use desktop for better experience)

---

## 🐛 Known Issues & Improvements

- GIF modal is being improved for better visual appeal
- Initial mobile experience can be optimized
- Additional animation enhancements in progress

---

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **firebase** - Backend and authentication
- **react-hot-toast** - Toast notifications
- **lucide-react** - Icons
- **tailwindcss** - Utility CSS
- **framer-motion** - Animations

---

## 👨‍💻 Development

### Local Development
```bash
npm run dev
```
Runs the dev server with HMR enabled.

### Code Quality
```bash
npm run lint
```
Runs ESLint to check code quality.

---

## 📝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is personal and built with care. Feel free to use it for your own journaling.

---

## 🙏 Acknowledgments

Inspired by [Archivist](https://archivist.ramx.in/) by [@ramxcodes](https://x.com/ramxcodes)

Built with ❤️ by [Kavya](https://x.com/goelsahhab) and [Ishan](https://x.com/ishankumax)

---

## 📞 Support

For issues, questions, or suggestions, please reach out or check the project repository.

---

**Start journaling. Own your story. 📖✨**
