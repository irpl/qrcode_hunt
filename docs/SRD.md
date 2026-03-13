# Software Requirements Document — CLUTCH

**Project:** CLUTCH (QR Code Scavenger Hunt Platform)
**Version:** 1.0
**Author:** Phillip Logan
**Live URL:** https://clutch-irpl.vercel.app

---

## 1. Introduction

### 1.1 Purpose

CLUTCH is a web-based QR code scavenger hunt game platform. Game makers create timed hunts with clues and hidden QR codes. Players compete to find and scan all QR codes before a countdown timer expires.

### 1.2 Scope

The application serves two user roles:

- **Game Makers** — create games with quests, clues, hint images, and a time limit. They receive printable QR codes to distribute and hide.
- **Players** — scan a startup QR code, follow clues, find hidden QR codes, and attempt to complete all quests before the timer runs out.

### 1.3 Intended Audience

- Game organizers (e.g. event coordinators, teachers, team-building facilitators)
- Players (general public with a smartphone and browser)
- QA testers validating application behavior

### 1.4 Original Context

Built for UWI Research Day 2019.

---

## 2. Overall Description

### 2.1 Product Perspective

CLUTCH is a standalone web application deployed on Vercel. It consists of a Vue.js 3 single-page application (frontend) and a Node.js/Express serverless API (backend) backed by MongoDB.

### 2.2 User Roles

| Role | Description |
|------|-------------|
| **Player** | Scans QR codes, reads clues, finds hidden quests, uses hints, and competes against a timer |
| **Game Maker** | Creates games by defining quests with titles, clues, optional hint images, and a duration |

### 2.3 Operating Environment

- **Client:** Modern web browsers (Chrome, Safari, Firefox, Edge) on mobile and desktop
- **Camera:** Required for QR code scanning (rear camera preferred)
- **Connection:** HTTPS required for camera access
- **Server:** Vercel serverless environment
- **Database:** MongoDB (Atlas or self-hosted)

### 2.4 Constraints

- Camera access requires HTTPS
- Hint images limited to 2 MB per quest (server-side validation)
- Client-side image compression targets max 500px dimension and 0.5 MB
- Maximum app width is 520px (mobile-first design)
- QR code generation depends on external service (`api.qrserver.com`)

---

## 3. Functional Requirements

### 3.1 Home Screen (FR-HOME)

| ID | Requirement |
|----|-------------|
| FR-HOME-01 | The home screen SHALL display the app name "CLUTCH" and tagline "Scan. Solve. Win." |
| FR-HOME-02 | The home screen SHALL provide a "New game" button that activates the QR code scanner |
| FR-HOME-03 | If a game is in progress (localStorage flag `game` equals `"1"`), the home screen SHALL display a "Continue" button |
| FR-HOME-04 | If no game is in progress, the home screen SHALL display the text "No game in progress" instead of the Continue button |
| FR-HOME-05 | Tapping "New game" while a game is in progress SHALL prompt the user with a confirmation dialog before clearing progress |
| FR-HOME-06 | Scanning a valid startup QR code SHALL navigate the player to the quest screen with the game's event name |

### 3.2 Quest / Gameplay Screen (FR-QUEST)

| ID | Requirement |
|----|-------------|
| FR-QUEST-01 | The quest screen SHALL display a countdown timer in HH:MM:SS format |
| FR-QUEST-02 | The quest screen SHALL display the current quest's clue text |
| FR-QUEST-03 | The quest screen SHALL display a list of all quests with visual states: active (highlighted), completed (strikethrough, dimmed), and locked (dimmed, no interaction) |
| FR-QUEST-04 | The quest screen SHALL provide an "Investigate" button that opens the QR code scanner |
| FR-QUEST-05 | Scanning the correct QR code for the active quest SHALL mark that quest as completed and advance to the next quest |
| FR-QUEST-06 | Scanning an incorrect QR code SHALL NOT advance the quest state |
| FR-QUEST-07 | When all quests are completed, the game SHALL end and display the results modal |
| FR-QUEST-08 | When the countdown reaches zero, the game SHALL end and display the results modal |
| FR-QUEST-09 | The results modal SHALL display: clues solved, hints used, and final score |
| FR-QUEST-10 | Final score SHALL be calculated as: `quests_completed - (hints_used × 0.5)` |
| FR-QUEST-11 | Quest order SHALL be randomized per player session |
| FR-QUEST-12 | The randomized quest order SHALL persist across page reloads via localStorage |

