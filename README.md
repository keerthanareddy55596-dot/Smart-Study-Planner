# Study Timetable

A responsive Study Timetable web app for the **Smart Study Planner** project, built with HTML, CSS, and vanilla JavaScript.

## Features

- Add study sessions with subject, topic, date, start/end time, and study type
- Edit and delete existing sessions
- Filter sessions by date
- Dashboard statistics for total sessions, today's sessions, and unique subjects
- Saves timetable entries in browser local storage
- Responsive layout for desktop, tablet, and mobile
- Validates that the end time is later than the start time

## Project files

```text
study-timetable/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

1. Download or extract the project ZIP.
2. Open `index.html` in a modern web browser.
3. Add your study sessions using the form.

No installation or server is required.

## GitHub upload

1. Create a repository named `study-timetable` (or add these files to your existing `smart-study-planner` repository).
2. Upload `index.html`, `style.css`, `script.js`, and `README.md`.
3. Commit the files.

### Publish with GitHub Pages

1. Open your repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the `main` branch and `/ (root)` folder, then save.
4. Wait for GitHub Pages to publish the site.

## Data note

Sessions are stored in the current browser using local storage. They do not sync between devices or browsers, and clearing browser data may remove them. A production SaaS version would need authentication and a backend database.

## License

You may use and modify this project for learning and student-project purposes.
