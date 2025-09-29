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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with localStorage support

### Installation
```sh
# Clone the repository
git clone https://github.com/Shristi15-web/ZenTherapy.git
cd ZenTherapy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Experience
- Visit `/demo` for interactive feature demonstration
- Explore `/dashboard` for patient management
- Test `/schedule` for session booking
- View `/progress` for milestone tracking
- Try `/feedback` for therapy evaluation

**PanchakarmaPlus** - Ancient Ayurvedic wisdom meets modern digital automation for personalized therapy management.
