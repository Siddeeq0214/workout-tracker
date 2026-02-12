# Pip-Boy 3000: Workout Tracker

A Fallout-inspired (Pip-Boy) workout tracking application built with **React Native** and **Expo**. Track your weekly workout routine, archive workouts, and manage gym memberships with a classic green terminal aesthetic.

## Features

### STATUS (Home)

- **Pip-Boy 3000 Interface**: Complete with scanline effects and terminal fonts.
- **Mission Statistics**: Track total training sessions and lift volume.
- **Logging Sequence**: Initiate and record new exercise data directly into the vault.

  <img width="359" height="800" alt="image" src="https://github.com/user-attachments/assets/ae725f80-e3a4-458f-84f2-7ed4e1f15331" />


### QUEST_LOG (Tasks)

- **Mission Parameters**: Create and manage workout routines as active quests.
- **Threat Levels**: Categorize quests by difficulty (Easy, Medium, Hard).
- **Deployment**: Quickly initiate a workout session from a pre-defined quest.

  <img width="359" height="800" alt="image" src="https://github.com/user-attachments/assets/9368d15a-5eeb-4304-ab86-dcc17c2d0257" />

### MEMBERSHIP_LOG (Payments)

- **Expenditure Tracking**: Monitor recurring gym/facility costs.
- **Status Indicator**: Real-time countdown for billing cycles (Days Remaining/Overdue).
- **Access Configuration**: Easily modify facility IDs, costs, and billing days.

### ARCHIVE_DATA (History)

- **Long-term Storage**: Review all past mission logs in a centralized archive.
- **Data Integrity**: Delete or verify old logs to keep the database optimized.

## Technical Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: React Navigation (Bottom Tab Navigator)
- **Icons**: @expo/vector-icons (Ionicons)
- **Styling**: Vanilla StyleSheet with a custom "Pip-Boy" design system.
- **Fonts**: Monofonto (Regular, Bold, Italic) for that authentic terminal feel.

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- Expo Go app on your mobile device (optional for testing)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Siddeeq0214/workout-tracker.git
   cd workout-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the terminal**:

   ```bash
   npx expo start
   ```

4. **Scan the QR Code**:
   Use the Expo Go app (Android/iOS) or an emulator to scan the QR code and boot up the system.

## Aesthetic Guidelines

- **Primary Color**: `#00FF41` (Pip-Boy Green)
- **Background**: `#041207` (Deep Terminal Black)
- **Typography**: All caps headers and monospaced fonts are mandatory for terminal compliance.

---

**WAR NEVER CHANGES. BUT YOUR GAINS SHOULD.**

