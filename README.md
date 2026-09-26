# Employee Performance Analytics & ML Trend Dashboard
Built with **Next.js**, **Chart.js**, and custom **Machine Learning algorithms** (K-Means Clustering + Linear Regression).

---

## 🎯 Project Overview
In many companies, daily work reports are submitted in a shared central Excel sheet or Google Sheet. This dashboard connects to that central sheet, parses daily logs across all team members, and provides:
1. **Performance Trends:** Daily, Weekly, and Monthly roll-ups.
2. **Machine Learning Intelligence:**
   - **K-Means Clustering (k = 3):** Groups employees into performance tiers:
     - 🌟 **Tier 1:** Star Performers (High quality, timely delivery, minimal blockers).
     - ⚖️ **Tier 2:** Steady Core (Consistent contributors).
     - ⚠️ **Tier 3:** Needs Attention / Support (Low progress, high blocker severity, or overtime).
   - **Linear Regression (Trend Scoring):** Calculates the trajectory slope ($y = mx + c$) to predict upcoming performance and identify burnout or downward trends early.
3. **Single Employee Deep-Dive:** Click on any employee (e.g., *Sneha Reddy*) to see their personal efficiency ratio, progression curve, and exact day-by-day logs.
4. **Dual Data Sources:**
   - **📁 Central Excel Upload (.xlsx / .csv):** Drag and drop your company's central sheet.
   - **🌐 Google Sheet Live Link:** Live cloud sync from shared Google Sheets.
   - **⚡ Pre-loaded Demo Data:** 20 employees ready out of the box with Sneha Reddy's exact 19-day data.

---

## 📂 Minimal Project Structure
Only essential files — no unnecessary boilerplate or folders:

```
d:/task2 performance/
├── package.json               # Next.js, Chart.js, Lucide-react, XLSX
├── next.config.mjs            # Next.js configuration
├── README.md                  # Student project explanation & viva guide
└── src/
    ├── app/
    │   ├── globals.css        # Clean, modern vanilla CSS design system
    │   ├── layout.js          # Next.js App Router root layout
    │   └── page.js            # Main interactive Dashboard + Employee Modal
    ├── data/
    │   └── reportData.js      # 20 staff records with exact PDF fields for Sneha Reddy
    └── utils/
        └── mlEngine.js        # K-Means clustering, Linear Regression & sheet parsers
```

---

## 🧠 How the Machine Learning Works (Viva / Presentation Guide)

### 1. Linear Regression (Trend Prediction)
- **Formula:** $y = mx + c$
- **Slope ($m$):** 
  $$m = \frac{N \sum(xy) - (\sum x)(\sum y)}{N \sum(x^2) - (\sum x)^2}$$
- **Interpretation:**
  - $m > +0.4$ ➔ **Improving (📈)**
  - $-0.4 \le m \le +0.4$ ➔ **Steady (➖)**
  - $m < -0.4$ ➔ **Declining / At-Risk (📉)**
- **Next Day Prediction:** Evaluates $y = m(N+1) + c$ to predict the expected score.

### 2. K-Means Clustering (Performance Tiers)
- Extracts 4 normalized features per employee (0 to 1 scale):
  1. Average Quality Rating (1–5)
  2. Time Efficiency (Planned Hours / Actual Hours)
  3. Average Progress % (0–100%)
  4. Roadblock / Blocker severity score
- Uses **Euclidean Distance** to cluster team members into 3 performance tiers ($k = 3$):
  $$d(x, c) = \sqrt{\sum (x_i - c_i)^2}$$
- Iteratively recalculates centroids until convergence.

---

## 🚀 How to Run Locally

1. Open your terminal in this folder:
   ```bash
   cd "d:/task2 performance"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```
