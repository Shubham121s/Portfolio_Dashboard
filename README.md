

# 📊 Portfolio Dashboard

A dynamic portfolio dashboard built with **Next.js (React framework)** and **Node.js**, designed to provide real-time insights into stock portfolio performance. The app fetches stock market data (Current Market Price, P/E Ratio, Latest Earnings, etc.) from external APIs like Yahoo Finance and Google Finance, processes it, and displays it in an interactive, visually appealing dashboard.

---

## 🚀 Features

* **Real-Time Stock Data**

  * Fetches CMP (Current Market Price) from Yahoo Finance
  * Fetches P/E Ratio and Latest Earnings from Google Finance

* **Portfolio Table**

  * Stock Name, Purchase Price, Quantity
  * Investment Value, Present Value, Gain/Loss
  * Portfolio % allocation, Exchange Code
  * P/E Ratio & Latest Earnings

* **Dynamic Updates**

  * Auto-refresh every 15 seconds
  * Optional WebSocket support for real-time updates

* **Visual Indicators**

  * Green = Gains
  * Red = Losses

* **Sector Grouping**

  * Groups stocks by sector (e.g., Technology, Financials)
  * Shows sector-level summaries: Total Investment, Total Present Value, Gain/Loss

* **Responsive UI**

  * Adaptive layout for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/) (React framework)
* **Backend**: Node.js
* **Data Sources**:

  * Yahoo Finance (CMP)
  * Google Finance (P/E Ratio, Earnings)
* **Data Format**: JSON

---


---

## ⚡ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/portfolio-dashboard.git
cd portfolio-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

App will be running at: [http://localhost:3000](http://localhost:3000)

---

## 🔗 API Integration

### Yahoo Finance API (CMP)

* Used to fetch live stock prices.
* Since no public API exists, you may use scraping/unofficial libraries such as:

  * [`yahoo-finance2`](https://www.npmjs.com/package/yahoo-finance2)

### Google Finance API (P/E Ratio & Earnings)

* Requires scraping/unofficial solutions.
* Example: Puppeteer or unofficial finance libraries.

---

## ⚙️ Implementation Steps

1. **Set up Next.js Project** – Scaffold using `create-next-app`
2. **Design Data Model** – Define stock & portfolio schema
3. **API Integration** – Fetch data from Yahoo & Google Finance
4. **Portfolio Table Component** – Render table with `react-table`
5. **Dynamic Updates** – Auto-refresh using `setInterval` (15s)
6. **Sector Grouping** – Summarize sector-level data
7. **Visual Indicators** – Green/Red CSS for gains/losses
8. **Error Handling** – Catch & display errors gracefully
9. **Optimize Performance** – Use caching & memoization
10. **Deployment** – Deploy on Vercel/Netlify

---



## 📦 Deployment

Deploy easily with [Vercel](https://vercel.com/) (recommended for Next.js):

```bash
npm run build
npm run start
```

---

## 📌 Future Enhancements

* WebSocket-based live updates
* User authentication & watchlist support
* Graphs & charts for stock performance
* Export portfolio to CSV/Excel

---

mat** so you can directly drop it into your project?
