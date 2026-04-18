# Software Design Document — CLUTCH

**Project:** CLUTCH (QR Code Scavenger Hunt Platform)
**Version:** 1.0

---

## 1. System Architecture

CLUTCH follows a client-server architecture deployed as a Vercel application:

```
┌──────────────────────────────────────────────────────┐
│                      Vercel                          │
│                                                      │
│  ┌──────────────────┐    ┌────────────────────────┐  │
│  │  Static Build     │    │  Serverless Function   │  │
│  │  (Vue.js 3 SPA)   │    │  (Node.js / Express)   │  │
│  │                    │    │                        │  │
│  │  /                 │    │  /api/game             │  │
│  │  /quest            │    │  /api/game/:id/hint/:q │  │
│  │  /make             │    │  /api/games            │  │
│  │  /games            │    │                        │  │
│  │  /about            │    │                        │  │
│  └──────────────────┘    └───────────┬────────────┘  │
│                                      │               │
└──────────────────────────────────────┼───────────────┘
                                       │
                              ┌────────▼────────┐
                              │    MongoDB       │
                              │    (Atlas)       │
                              └─────────────────┘

External:
  ┌─────────────────────┐
  │  api.qrserver.com   │  ← QR code image generation
  └─────────────────────┘
```

### 1.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Vue.js | 3.x |
| Routing | Vue Router | 4.x |
| HTTP Client | Axios | 1.x |
| QR Scanning | vue3-qrcode-reader | 0.0.1 |
| Countdown Timer | @chenfengyuan/vue-countdown | 2.x |
| Image Compression | browser-image-compression | 2.x |
| Duration Parsing | parse-duration | 1.x |
| Backend Runtime | Node.js + Express | 4.x |
| ODM | Mongoose | 9.x |
| Logging | Morgan | 1.x |
| CORS | cors | 2.x |
| Deployment | Vercel | v2 config |

---

## 2. Frontend Design

### 2.1 Component Tree

```
App.vue
├── HeaderItem.vue          (shown on all pages except /quest)
│   ├── Brand link (CLUTCH → /)
│   ├── Nav links (Make, Games, About)
│   └── Theme toggle button
│
└── <router-view>
    ├── HomeView.vue         /
    │   └── BarcodeItem.vue  (toggled for scanning startup QR)
    │
    ├── QuestView.vue        /quest?event=<name>
    │   └── BarcodeItem.vue  (toggled for scanning quest QR)
    │
    ├── MakeView.vue         /make
    │   └── MadeItem.vue     (shown after successful game creation)
    │
    ├── GamesView.vue        /games
    │   └── MadeItem.vue     (shown when a game is selected)
    │
    └── AboutView.vue        /about  (lazy-loaded)
```

### 2.2 Route Definitions

| Path | Component | Loading | Description |
|------|-----------|---------|-------------|
| `/` | HomeView | Eager | Landing page with New Game / Continue |
| `/quest` | QuestView | Eager | Main gameplay screen |
| `/make` | MakeView | Eager | Game creation form |
| `/games` | GamesView | Eager | Browse all games |
| `/about` | AboutView | Lazy | About page (code-split) |

### 2.3 Component Descriptions

#### HomeView.vue
- Displays branded landing card with gradient title
- "New game" button toggles `BarcodeItem` for QR scanning
- "Continue" button appears when `localStorage.game === "1"`
- Starting a new game while one is in progress triggers a `confirm()` dialog
- On successful scan, sets `startTime` in localStorage and navigates to `/quest?event=<scannedValue>`

#### QuestView.vue
- Core gameplay component managing all game logic
- **State management:** Uses component `data()` with localStorage for persistence
- **Timer:** `vue-countdown` component driven by `timeLeft` (ms). End time computed from `startTime + parse(duration)` and stored in localStorage
- **Quest progression:** Linear through a randomized order. `state` index tracks the active quest
- **QR validation:** `gotResult(result)` checks if scanned value matches the active quest's `_id`
- **Modals:** Four overlay modals — results (win/time-up), save & exit confirmation, quit confirmation, hint display
- **Score calculation:** `points - (deduction / 2)` where `deduction = 3 - hints_left`

#### MakeView.vue
- Multi-section form: General info + dynamic quest list
- Client-side validation before submission
- Image compression via `browser-image-compression` (max 500px, 0.5 MB)
- Images converted to base64 via `FileReader.readAsDataURL`
- Submits as `multipart/form-data` with quests serialized as JSON strings
- On success, renders `MadeItem` with the created game object

#### GamesView.vue
- Fetches all games from `GET /api/games`
- Responsive grid layout of game cards
- Clicking a card renders `MadeItem` to show that game's QR codes

#### BarcodeItem.vue
- Wraps `vue3-qrcode-reader`'s `QrcodeStream` component
- Uses rear camera by default
- Emits `toggle` (back button) and `result` (decoded QR value) events
- Handles 6 specific camera error types with user-friendly messages