### 3.3 Hint System (FR-HINT)

| ID | Requirement |
|----|-------------|
| FR-HINT-01 | Players SHALL start with 3 hints |
| FR-HINT-02 | The hint button SHALL display the remaining hint count |
| FR-HINT-03 | Using a hint SHALL decrement the remaining count by 1 |
| FR-HINT-04 | Each hint costs 0.5 points, deducted from the final score |
| FR-HINT-05 | Opening the hint for the same quest multiple times SHALL only consume 1 hint charge |
| FR-HINT-06 | Hint images SHALL be lazy-loaded from the server on demand |
| FR-HINT-07 | If no hint image exists for a quest, the hint modal SHALL display "No hint available for this clue" |
| FR-HINT-08 | The hint button SHALL be disabled when hints_left equals 0 or the game has ended |

### 3.4 Game State Persistence (FR-STATE)

| ID | Requirement |
|----|-------------|
| FR-STATE-01 | The following game state SHALL be persisted in localStorage: game active flag, game name, start time, end time, quest state (progress index), quest order, and hints remaining |
| FR-STATE-02 | The timer SHALL continue running even if the player navigates away from the quest screen |
| FR-STATE-03 | Returning to a game in progress SHALL restore the timer from the persisted end time |
| FR-STATE-04 | "Save & exit" SHALL preserve all game state and navigate to the home screen |
| FR-STATE-05 | "Quit game" SHALL clear all game state from localStorage and navigate to the home screen |
| FR-STATE-06 | A `beforeunload` warning SHALL be shown if the player tries to close/refresh the browser during an active game |

### 3.5 Game Creation (FR-MAKE)

| ID | Requirement |
|----|-------------|
| FR-MAKE-01 | The creation form SHALL require: game name, creator name, and game duration |
| FR-MAKE-02 | The creation form SHALL support adding multiple quests |
| FR-MAKE-03 | Each quest SHALL require a title and a clue |
| FR-MAKE-04 | Each quest MAY include an optional hint image (PNG, GIF, JPEG) |
| FR-MAKE-05 | Hint images SHALL be compressed client-side to max 500px and 0.5 MB before upload |
| FR-MAKE-06 | Duration SHALL accept human-readable formats (e.g. `1.5h`, `30m`, `45m`) |
| FR-MAKE-07 | The form SHALL validate all required fields before submission and display specific error messages |
| FR-MAKE-08 | On successful creation, the screen SHALL display printable QR codes: one startup QR code and one per quest |
| FR-MAKE-09 | Quests can be added and removed dynamically before submission |
| FR-MAKE-10 | At least one quest is required to create a game |

### 3.6 Browse Games (FR-GAMES)

| ID | Requirement |
|----|-------------|
| FR-GAMES-01 | The games page SHALL fetch and display all existing games |
| FR-GAMES-02 | Each game card SHALL display: event name, game maker, duration, and date created |
| FR-GAMES-03 | Clicking a game card SHALL display that game's QR codes (startup + per-quest) |
| FR-GAMES-04 | A "Back" button SHALL return to the games list |
| FR-GAMES-05 | Loading and error states SHALL be displayed appropriately |

### 3.7 Navigation & Theme (FR-NAV)

