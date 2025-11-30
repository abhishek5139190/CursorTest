# Honest Health Tracker

A wellness tracking web app for busy professionals, built with vanilla JavaScript and powered by Google Gemini API.

## Features

- **Daily Check-in**: Quick wellness check-in with sleep, mood, water, and movement tracking
- **AI-Powered Insights**: Personalized micro-habits and wellness suggestions from Gemini AI
- **Metric Tracking**: Track steps, water intake, sleep, and stress levels
- **Dashboard**: View all your wellness metrics at a glance
- **Detail Screens**: Deep dive into each metric with charts and insights
- **Mobile-First Design**: Responsive design that works on all devices

## Setup Instructions

### 1. Add Your Gemini API Key

1. Open `js/gemini.js`
2. Find the line: `const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `'YOUR_API_KEY_HERE'` with your actual Gemini API key
4. Save the file

### 2. Get a Gemini API Key

If you don't have a Gemini API key yet:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it into `js/gemini.js` as described above

### 3. Run the App

Simply open `index.html` in a web browser. No build process or server required!

**Recommended**: Use a local web server for better experience:
- Python: `python -m http.server 8000`
- Node.js: `npx http-server`
- VS Code: Use Live Server extension

Then open `http://localhost:8000` in your browser.

## Project Structure

```
/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Global styles and design system
│   ├── components.css     # Reusable component styles
│   └── screens.css        # Screen-specific styles
├── js/
│   ├── app.js             # Main app controller and routing
│   ├── state.js           # State management
│   ├── storage.js         # localStorage helpers
│   ├── gemini.js          # Gemini API integration
│   ├── screens/           # Screen modules
│   │   ├── onboarding.js
│   │   ├── dashboard.js
│   │   ├── sleep.js
│   │   ├── steps.js
│   │   ├── stress.js
│   │   ├── water.js
│   │   ├── checkin.js
│   │   ├── loading.js
│   │   └── results.js
│   └── components/        # Reusable components
│       ├── navigation.js
│       ├── metric-card.js
│       ├── progress-bar.js
│       └── chart.js
└── README.md
```

## How to Use

1. **First Time**: You'll see the onboarding screen to select wellness routines
2. **Dashboard**: View your daily metrics and access all features
3. **Check-in**: Click "Check-in now" to log your daily wellness data
4. **Get AI Insights**: After check-in, receive personalized micro-habits
5. **Track Metrics**: Click on any metric card to see detailed tracking

## Features Overview

### Daily Check-in Flow
1. Enter sleep hours (slider)
2. Select mood/stress level (1-5)
3. Enter water intake in ml
4. Optionally select movement level
5. Submit to get AI-powered wellness suggestions

### AI Wellness Response
The app generates 5 personalized sections:
- **Physical Reset**: Quick movement suggestions
- **Mind Reset**: Breathing and calming techniques
- **Lifestyle Boost**: Small habits for mood/energy
- **Honest Insight**: Friendly, relatable observations
- **Daily Suggestion**: Practical tip for the rest of the day

### Data Persistence
All data is stored locally in your browser using localStorage. No account required!

## Browser Support

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires JavaScript enabled and localStorage support.

## Troubleshooting

### API Key Issues
- Make sure you've replaced `YOUR_API_KEY_HERE` with your actual key
- Verify the API key is valid and has access to Gemini models
- Check browser console for error messages

### Data Not Saving
- Ensure localStorage is enabled in your browser
- Check browser console for errors
- Try clearing browser cache and reloading

### Charts Not Displaying
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

## Notes

- All data is stored locally in your browser
- No internet connection required after initial load (except for Gemini API calls)
- The app uses hash-based routing (`#dashboard`, `#sleep`, etc.)
- Sample data is included for demonstration purposes

## License

This project is built for demonstration purposes.