#### HeaderItem.vue
- Fixed navigation bar with brand link and route links
- Active route highlighted with accent color and background
- Theme toggle persists to `localStorage.theme`

#### MadeItem.vue
- Receives a `game` object as a prop
- Renders startup QR code (encoding `game.event`) and per-quest QR codes (encoding `quest._id`)
- QR images sourced from `api.qrserver.com` at 300x300px with 35px margin

### 2.4 State Management

CLUTCH uses **localStorage** for client-side state persistence (no Vuex/Pinia).

| localStorage Key | Constant | Purpose |
|------------------|----------|---------|
| `game` | `STORAGE_KEYS.GAME_ACTIVE` | Whether a game is in progress (`"1"` or `"0"`) |
| `gameName` | `STORAGE_KEYS.GAME_NAME` | Name of the active game (event name) |
| `startTime` | `STORAGE_KEYS.START_TIME` | Epoch timestamp when the game started |
| `endTime` | `STORAGE_KEYS.END_TIME` | Epoch timestamp when the timer expires |
| `state` | `STORAGE_KEYS.QUEST_STATE` | Index of the current active quest |
| `order` | `STORAGE_KEYS.QUEST_ORDER` | JSON array of randomized quest indices |
| `hintsLeft` | `STORAGE_KEYS.HINTS_LEFT` | Number of remaining hints |
| `theme` | (not in constants) | `"light"` or `"dark"` |

### 2.5 Theming

Two themes controlled by a CSS class on `<html>`:

- **Dark mode** (default): No class on `<html>`
- **Light mode**: `html.light` class applied

All colors use CSS custom properties (`--bg`, `--surface`, `--accent`, `--text`, etc.) defined in `App.vue`'s global `<style>` block. The toggle in `HeaderItem` adds/removes the `light` class and persists the choice.

---

## 3. Backend Design

### 3.1 Server Setup

- **Entry point:** `api/index.js`
- **Framework:** Express.js with middleware:
  - `cors()` — cross-origin requests
  - `express.json({ limit: "10mb" })` — JSON body parsing with 10 MB limit
  - `morgan("combined")` — HTTP request logging
- **Database:** Mongoose connects to MongoDB via `CLUTCH_DB_STRING` env var
- **Export:** `module.exports = app` for Vercel serverless deployment
- **Dev mode:** When `ENVIRONMENT=dev`, starts a local HTTP server on `CLUTCH_PORT` (default 5000)

### 3.2 API Endpoints

#### GET /api/game?event=\<name\>

```
Request:  ?event=<game name>
Response: Game object with hint fields stripped from quests
Error:    400 (missing event), 404 (not found), 500 (server error)
```

- Queries MongoDB by `event` field
- Strips `hint` property from each quest in the response to reduce payload
- Hints are fetched separately on demand

#### GET /api/game/:id/hint/:questId

```
Request:  /api/game/<gameId>/hint/<questId>
Response: { hint: "<base64 string>" }
Error:    404 (game/quest/hint not found), 500 (server error)
```

- Finds game by `_id`, then finds quest subdocument by `_id`
- Returns the hint's base64-encoded image string

#### GET /api/games

```
Request:  (none)
Response: Array of all game objects
Error:    500 (server error)
```

#### POST /api/game

```
Request body: { gameMaker, event, gameDuration, quests: ["<JSON>", ...] }
Response:     { success: <saved game object> }
Error:        400 (validation), 500 (save failure)
```

- Validates required fields and non-empty quests array
- Parses each quest from JSON string
- Validates hint size (max 2 MB per hint)
- Saves to MongoDB and returns the created document

### 3.3 Database Schema

```javascript
GameSchema {
  event:       String (required)         // Game name, used as lookup key
  gameMaker:   String (required)         // Creator's name
  quests: [{
    title:     String (required)         // Quest display name
    clue:      String (required)         // Clue text shown to player
    hint:      String (optional)         // Base64-encoded image
    completed: Boolean (default: false)  // Server-side default (not used at runtime)
  }]
  duration:    String (required)         // Human-readable (e.g. "1.5h")
  dateCreated: Date (default: Date.now)  // Auto-set on creation
}
```

Collection name: `games`

---

## 4. Data Flow Diagrams

### 4.1 Game Creation Flow

```
Game Maker                  Frontend (MakeView)              API                    MongoDB
    │                            │                            │                       │
    ├── Fill form ──────────────►│                            │                       │
    ├── Attach hint images ─────►│                            │                       │
    │                            ├── Compress images          │                       │
    │                            ├── Convert to base64        │                       │
    │                            ├── Validate fields          │                       │
    │                            ├── POST /api/game ─────────►│                       │
    │                            │                            ├── Validate fields     │
    │                            │                            ├── Parse quest JSON    │
    │                            │                            ├── Check hint sizes    │
    │                            │                            ├── Save ──────────────►│
    │                            │                            │◄─── saved document ───┤
    │                            │◄── { success: game } ──────┤                       │
    │◄── Display QR codes ───────┤                            │                       │
```