| ID | Requirement |
|----|-------------|
| FR-NAV-01 | A header with navigation links SHALL be displayed on all pages except the quest screen |
| FR-NAV-02 | Navigation SHALL include links to: Home (brand logo), Make, Games, About |
| FR-NAV-03 | The active route SHALL be visually highlighted in the navigation |
| FR-NAV-04 | A theme toggle button SHALL switch between dark mode (default) and light mode |
| FR-NAV-05 | Theme preference SHALL be persisted in localStorage |

### 3.8 QR Code Scanner (FR-SCAN)

| ID | Requirement |
|----|-------------|
| FR-SCAN-01 | The scanner SHALL use the device's rear camera |
| FR-SCAN-02 | The scanner SHALL provide a "Back" button to return without scanning |
| FR-SCAN-03 | Camera permission errors SHALL be handled with user-friendly messages for: NotAllowedError, NotFoundError, NotSupportedError, NotReadableError, OverconstrainedError, StreamApiNotSupportedError |

---

## 4. API Requirements

### 4.1 Endpoints

| ID | Method | Path | Description |
|----|--------|------|-------------|
| API-01 | `GET` | `/api/game?event=<name>` | Fetch a single game by event name. Hint images are stripped from the response. |
| API-02 | `GET` | `/api/game/:id/hint/:questId` | Fetch the hint image for a specific quest. Returns `{ hint: <base64> }`. |
| API-03 | `GET` | `/api/games` | Fetch all games. |
| API-04 | `POST` | `/api/game` | Create a new game. Accepts JSON body with `gameMaker`, `event`, `gameDuration`, and `quests[]` (array of JSON strings). |

### 4.2 Validation Rules

| ID | Rule |
|----|------|
| API-VAL-01 | `POST /api/game` SHALL require `gameMaker`, `event`, `gameDuration`, and `quests` fields |
| API-VAL-02 | `quests` SHALL be a non-empty array |
| API-VAL-03 | Each quest string SHALL be valid JSON |
| API-VAL-04 | Each hint image SHALL not exceed 2 MB (base64 encoded) |
| API-VAL-05 | `GET /api/game` SHALL require the `event` query parameter |
| API-VAL-06 | Non-existent games or quests SHALL return 404 with a descriptive message |

### 4.3 Data Model

**Game Schema:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `event` | String | Yes | — |
| `gameMaker` | String | Yes | — |
| `quests` | Array of Quest | Yes | — |
| `duration` | String | Yes | — |
| `dateCreated` | Date | No | `Date.now` |

**Quest Sub-Schema:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | String | Yes | — |
| `clue` | String | Yes | — |
| `hint` | String | No | — |
| `completed` | Boolean | No | `false` |

---

## 5. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | **Performance** | Hint images SHALL be lazy-loaded on demand, not included in initial game fetch |
| NFR-02 | **Performance** | Client-side image compression SHALL reduce upload payload size |
| NFR-03 | **Responsiveness** | The UI SHALL be optimized for mobile devices with a max-width of 520px |
| NFR-04 | **PWA** | The app SHALL include a service worker and web app manifest for mobile installation |
| NFR-05 | **Security** | Camera access SHALL require HTTPS |
| NFR-06 | **Security** | The server SHALL enforce a 10 MB JSON body limit |
| NFR-07 | **Accessibility** | QR code images SHALL include alt text |
| NFR-08 | **Availability** | The app SHALL be deployed on Vercel with serverless backend scaling |
| NFR-09 | **Browser Support** | The app SHALL support the last 2 versions of major browsers (Chrome, Firefox, Safari, Edge) with >1% usage |
| NFR-10 | **Logging** | The API SHALL log requests using Morgan (combined format) |

---

## 6. External Dependencies

| Dependency | Purpose |
|------------|---------|
| `api.qrserver.com` | QR code image generation |
| MongoDB Atlas | Database hosting |
| Vercel | Application hosting and deployment |
| Google Fonts (Raleway) | Typography |

---

## 7. Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLUTCH_DB_STRING` | MongoDB connection string | Yes |
| `CLUTCH_PORT` | Local dev server port | No (default: 5000) |
| `ENVIRONMENT` | Set to `dev` for local development | No |
