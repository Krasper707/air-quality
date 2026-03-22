# 🌍 Global AQI Monitor

A real-time, interactive air quality dashboard that tracks pollution levels from over 30,000 stations worldwide. This app identifies the most polluted locations on Earth and provides actionable health recommendations based on live AQI (Air Quality Index) data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## ✨ Features

- **Global Heatmap:** Interactive dark-mode map visualizing pollution levels using color-coded markers.
- **Pollution Leaderboard:** A "Hall of Shame" automatically ranking the top 15 most polluted cities currently being tracked.
- **Smart Search:** Search any city globally with a debounced search bar and "fly-to" map animations.
- **Marker Clustering:** High-performance rendering of thousands of data points using marker clustering.
- **Health Advice:** Dynamic health recommendations (e.g., "Wear an N95 mask") based on specific AQI thresholds.
- **Geolocation:** One-click "Locate Me" feature to instantly check the air quality in your current area.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 with Vite
- **Language:** TypeScript
- **Mapping:** Leaflet & React-Leaflet
- **Data Source:** [World Air Quality Index (WAQI) API](https://aqicn.org/api/)
- **Styling:** Custom CSS3 (Dark Theme)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- A free API Token from [WAQI API](https://aqicn.org/data-platform/token/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Krasper707/air-quality.git
    cd air-quality
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your API token:

    ```env
    VITE_WAQI_API_TOKEN=your_token_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🧠 Future Roadmap

- [ ] **Historical Data:** Add charts to show AQI trends over the last 24 hours.
- [ ] **Wind Overlay:** Integrate wind speed and direction to show how pollution travels.
- [ ] **Comparison Tool:** Compare air quality between two cities side-by-side.
- [ ] **Mobile App:** Convert the project into a PWA (Progressive Web App).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contact

Karthik Murali M

Project Link: [https://github.com/your-username/global-aqi-monitor](https://github.com/your-username/global-aqi-monitor)
