import { useEffect, useMemo, useRef, useState } from 'react';
import './WindowTracker.css';

function WindowTracker() {
  const isBrowser = typeof window !== 'undefined';

  const [windowSize, setWindowSize] = useState({
    width: isBrowser ? window.innerWidth : 0,
    height: isBrowser ? window.innerHeight : 0
  });

  const [scrollPosition, setScrollPosition] = useState({
    x: isBrowser ? window.scrollX : 0,
    y: isBrowser ? window.scrollY : 0
  });

  const [scrollDirection, setScrollDirection] = useState('None');

  const [isOnline, setIsOnline] = useState(
    isBrowser ? navigator.onLine : true
  );

  const [isVisible, setIsVisible] = useState(
    isBrowser ? !document.hidden : true
  );

  const [isFocused, setIsFocused] = useState(
    isBrowser ? document.hasFocus() : true
  );

  const [lastActivity, setLastActivity] = useState(new Date());

  const previousScrollY = useRef(0);
  const ticking = useRef(false);

  // -----------------------------
  // Window Resize
  // -----------------------------
  useEffect(() => {
    if (!isBrowser) return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      setLastActivity(new Date());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isBrowser]);

  // -----------------------------
  // Scroll Tracking
  // -----------------------------
  useEffect(() => {
    if (!isBrowser) return;

    previousScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          setScrollPosition({
            x: window.scrollX,
            y: currentY
          });

          if (currentY > previousScrollY.current) {
            setScrollDirection('Down ↓');
          } else if (currentY < previousScrollY.current) {
            setScrollDirection('Up ↑');
          }

          previousScrollY.current = currentY;

          setLastActivity(new Date());

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isBrowser]);

  // -----------------------------
  // Internet Connection
  // -----------------------------
  useEffect(() => {
    if (!isBrowser) return;

    const handleOnline = () => {
      setIsOnline(true);
      setLastActivity(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastActivity(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isBrowser]);

  // -----------------------------
  // Page Visibility
  // -----------------------------
  useEffect(() => {
    if (!isBrowser) return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      setLastActivity(new Date());

      console.log(
        document.hidden
          ? 'Page is hidden'
          : 'Page is visible'
      );
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [isBrowser]);

  // -----------------------------
  // Window Focus
  // -----------------------------
  useEffect(() => {
    if (!isBrowser) return;

    const handleFocus = () => {
      setIsFocused(true);
      setLastActivity(new Date());
    };

    const handleBlur = () => {
      setIsFocused(false);
      setLastActivity(new Date());
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isBrowser]);

  // -----------------------------
  // Save Data To Local Storage
  // -----------------------------
  useEffect(() => {
    if (!isBrowser) return;

    const data = {
      windowSize,
      scrollPosition,
      scrollDirection,
      isOnline,
      isVisible,
      isFocused,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(
      'windowTracker',
      JSON.stringify(data)
    );
  }, [
    windowSize,
    scrollPosition,
    scrollDirection,
    isOnline,
    isVisible,
    isFocused,
    isBrowser
  ]);

  // -----------------------------
  // Calculated Values
  // -----------------------------

  const aspectRatio = useMemo(() => {
    if (!windowSize.height) return 0;

    return (
      windowSize.width / windowSize.height
    ).toFixed(2);
  }, [windowSize]);

  const viewportType = useMemo(() => {
    if (windowSize.width < 576) return 'Small Mobile';

    if (windowSize.width < 768) return 'Mobile';

    if (windowSize.width < 1024) return 'Tablet';

    if (windowSize.width < 1440) return 'Desktop';

    return 'Large Desktop';
  }, [windowSize.width]);

  const orientation = useMemo(() => {
    if (windowSize.width > windowSize.height) {
      return 'Landscape';
    }

    if (windowSize.height > windowSize.width) {
      return 'Portrait';
    }

    return 'Square';
  }, [windowSize]);

  const totalScrolled = useMemo(() => {
    return Math.round(
      Math.sqrt(
        scrollPosition.x ** 2 +
          scrollPosition.y ** 2
      )
    );
  }, [scrollPosition]);

  const scrollPercentage = useMemo(() => {
    if (!isBrowser) return 0;

    const documentHeight =
      document.documentElement.scrollHeight;

    const availableScroll =
      documentHeight - window.innerHeight;

    if (availableScroll <= 0) return 0;

    return Math.min(
      100,
      Math.round(
        (scrollPosition.y / availableScroll) * 100
      )
    );
  }, [scrollPosition.y, isBrowser]);

  const pixelRatio = isBrowser
    ? window.devicePixelRatio
    : 1;

  // -----------------------------
  // Reset Tracker
  // -----------------------------
  const resetTracker = () => {
    if (!isBrowser) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    setScrollPosition({
      x: 0,
      y: 0
    });

    setScrollDirection('None');

    localStorage.removeItem('windowTracker');

    setLastActivity(new Date());
  };

  return (
    <div className="window-tracker">

      <div className="tracker-header">

        <div>
          <h2>Browser Analytics Dashboard</h2>

          <div>


  <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXHbRlEGCh4Oyzp-HsOZXWq_jbOydUU0vJ6z2HUEY_WQ&s=10"
    alt="Dashboard"
    className="dashboard-image"
  />


</div>

          <p>
            Real-time browser and viewport monitoring
          </p>
        </div>

        <button onClick={resetTracker}>
          Reset Tracker
        </button>

      </div>

      {/* Scroll Progress */}

      <div className="progress-container">

        <div
          className="progress-bar"
          style={{
            width: `${scrollPercentage}%`
          }}
        />

      </div>

      <p>
        Page Progress: {scrollPercentage}%
      </p>

      {/* Main Dashboard */}

      <div className="info-grid">

        {/* Window Size */}

        <div className="info-card">

          <h3>🖥 Window Size</h3>

          <p>
            Width:
            <strong>
              {' '}
              {windowSize.width}px
            </strong>
          </p>

          <p>
            Height:
            <strong>
              {' '}
              {windowSize.height}px
            </strong>
          </p>

          <p>
            Aspect Ratio:
            <strong>
              {' '}
              {aspectRatio}
            </strong>
          </p>

        </div>

        {/* Scroll */}

        <div className="info-card">

          <h3>📜 Scroll Position</h3>

          <p>
            X:
            <strong>
              {' '}
              {scrollPosition.x}px
            </strong>
          </p>

          <p>
            Y:
            <strong>
              {' '}
              {scrollPosition.y}px
            </strong>
          </p>

          <p>
            Direction:
            <strong>
              {' '}
              {scrollDirection}
            </strong>
          </p>

          <p>
            Total Distance:
            <strong>
              {' '}
              {totalScrolled}px
            </strong>
          </p>

        </div>

        {/* Connection */}

        <div className="info-card">

          <h3>🌐 Connection</h3>

          <p
            className={
              isOnline
                ? 'online'
                : 'offline'
            }
          >
            {isOnline
              ? '🟢 Online'
              : '🔴 Offline'}
          </p>

        </div>

        {/* Device */}

        <div className="info-card">

          <h3>📱 Device</h3>

          <p>
            Type:
            <strong>
              {' '}
              {viewportType}
            </strong>
          </p>

          <p>
            Orientation:
            <strong>
              {' '}
              {orientation}
            </strong>
          </p>

          <p>
            Pixel Ratio:
            <strong>
              {' '}
              {pixelRatio}
            </strong>
          </p>

        </div>

        {/* Page Status */}

        <div className="info-card">

          <h3>👁 Page Status</h3>

          <p>
            Visibility:
            <strong>
              {' '}
              {isVisible
                ? 'Visible'
                : 'Hidden'}
            </strong>
          </p>

          <p>
            Window:
            <strong>
              {' '}
              {isFocused
                ? 'Focused'
                : 'Not Focused'}
            </strong>
          </p>

        </div>

        {/* Activity */}

        <div className="info-card">

          <h3>⚡ Activity</h3>

          <p>
            Last Activity:
          </p>

          <strong>
            {lastActivity.toLocaleTimeString()}
          </strong>

        </div>

      </div>

      {/* Scroll Demo */}

      <div
        className="scroll-area"
        style={{
          height: '200vh'
        }}
      >

        <h2>
          Keep scrolling ↓
        </h2>

        <p>
          Scroll position and percentage update
          automatically.
        </p>

      </div>

    </div>
  );
}

export default WindowTracker;