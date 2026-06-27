# VitalPath Mobile App - Personal Health Navigation System

This is the mobile application frontend for **VitalPath**, a preventive healthcare platform that continuously tracks lifestyle behaviors, medical histories, and health reports to predict health scores and recommend personalized actions.

The app is built using **React Native** and **Expo SDK 56**, enabling a cross-platform (iOS & Android) experience with native performance and rich animations.

---

## 1. Features & Integrations

The app serves as the user-facing interface for the VitalPath ecosystem, connecting with the VitalPath backend to provide:

*   **Secure Authentication**:
    *   Social Authentication via **Google Sign-In** and **Apple Sign-In**.
    *   OTP verification flows and secure JWT session persistence using `expo-secure-store`.
*   **Health Tracking & Analytics**:
    *   Activity, sleep, weight, and blood pressure trackers.
    *   Interactive maps for tracking outdoor activities using `react-native-maps` and `expo-location`.
*   **Medical Reports & OCR**:
    *   Upload health/lab reports (PDFs or images) using `expo-document-picker` and `expo-image-picker`.
*   **Speech & Voice Input**:
    *   Voice memo transcription and translation via `expo-av` audio recording.
*   **Chronological Health Timeline**:
    *   Searchable and filterable history of all user health events, logs, and medical records.
*   **Visual Health Metrics & Scores**:
    *   Visual representation of the Overall Health Score (0-100) and Biological Age.
*   **Push Notifications**:
    *   Real-time notifications and alerts powered by `expo-notifications`.
*   **Rich Micro-interactions**:
    *   Immersive state transitions and animations powered by `lottie-react-native`.

---

## 2. Tech Stack

*   **Framework**: Expo (SDK 56) & React Native.
*   **Navigation**: React Navigation v7 (`@react-navigation/native` & `@react-navigation/native-stack`).
*   **Sensors & Core APIs**:
    *   Location tracking: `expo-location`
    *   Audio recording: `expo-av`
    *   Secure Storage: `expo-secure-store`
    *   Pickers: `expo-image-picker`, `expo-document-picker`, `@react-native-community/datetimepicker`
*   **UI & Visuals**:
    *   Maps: `react-native-maps`
    *   Animations: `lottie-react-native`
    *   Icons/Fonts: `expo-font`

---

## 3. Directory Structure

Recommended/standard directory structure for the app:

```text
app/
├── assets/                    # Static assets (images, icons, fonts, animations)
├── src/                       # Application source code
│   ├── components/            # Reusable UI components (buttons, inputs, cards)
│   ├── screens/               # Screen components (Dashboard, Timeline, Tracking, Profile, Auth)
│   ├── navigation/            # Navigation routers and stack configurations
│   ├── services/              # API clients, local storage handlers, and integration layer
│   ├── hooks/                 # Custom React hooks (useAuth, useLocation, etc.)
│   ├── context/               # Global state contexts (AuthContext, ThemeContext)
│   └── utils/                 # Helper functions and constants
├── App.js                     # Root component and navigation container provider
├── app.json                   # Expo configuration file
├── package.json               # Project dependencies and script shortcuts
└── README.md                  # App documentation
```

---

## 4. Local Setup & Running

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [Expo Go](https://expo.dev/client) app installed on your physical device, or an Android/iOS emulator configured on your development machine.

### Installation

1.  Navigate to the app folder:
    ```bash
    cd app
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Run the App

Start the Expo Development Server:
```bash
npm start
```

Once the dev server is running, you can:
*   Press **`a`** to open in the Android emulator.
*   Press **`i`** to open in the iOS simulator.
*   Scan the QR code printed in the terminal using your physical device's camera (iOS) or the Expo Go app (Android).

---

## 5. Connecting to the Backend

By default, the app expects to communicate with the VitalPath backend. 

*   **Development Link**: Update your API client settings (to be configured in `src/services/api.js` or similar) to point to your local development backend server:
    *   **iOS Simulator**: `http://localhost:8000`
    *   **Android Emulator**: `http://10.0.2.2:8000` (Android's alias to the host loopback)
    *   **Physical Device**: Use your computer's local IP address (e.g., `http://192.168.x.x:8000`), ensuring both your computer and phone are on the same Wi-Fi network.
