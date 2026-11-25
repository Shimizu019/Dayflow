# Dayflow

**An Offline-First Personal Management Android Application**

Dayflow is a personal management application designed to help users organize their daily activities, manage finances, track savings, and stay productive. It prioritizes offline functionality, local data storage, privacy, and a simple user experience.

## 1. Project Overview

Dayflow is designed to work without requiring:
- An internet connection.
- User registration or online accounts.
- A backend server.
- Cloud databases or synchronization.

All personal information is stored locally on the user's Android device.

## 2. Technology Stack

### Frontend and UI

| Technology | Purpose |
|---|---|
| React 19 | Application UI development |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and build tool |
| Tailwind CSS 4 | Responsive UI styling |
| Lucide React | Icon library |
| React Router | Application navigation |
| Recharts | Charts and data visualization |

### State Management

| Technology | Purpose |
|---|---|
| Zustand 5 | Global application state management |
| Zustand Persist Middleware | Persistence of selected non-sensitive preferences |

Planned Zustand stores:
- `useAppStore` — General application state.
- `useAuthStore` — Authentication and lock status.
- `useWalletStore` — Wallet-related state.
- `useSavingsStore` — Savings-related state.
- `useTasksStore` — Task-related state.
- `useScheduleStore` — Schedule-related state.

SQLite remains the source of truth for persistent application records. Zustand is not the primary database.

### Android Development

| Technology | Purpose |
|---|---|
| Capacitor | Package the React application as an Android app |
| Capacitor Android | Native Android integration |
| Android Studio | Android development, emulator, and debugging |
| Gradle | Android build system |

### Local Database and Storage

| Technology | Purpose |
|---|---|
| SQLite | Primary local database |
| Capacitor SQLite Plugin | SQLite integration with the Android application |
| SQL | Database queries and management |
| Capacitor Preferences | Lightweight application settings |

### Security and Authentication

| Technology | Purpose |
|---|---|
| Argon2id | Password-based key derivation |
| Android Keystore | Protection of encryption keys |
| AES-256-GCM | Encryption and integrity protection |
| Local Authentication Service | Password setup, verification, locking, and password changes |

Security requirements:
- First launch requires the user to create a password.
- Subsequent launches require the password to unlock Dayflow.
- Password input must be masked.
- Changing the password requires verification of the current password.
- Actual passwords must never be stored.
- The application must start in a locked state after a fresh launch.
- Sensitive information must be encrypted at rest.
- A recovery-key mechanism must be designed for forgotten passwords.

### Development Tools

| Tool | Purpose |
|---|---|
| Visual Studio Code | Main code editor |
| Android Studio | Android emulator and debugging |
| Git | Version control |
| GitHub | Source-code repository |
| Chrome DevTools | Frontend debugging |
| Cline / Cursor | AI-assisted development |

## 3. Core Application Features

The planned application includes:

| Feature | Description |
|---|---|
| Dashboard | Overview of personal activities and important information |
| My Wallet | Manage wallet balances and daily expenses |
| Savings | Create and monitor savings goals |
| Tasks | Organize and track daily tasks |
| Schedule | Manage personal schedules and activities |
| Local Password Lock | Protect access to the application |
| Settings | Manage application preferences and security settings |

## 4. Application Architecture

The application follows a local-first architecture.

```text
Dayflow
│
├── Frontend
│   ├── React 19
│   ├── TypeScript
│   ├── Tailwind CSS 4
│   ├── React Router
│   ├── Lucide React
│   └── Recharts
│
├── State Management
│   └── Zustand 5
│
├── Android Integration
│   └── Capacitor
│
├── Local Database
│   └── SQLite
│
└── Security Layer
    ├── Argon2id
    ├── Android Keystore
    └── AES-256-GCM
```

## 5. Project Requirements

- Android application.
- Responsive interface supporting different Android screen sizes.
- Offline-first functionality.
- Local database storage.
- Local password authentication.
- Encrypted sensitive information.
- No backend server.
- No online account registration.
- No mandatory internet connection.
- No cloud synchronization.

## 6. Important Architectural Decisions

1. React and Tailwind CSS will remain the frontend foundation.
2. Capacitor will package the existing React application for Android.
3. Zustand 5 will manage application state.
4. SQLite will handle persistent application data.
5. The security layer will operate separately from Zustand.
6. Passwords and encryption keys must never be stored as ordinary application state.
7. Core application features must remain functional without internet access.
8. The application must not depend on external servers to access locally stored information.

## 7. Development Status

**Current phase:** Technology Stack and Architecture Planning

The current React and Tailwind CSS implementation serves as the proof of concept. The production Android application will build upon this foundation by integrating Capacitor, SQLite, and the security architecture.

---

**Project Name:** Dayflow  
**Platform:** Android  
**Architecture:** Offline-First / Local-First  
**Backend:** None  
**Database:** SQLite  
**State Management:** Zustand 5  
**Frontend:** React + TypeScript + Tailwind CSS
