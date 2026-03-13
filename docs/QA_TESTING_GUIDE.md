# Feature List & QA Testing Guide — CLUTCH

**Project:** CLUTCH (QR Code Scavenger Hunt Platform)
**Live URL:** https://clutch-irpl.vercel.app

---

## Table of Contents

1. [Feature List](#1-feature-list)
2. [Test Environment Setup](#2-test-environment-setup)
3. [Test Cases by Feature](#3-test-cases-by-feature)
4. [Edge Cases & Negative Testing](#4-edge-cases--negative-testing)
5. [Cross-Browser & Device Testing](#5-cross-browser--device-testing)

---

## 1. Feature List

### Core Features

| # | Feature | Page | Description |
|---|---------|------|-------------|
| F1 | **Start new game** | Home (`/`) | Player scans a startup QR code to begin a game |
| F2 | **Continue game** | Home (`/`) | Player resumes a previously started game |
| F3 | **Countdown timer** | Quest (`/quest`) | Real-time HH:MM:SS countdown; game ends when timer hits 00:00:00 |
| F4 | **Clue display** | Quest (`/quest`) | Shows the current quest's clue text |
| F5 | **Quest progression** | Quest (`/quest`) | Scanning the correct QR code completes the quest and advances to the next |
| F6 | **Quest list** | Quest (`/quest`) | Visual list with active/completed/locked states |
| F7 | **QR code scanning** | Home, Quest | Camera-based QR code reader using rear camera |
| F8 | **Hint system** | Quest (`/quest`) | 3 hints per game, each costing 0.5 points; shows an image hint |
| F9 | **Score calculation** | Quest (`/quest`) | Final score = quests completed - (hints used x 0.5) |
| F10 | **Game creation** | Make (`/make`) | Form to create a game with quests, clues, and optional hint images |
| F11 | **QR code generation** | Make (`/make`), Games (`/games`) | Startup QR and per-quest QR codes displayed after creation |
| F12 | **Browse games** | Games (`/games`) | View all created games in a card grid |
| F13 | **Dark/Light theme** | All pages | Toggle between dark (default) and light mode |
| F14 | **Save & exit** | Quest (`/quest`) | Preserve progress and navigate home; timer keeps running |
| F15 | **Quit game** | Quest (`/quest`) | Clear all progress and navigate home |
| F16 | **Quest randomization** | Quest (`/quest`) | Quest order is shuffled per player session |
| F17 | **Game state persistence** | Quest (`/quest`) | Game state survives page refresh via localStorage |
| F18 | **PWA install** | All pages | App can be installed on mobile via service worker |
| F19 | **Image compression** | Make (`/make`) | Hint images compressed client-side before upload |
| F20 | **Navigation** | All pages (except Quest) | Header with links to Home, Make, Games, About |

---

## 2. Test Environment Setup

### Prerequisites

- A smartphone or device with a camera (for QR scanning tests)
- A desktop browser for form and layout testing
- Access to the live app or a local dev environment
- QR codes to scan (create a game first, then use the printed QR codes)

### Creating Test Data

1. Navigate to `/make`
2. Create a game with:
   - Game name: `QA Test Game`
   - Creator name: `QA Tester`
   - Duration: `30m`
   - 3 quests with titles, clues, and at least 1 hint image
3. Note the generated QR codes (print or screenshot them)
4. The startup QR code encodes the game name (`QA Test Game`)
5. Each quest QR code encodes that quest's MongoDB `_id`

### Tools Needed

- Browser DevTools (for localStorage inspection, network monitoring)
- A second device or printed QR codes for scanning
- Multiple browsers for cross-browser testing

---

## 3. Test Cases by Feature

### 3.1 Home Screen

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-HOME-01 | Landing page loads | Navigate to `/` | Page shows "CLUTCH" title, "Scan. Solve. Win." tagline, and "New game" button |
| TC-HOME-02 | No game in progress | Clear localStorage, navigate to `/` | "No game in progress" text is shown instead of "Continue" button |
| TC-HOME-03 | Game in progress | Start a game, then navigate back to `/` | "Continue" button is visible |
| TC-HOME-04 | Start new game | Tap "New game" | Camera scanner opens |
| TC-HOME-05 | New game overwrites existing | With a game in progress, tap "New game" | Confirmation dialog appears: "Starting a new game will erase your current progress. Continue?" |
| TC-HOME-06 | Cancel new game overwrite | On the confirmation dialog, click Cancel | Camera does not open, existing game is preserved |
| TC-HOME-07 | Confirm new game overwrite | On the confirmation dialog, click OK | localStorage is cleared, camera opens |
| TC-HOME-08 | Continue game | With a game in progress, tap "Continue" | Navigates to `/quest?event=<gameName>` with preserved progress |

### 3.2 QR Code Scanner

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-SCAN-01 | Scanner opens | Tap "New game" or "Investigate" | Camera feed appears with rear camera active |
| TC-SCAN-02 | Back button | Tap "Back" in scanner | Scanner closes, returns to previous view |
| TC-SCAN-03 | Successful scan | Point camera at a valid QR code | QR content is decoded and emitted |
| TC-SCAN-04 | Camera denied | Deny camera permission when prompted | Error message: "Camera access was denied. Please grant permission in your browser settings." |
| TC-SCAN-05 | No camera found | Test on a device without a camera | Error message: "No camera found on this device." |
| TC-SCAN-06 | HTTP context | Access app over HTTP (not HTTPS) | Error message about requiring a secure connection |

### 3.3 Gameplay (Quest Screen)

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-QUEST-01 | Game loads | Scan startup QR code | Quest screen shows countdown timer, first clue, quest list, and "Investigate" button |
| TC-QUEST-02 | Timer displays correctly | Start a game with 30m duration | Timer shows approximately `00:30:00` and counts down in real time |
| TC-QUEST-03 | Clue displayed | Start a game | Current quest's clue text is shown in the clue card |
| TC-QUEST-04 | Quest list states | Start a game with 3 quests | First quest is "active" (highlighted), others are "locked" (dimmed) |
| TC-QUEST-05 | Correct QR scanned | Scan the QR code matching the active quest's `_id` | Quest marked completed (strikethrough), next quest becomes active, clue updates |
| TC-QUEST-06 | Wrong QR scanned | Scan a QR code that does NOT match the active quest | Nothing happens; quest state unchanged |
| TC-QUEST-07 | All quests completed | Complete all quests | Results modal appears with score |
| TC-QUEST-08 | Timer expires | Wait for timer to reach 00:00:00 | Results modal appears automatically |
| TC-QUEST-09 | Results modal content | Complete game or let timer expire | Modal shows: clues solved count, hints used count, final score, "Go Home" button |
| TC-QUEST-10 | Score calculation | Complete 3 quests, use 1 hint | Score = 3 - (1 × 0.5) = 2.5 |
| TC-QUEST-11 | Score with no hints | Complete 2 quests, use 0 hints | Score = 2 - 0 = 2 |
| TC-QUEST-12 | Score with all hints | Complete 1 quest, use 3 hints | Score = 1 - (3 × 0.5) = -0.5 |
| TC-QUEST-13 | Quest randomization | Start the same game on two different devices/sessions | Quest order differs between sessions |
| TC-QUEST-14 | Header hidden | Navigate to quest screen | Navigation header is NOT visible |
| TC-QUEST-15 | Investigate button | Tap "Investigate" | Camera scanner opens |
| TC-QUEST-16 | Show Stats button | After game ends | "Investigate" button is replaced by "Show Stats" button |
| TC-QUEST-17 | Go Home | Tap "Go Home" on results modal | Navigates to `/` |

### 3.4 Hint System

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-HINT-01 | Initial hint count | Start a new game | Hint button shows count of 3 |
| TC-HINT-02 | Use first hint | Tap hint button | Hint modal opens, count decreases to 2 |
| TC-HINT-03 | Hint image loads | Tap hint on a quest with a hint image | Loading state shown, then hint image displayed |
| TC-HINT-04 | No hint available | Tap hint on a quest without a hint image | Message: "No hint available for this clue." |
| TC-HINT-05 | Close hint | Tap "Close" on hint modal | Modal closes, returns to quest view |
| TC-HINT-06 | Reopen same hint | Close hint, then reopen on same quest | Hint shows again but count does NOT decrease further |
| TC-HINT-07 | Hint on new quest | Complete a quest, then use hint on next quest | Count decreases by 1 (new quest = new hint charge) |
| TC-HINT-08 | All hints used | Use all 3 hints | Hint button becomes disabled (greyed out) |
| TC-HINT-09 | Hint after game ends | Let timer expire, try hint button | Hint button is disabled |
| TC-HINT-10 | Hint count persists | Use 1 hint, refresh page | Hint count is still 2 after reload |

### 3.5 Game State Persistence

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-STATE-01 | Timer persists | Start a game, refresh the page | Timer resumes from where it would be (not reset) |
| TC-STATE-02 | Quest progress persists | Complete 2 quests, refresh | First 2 quests still marked completed, 3rd is active |
| TC-STATE-03 | Hints persist | Use 1 hint, refresh | Hints remaining is still 2 |
| TC-STATE-04 | Quest order persists | Start game, note quest order, refresh | Quest order is the same after refresh |
| TC-STATE-05 | Save & exit | Tap "Save & exit" → "Got it, exit" | Navigates to home; game can be continued later |
| TC-STATE-06 | Save & exit timer | Save & exit, wait 2 min, continue | Timer has advanced by ~2 min (timer doesn't pause) |
| TC-STATE-07 | Quit game | Tap "Quit game" → "Yes, quit" | All localStorage cleared, navigates to home, no "Continue" button |
| TC-STATE-08 | Cancel quit | Tap "Quit game" → "Keep playing" | Modal closes, game continues normally |
| TC-STATE-09 | Cancel save & exit | Tap "Save & exit" → "Keep playing" | Modal closes, game continues normally |
| TC-STATE-10 | Browser close warning | During active game, try to close/refresh browser tab | Browser shows "Leave site?" confirmation dialog |
| TC-STATE-11 | No warning after game ends | After game ends, try to close browser | No warning dialog |

### 3.6 Game Creation

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-MAKE-01 | Page loads | Navigate to `/make` | Form with General section and empty Quests section |
| TC-MAKE-02 | Add quest | Tap "+ Add quest" | New quest card appears with Title, Clue, and Hint image fields |
| TC-MAKE-03 | Remove quest | Add a quest, then tap "Remove" | Quest card is removed |
| TC-MAKE-04 | Submit empty form | Tap "Create game" with all fields empty | Error messages: "Game name is required.", "Your name is required.", "Game duration is required.", "Add at least one quest." |
| TC-MAKE-05 | Missing quest title | Add a quest with empty title | Error: "Quest 1 is missing a title." |
| TC-MAKE-06 | Missing quest clue | Add a quest with title but empty clue | Error: "Quest 1 is missing a clue." |
| TC-MAKE-07 | Valid submission | Fill all required fields, add 2 quests with titles and clues, submit | Loading state shown, then QR codes displayed |
| TC-MAKE-08 | QR codes displayed | After successful creation | One startup QR code + one QR code per quest, with clue text labels |
| TC-MAKE-09 | Attach hint image | In a quest card, select an image file | "Image attached" confirmation appears |
| TC-MAKE-10 | Image compression | Attach a large image (>1 MB) | Image is compressed before upload (verify network request size < 0.5 MB) |
| TC-MAKE-11 | Multiple quests | Add 5 quests with all fields | All 5 quests saved and all 5 QR codes displayed |
| TC-MAKE-12 | Duration formats | Enter `1.5h`, `30m`, `45m` | Each is accepted as valid |
| TC-MAKE-13 | Submit button disabled | Click submit | Button shows "Submitting..." and is disabled during request |
| TC-MAKE-14 | Network error | Disconnect network, submit | Error: "Network error. Please check your connection and try again." |

### 3.7 Browse Games

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-GAMES-01 | Page loads | Navigate to `/games` | Loading state, then grid of game cards |
| TC-GAMES-02 | Game card content | View a game card | Shows event name, creator name, duration, and creation date |
| TC-GAMES-03 | Click game card | Click a game card | QR codes for that game are displayed (startup + per-quest) |
| TC-GAMES-04 | Back button | After clicking a game, tap "← Back" | Returns to game list |
| TC-GAMES-05 | No games | When database has no games | Shows "No games found." |
| TC-GAMES-06 | Network error | Disconnect network, navigate to `/games` | Shows "Failed to load games. Please try again." |

### 3.8 Navigation & Theme

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-NAV-01 | Header visible | Navigate to `/`, `/make`, `/games`, `/about` | Header with CLUTCH brand and nav links is visible |
| TC-NAV-02 | Header hidden on quest | Navigate to `/quest` | Header is NOT displayed |
| TC-NAV-03 | Active link | Navigate to `/make` | "Make" link is highlighted with accent color |
| TC-NAV-04 | Brand link | Click "CLUTCH" in header | Navigates to `/` |
| TC-NAV-05 | Default theme | First visit (clear localStorage) | Dark theme is active |
| TC-NAV-06 | Switch to light | Click theme toggle (sun icon) | Background becomes light, text becomes dark |
| TC-NAV-07 | Switch to dark | In light mode, click theme toggle (moon icon) | Background becomes dark, text becomes light |
| TC-NAV-08 | Theme persists | Switch to light, refresh page | Light theme is still active |
| TC-NAV-09 | Theme in localStorage | Switch to light, check `localStorage.theme` | Value is `"light"` |

---

## 4. Edge Cases & Negative Testing

| TC | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| TC-EDGE-01 | Non-existent game | Navigate to `/quest?event=nonexistent` | Error message: "Looks like there aren't any games at the moment." |
| TC-EDGE-02 | Missing event parameter | Navigate to `/quest` (no query param) | Error message or empty state displayed |
| TC-EDGE-03 | Scan random QR code | During gameplay, scan a QR code not belonging to any quest | No quest is completed; game continues |
| TC-EDGE-04 | Scan quest out of order | Scan QR code for a locked (future) quest | Nothing happens; only the active quest's QR is accepted |
| TC-EDGE-05 | Scan already completed quest | Scan QR for a quest already completed | Nothing happens |
| TC-EDGE-06 | Timer already expired on load | Start a game, wait past the timer, then navigate back | Timer shows 00:00:00, game is in end state |
| TC-EDGE-07 | Large hint image upload | Upload a 5 MB image | Client compresses it; if still >2 MB server rejects with error |
| TC-EDGE-08 | Duplicate game name | Create two games with the same name | Both are created (no unique constraint); `GET /api/game?event=` returns the first match |
| TC-EDGE-09 | Special characters in game name | Create a game with name containing spaces, emojis, or symbols | Game is created and retrievable |
| TC-EDGE-10 | Rapid hint toggling | Open and close hint rapidly | Hint count only decreases once per quest |
| TC-EDGE-11 | Browser back during scan | Open scanner, press browser back | App handles navigation gracefully |
| TC-EDGE-12 | LocalStorage cleared externally | During gameplay, clear localStorage from DevTools | App shows loading/error state on next action |

---

## 5. Cross-Browser & Device Testing

### 5.1 Browser Matrix

| Browser | Platform | Priority |
|---------|----------|----------|
| Chrome (latest) | Android | High |
| Safari (latest) | iOS | High |
| Chrome (latest) | Desktop | Medium |
| Firefox (latest) | Desktop | Medium |
| Edge (latest) | Desktop | Low |
| Samsung Internet | Android | Low |

### 5.2 Device Considerations

| Test | What to Check |
|------|---------------|
| **Mobile portrait** | All UI fits within 520px max-width; no horizontal scroll |
| **Mobile landscape** | Layout remains usable; modals don't clip |
| **Camera permission** | Permission prompt appears; app handles allow and deny correctly |
| **PWA install** | "Add to Home Screen" prompt or option is available |
| **Offline behavior** | Service worker caches static assets; API calls fail gracefully |
| **Low bandwidth** | Hint images load with "Loading hint..." indicator; app remains usable |

### 5.3 Accessibility Checks

| Check | Expected |
|-------|----------|
| QR images have `alt` text | Yes — alt text includes game/quest context |
| Error messages are visible | Yes — displayed in red/error color |
| Buttons are tappable on mobile | Yes — minimum 52px height for all buttons |
| Color contrast (dark mode) | Text (#f4f1ee) on background (#0f0e0d) passes WCAG AA |
| Color contrast (light mode) | Text (#1a1917) on background (#f4f1ee) passes WCAG AA |
| Scanner error has `role="alert"` | Yes — `<p role="alert">` in BarcodeItem |
