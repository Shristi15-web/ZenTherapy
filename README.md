# PanchakarmaPlus - Ayurvedic Therapy Management System

A comprehensive **70% functional prototype** for managing Panchakarma therapies, featuring automated scheduling, intelligent notifications, real-time progress tracking, and integrated feedback loops.

🚀 **Development server is running at: http://localhost:8080/**

## 🌟 Key Features

### ✅ Automated Therapy Scheduling

- Smart conflict detection and practitioner availability matching
- Therapy type optimization with automatic room assignment
- Pre-session checklist generation

### ✅ Multi-Channel Notification System

- In-app, email, and SMS notifications
- Contextual pre-care, post-care, and progress alerts
- Priority-based routing system

### ✅ Real-time Progress Tracking

- Visual milestone tracking with Recharts integration
- Automated progress calculations from feedback
- Wellness metrics and achievement badges

### ✅ Integrated Feedback Loop

- Post-session feedback collection
- Automatic progress updates and smart recommendations
- Alert generation for concerning patterns

## 🎯 Interactive Demo

Visit **http://localhost:8080/demo** for a complete demonstration of:

- Complete workflow simulation from scheduling to progress tracking
- Real-time feature demos with mock data interaction
- All 70% functional prototype capabilities

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Data**: localStorage-based persistence (no database required)
- **Visualization**: Recharts for progress tracking
- **Navigation**: React Router with responsive design

## 📊 Core Entities

- **Patient** - Demographics, medical history, preferences
- **TherapySession** - Scheduled sessions with care instructions
- **Feedback** - Post-session evaluations with mood tracking
- **Notification** - Multi-channel alerts with priority levels
- **ProgressMilestone** - Trackable health goals with metrics

## 🔄 Workflow Integration

```
Session Booking → Pre-Care Notifications → Therapy Session →
Post-Session Feedback → Progress Updates → Recommendations →
Adjusted Treatment Plan → Next Session Booking
```

**PanchakarmaPlus** - Ancient Ayurvedic wisdom meets modern digital automation for personalized therapy management.

## Project info

**URL**: https://lovable.dev/projects/4a1011df-5cd6-40ca-9634-8d4b41bad16c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4a1011df-5cd6-40ca-9634-8d4b41bad16c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4a1011df-5cd6-40ca-9634-8d4b41bad16c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
