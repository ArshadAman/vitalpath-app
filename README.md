# VitalPath Mobile App – Personal Health Navigation System Client

This is the mobile frontend client for **VitalPath**, built using **React Native** and **Expo**. It provides the primary user interfaces for tracking lifestyle logs, parsing medical reports, translating voice journal notes, visualizing health trajectories, and tracking fitness goals.

---

## 1. Tech Stack & Library Integrations

This app is built on **Expo SDK 56**. The following libraries are integrated to cover the SRS requirements:

*   **Authentication (Module 1)**:
    *   `@react-native-google-signin/google-signin`: Native Google Sign-In SDK integration.
    *   `expo-apple-authentication`: Apple Sign-In support.
    *   `expo-secure-store`: Encrypted local keychain/keystore to safely persist access tokens.
*   **Timeline View & Filtering (Module 3)**:
    *   `@react-native-community/datetimepicker`: Modal picker to filter timeline events by date range.
*   **Medical Report Management (Module 4)**:
    *   `expo-document-picker`: Document selector to upload PDF files from device storage.
    *   `expo-image-picker`: Gallery/camera selector to capture report page screenshots.
*   **Lifestyle Tracking (Module 5)**:
    *   `@react-native-async-storage/async-storage`: Local key-value database for data caching.
*   **Voice Health Journal (Module 6)**:
    *   `expo-av`: Native audio recorder interface for capturing voice journal notes.
*   **Location Context Engine (Module 7)**:
    *   `expo-location`: Foreground and background geofencing tracking to detect nearby health places.
    *   `react-native-maps`: Map widget canvas visualizing geofences.
*   **Notifications Engine (Module 17)**:
    *   `expo-notifications` & `expo-device`: Native device listeners to capture FCM push tokens.
*   **Premium UX & Micro-Animations**:
    *   `lottie-react-native`: Vector graphics player for interactive dashboard metrics, score dials, and goal milestone celebrations.
    *   `expo-font`: Supporting custom premium typography interfaces.
    *   `@react-navigation/native` & `@react-navigation/native-stack`: Stack-based native transition routers.
    *   `react-native-screens` & `react-native-safe-area-context`: Safe padding layout constraints.

---

## 2. Codebase Directory Layout

We recommend structuring the mobile code under the following folders:

```
app/
├── assets/                    # Image media, vector icons, custom fonts, and Lottie animations
├── src/
│   ├── components/            # Reusable UI widgets (Buttons, Input, LoadingModal)
│   ├── screens/               # Screen views:
│   │   ├── auth/              # Registration, Login, and OTP verification views
│   │   ├── profile/           # Demographic and medical history profile setups
│   │   ├── timeline/          # Chronological timeline feed with filters and search
│   │   ├── reports/           # File selection progress and OCR manual correction views
│   │   ├── tracking/          # Manual lifestyle logging forms and stats charts
│   │   ├── voice/             # Audio recording visualizer and transcripts list
│   │   ├── dashboard/         # Health Score meters and recommendation sliders
│   │   └── goals/             # Goals targets lists and notifications settings
│   ├── navigation/            # Bottom Tab and Stack navigation routers
│   ├── services/              # API communications client layer (Axios/Fetch requests)
│   ├── hooks/                 # Shared React hooks (useAuth, useNotifications, useLocation)
│   └── utils/                 # Utility helpers (unit converters, date formattings)
├── App.js                     # Root entry wrapper (loads configurations and checks login state)
├── app.json                   # Expo configs and native plugin registrations
├── index.js                   # Application entry point registered with AppRegistry
└── package.json               # JavaScript/Expo dependencies lists
```

---

## 3. Local Development Setup

### Prerequisites
* **Node.js**: Version `v18` or `v20`.
* **Package Manager**: `npm`.
* **Simulation Device**:
  - iOS: Simulator via Xcode
  - Android: Android Virtual Device (AVD) emulator via Android Studio
  - Physical Device: Expo Go App installed from Apple App Store / Google Play Store.

### Execution Instructions
1. Install npm packages:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Run on simulation target:
   - Press **`i`** to launch on Xcode iOS Simulator.
   - Press **`a`** to launch on Android Emulator.
   - Scan the terminal's QR code using the iOS Camera app or the Android Expo Go app to launch on a physical device.

---

## 4. API Backend Connection

The mobile app must connect to the local FastAPI backend. Depending on the target environment, configure the backend base URL in `src/services/api.js` accordingly:

*   **iOS Simulator**: Can connect using localhost directly:
    ```javascript
    const BASE_URL = "http://localhost:8000";
    ```
*   **Android Emulator**: Must route through the emulator gateway:
    ```javascript
    const BASE_URL = "http://10.0.2.2:8000";
    ```
*   **Physical Device / Expo Go**: Must point to the host machine's local network IP address:
    ```javascript
    const BASE_URL = "http://192.168.1.XX:8000"; // replace with local IP
    ```
    *(Note: The physical device must be connected to the exact same Wi-Fi network as the host machine.)*
