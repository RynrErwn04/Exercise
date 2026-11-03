import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // <--- 1. IMPORT THIS

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (Math.random() > 0.3) { // 70% success rate
        setUser({
          id: 1,
          name: 'Erwan',
          role: 'admin',
          avatar: 'data:image/jpeg;base64,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'
        });
        setNotifications([
          { id: 1, message: 'Welcome back!', type: 'success' },
          { id: 2, message: 'You have 3 pending tasks', type: 'info' }
        ]);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    setError(null);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        {user ? (
          <div className="user-info">
            <img src={user.avatar} alt="Avatar" width="40" height="40" style={{ borderRadius: '50%' }} />
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        )}
      </header>

      <main>
        {error && (
          <div className="error-banner">
            <p>❌ BOOOOOOO {error}</p>
            <button onClick={() => setError(null)}>x</button>
          </div>
        )}

        {/* 2. COMBINED LOTTIE LOADING ANIMATION HERE */}
        {isLoading && (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px', // adjust height as needed to center vertically inside the container
    textAlign: 'center'
  }}>
    <DotLottieReact
      src="https://lottie.host/09a36470-22c8-42b3-abf5-24972df3f8af/xgmy5kErQh.json"
      loop
      autoplay
      style={{ width: "150px", height: "150px" }}
            />
            <p>Tunggu Jap..</p>
          </div>
        )}

        {user ? (
          <div className="dashboard-content">
            <h2>Welcome to your dashboard, {user.name}!</h2>

            {user.role === 'admin' && (
              <div className="admin-panel">
                <h3>Admin Controls</h3>
                <button>Manage Users</button>
                <button>View Analytics</button>
                <button>System Settings</button>
              </div>
            )}

            {notifications.length > 0 && (
              <div className="notifications">
                <h3>Notifications ({notifications.length})</h3>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification ${notification.type}`}
                  >
                    <span>{notification.message}</span>
                    <button onClick={() => dismissNotification(notification.id)}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {notifications.length === 0 && (
              <p>No new notifications</p>
            )}
          </div>
        ) : (
          /* WELCOME MESSAGE SHOWN ONLY WHEN NOT LOADING AND NO ERROR */
          !isLoading && !error && (
            <div className="welcome-message">
              <h2>Please log in to access your dashboard</h2>
              <p>Click the login button to get started</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default Dashboard;