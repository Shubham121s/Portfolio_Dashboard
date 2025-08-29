-- Create portfolio holdings table
CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id SERIAL PRIMARY KEY,
  stock_symbol VARCHAR(10) NOT NULL,
  stock_name VARCHAR(100) NOT NULL,
  purchase_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  sector VARCHAR(50),
  exchange_code VARCHAR(10) DEFAULT 'NSE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stock_data table for caching real-time data
CREATE TABLE IF NOT EXISTS stock_data (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  current_price DECIMAL(10, 2),
  pe_ratio DECIMAL(8, 2),
  latest_earnings DECIMAL(12, 2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample portfolio data
INSERT INTO portfolio_holdings (stock_symbol, stock_name, purchase_price, quantity, sector, exchange_code) VALUES
('RELIANCE', 'Reliance Industries Ltd', 2450.00, 10, 'Energy', 'NSE'),
('TCS', 'Tata Consultancy Services', 3200.00, 5, 'Technology', 'NSE'),
('INFY', 'Infosys Ltd', 1450.00, 8, 'Technology', 'NSE'),
('HDFCBANK', 'HDFC Bank Ltd', 1650.00, 12, 'Financials', 'NSE'),
('ITC', 'ITC Ltd', 420.00, 25, 'Consumer Goods', 'NSE');
