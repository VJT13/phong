import { createContext, useContext, useState, useEffect } from 'react';
import { defaultData } from '../data/defaultData';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('admin_token'));

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok && result.token) {
        localStorage.setItem('admin_token', result.token);
        setToken(result.token);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: result.error || 'Đăng nhập thất bại' };
    } catch (err) {
      console.error("Authentication error:", err);
      return { success: false, error: 'Không thể kết nối đến máy chủ xác thực' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio data: ${response.statusText}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      console.warn("Could not fetch data from Express backend, falling back to local defaults.", err);
      setError("Express backend disconnected. Running in client-only fallback mode.");
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolio = async (updatedData) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers,
        body: JSON.stringify(updatedData),
      });

      if (response.status === 401) {
        logout();
        return { success: false, error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };
      }

      if (!response.ok) {
        throw new Error(`Failed to update portfolio data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.data);
      return { success: true };
    } catch (err) {
      console.error("Error saving to database:", err);
      setData(updatedData);
      return { 
        success: false, 
        error: "Không thể lưu thay đổi vào MongoDB. Lưu tạm thời trong bộ nhớ trình duyệt." 
      };
    }
  };

  const getInquiries = async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('/api/inquiries', { headers });
      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteInquiry = async (id) => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.status === 401) {
        logout();
        return { success: false, error: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }
      return await response.json();
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      return { success: false, error: err.message };
    }
  };

  const resetToDefault = async () => {
    return await updatePortfolio(defaultData);
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ 
      data, 
      loading, 
      error, 
      token,
      isAuthenticated,
      login,
      logout,
      updatePortfolio, 
      resetToDefault, 
      getInquiries,
      deleteInquiry,
      refreshData: fetchPortfolioData 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