### 4.2 Gameplay Flow

```
Player                      Frontend (HomeView → QuestView)          API              MongoDB
  │                              │                                    │                  │
  ├── Tap "New game" ───────────►│                                    │                  │
  │                              ├── Open camera (BarcodeItem)        │                  │
  ├── Scan startup QR ──────────►│                                    │                  │
  │                              ├── Navigate to /quest?event=<name>  │                  │
  │                              ├── GET /api/game?event=<name> ─────►│                  │
  │                              │                                    ├── Find game ────►│
  │                              │                                    │◄── game data ────┤
  │                              │◄── game (hints stripped) ──────────┤                  │
  │                              ├── Randomize quest order            │                  │
  │                              ├── Start countdown timer            │                  │
  │                              ├── Store state in localStorage      │                  │
  │◄── Show clue ────────────────┤                                    │                  │
  │                              │                                    │                  │
  ├── Tap "Investigate" ────────►│                                    │                  │
  │                              ├── Open camera                      │                  │
  ├── Scan quest QR ────────────►│                                    │                  │
  │                              ├── Validate: scanned _id === active quest _id          │
  │                              ├── Mark completed, advance state    │                  │
  │◄── Show next clue ──────────┤                                    │                  │
  │                              │                                    │                  │
  ├── Tap hint button ──────────►│                                    │                  │
  │                              ├── Decrement hints_left             │                  │
  │                              ├── GET /api/game/:id/hint/:qid ───►│                  │
  │                              │                                    ├── Find hint ────►│
  │                              │◄── { hint: base64 } ──────────────┤◄── hint data ────┤
  │◄── Show hint image ─────────┤                                    │                  │
  │                              │                                    │                  │
  │     [All quests done OR timer expires]                            │                  │
  │◄── Show results modal ──────┤                                    │                  │
```

---

## 5. Deployment Architecture

### 5.1 Vercel Configuration (`vercel.json`)

```json
{
  "builds": [
    { "src": "client/package.json", "use": "@vercel/static-build" },
    { "src": "api/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "^/api/game[s]?", "dest": "api/index.js" },
    { "src": "^/favicon.ico", "dest": "/client/favicon.ico" },
    { "src": "^/(css|js)/(.+)", "dest": "/client/$1/$2" },
    { "src": "^/.*", "dest": "/client/index.html" }
  ]
}
```

- **Frontend build:** Vue CLI builds to `client/dist`, served as static files
- **API:** Express app exported as a Vercel serverless function
- **Routing:** API routes go to Express; all other routes serve `index.html` (SPA fallback)

### 5.2 PWA Support

- `client/public/sw.js` — Service worker for offline caching
- `client/public/manifest.json` — Web app manifest enabling "Add to Home Screen"

---

## 6. Design Decisions

| Decision | Rationale |
|----------|-----------|
| **localStorage for game state** | No user accounts needed; keeps architecture simple. Timer persistence ensures fairness (can't pause by closing browser). |
| **Quest order randomization stored client-side** | Each player gets a unique order, preventing players from following each other. Stored in localStorage so order is consistent during a session. |
| **Hints lazy-loaded** | Hint images are large (base64). Stripping them from the initial game fetch reduces payload by potentially several MB. |
| **Client-side image compression** | Reduces upload time and server storage. 500px max dimension and 0.5 MB limit keep hint images lightweight. |
| **External QR generation API** | Avoids adding a server-side QR library. QR codes are only generated for display/printing, not time-critical. |
| **No authentication** | The app is designed for casual, event-based use. Game makers create games publicly; players join by scanning a physical QR code. |
| **CSS custom properties for theming** | Enables theme switching without JavaScript-driven style changes. Simple class toggle on `<html>` swaps all colors. |
| **No Vuex/Pinia** | State is localized to individual views. localStorage handles persistence. The app's state needs are simple enough that a store would add unnecessary complexity. |

---

## 7. File Index

| File | Purpose |
|------|---------|
| `api/index.js` | Express server, API routes, middleware, DB connection |
| `api/models/Game.js` | Mongoose schema for Game collection |
| `client/src/main.js` | Vue app entry point |
| `client/src/App.vue` | Root component, global styles, theme variables |
| `client/src/router/index.js` | Vue Router configuration |
| `client/src/constants/storage.js` | localStorage key constants |
| `client/src/components/BarcodeItem.vue` | QR code scanner component |
| `client/src/components/HeaderItem.vue` | Navigation header with theme toggle |
| `client/src/components/MadeItem.vue` | QR code display after game creation |
| `client/src/views/HomeView.vue` | Landing page |
| `client/src/views/QuestView.vue` | Main gameplay screen |
| `client/src/views/MakeView.vue` | Game creation form |
| `client/src/views/GamesView.vue` | Browse all games |
| `client/src/views/AboutView.vue` | About page |
| `vercel.json` | Vercel deployment and routing config |
| `client/public/sw.js` | Service worker |
| `client/public/manifest.json` | PWA manifest |
