# CLUTCH

A QR code scavenger hunt game. Game makers create hunts with clues and hidden QR codes; players race against a timer to find and scan them all.

Originally built for UWI Research Day 2019.

**Live:** https://clutch-irpl.vercel.app

---

## How it works

### For players
1. On the home screen, tap **New game** to activate the camera.
2. Scan the game's startup QR code (provided by the game maker).
3. Read the clue for your first quest, then go find the hidden QR code.
4. Tap **Investigate** to scan it. Repeat for each quest.
5. You have 3 hints available — each hint costs 0.5 points.
6. Your score = quests completed − (hints used × 0.5).

### For game makers
1. Go to `/make` and fill in the game name, your name, and the duration.
2. Add quests — each needs a title, a clue, and an optional image hint.
3. Submit. You'll get a printable startup QR code and one QR code per quest.
4. Print the quest QR codes and hide them. Give players the startup QR code.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vue.js 3, Vue Router 4, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Deployment | Vercel (static + serverless) |
| QR scanning | vue3-qrcode-reader |
| QR generation | api.qrserver.com |

---

## Project structure

```
qrcode_hunt/
├── api/
│   ├── index.js          # Express server and API routes
│   └── models/
│       └── Game.js       # Mongoose schema
├── client/
│   └── src/
│       ├── components/
│       │   ├── BarcodeItem.vue   # QR code scanner
│       │   ├── HeaderItem.vue    # Navigation header
│       │   └── MadeItem.vue      # Game QR code display
│       ├── constants/
│       │   └── storage.js        # localStorage key constants
│       ├── router/
│       │   └── index.js
│       └── views/
│           ├── HomeView.vue      # Landing / game start
│           ├── QuestView.vue     # Main gameplay
│           ├── MakeView.vue      # Game creation
│           ├── GamesView.vue     # Browse all games
│           └── AboutView.vue
├── package.json          # Backend dependencies
└── vercel.json           # Deployment configuration
```

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/game?event=<name>` | Fetch a single game by name |
| `GET` | `/api/games` | Fetch all games |
| `POST` | `/api/game` | Create a new game (multipart/form-data) |

### POST `/api/game` fields

| Field | Type | Required |
|---|---|---|
| `event` | string | yes |
| `gameMaker` | string | yes |
| `gameDuration` | string (e.g. `1.5h`, `30m`) | yes |
| `quests[]` | JSON string array | yes |

---

## Development

### Prerequisites
- Node.js
- MongoDB instance (local or Atlas)

### Environment variables

Create a `.env` file in the project root:

```
CLUTCH_DB_STRING=mongodb+srv://...
CLUTCH_PORT=5000
ENVIRONMENT=dev
```

### Run locally

**Backend:**
```bash
npm install
node api/index.js
```

**Frontend** (separate terminal):
```bash
cd client
npm install
npm run serve
```

The client dev server proxies `/api` requests to the Express server automatically via Vue CLI.

### Build for production
```bash
cd client
npm run build
```

---

## Deployment

The app is configured for Vercel. Push to the connected repository and Vercel handles the build:
- `client/` → compiled as a static site
- `api/index.js` → deployed as a Node.js serverless function

Set the `CLUTCH_DB_STRING` environment variable in your Vercel project settings.
