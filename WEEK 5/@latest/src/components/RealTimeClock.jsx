import { useState, useEffect } from 'react';

function RealTimeClock() {
    const [time, setTime] = useState(new Date());
    const [isRunning , setIsRunning] = useState(true);
    const [format24Hour, setFormat24Hour] = useState(false);


    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setTime(new Date());
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        document.title = `Clock: - ${formatTime(time)}`;

        return () => {
            document.title = 'React App';
        };
    }, [time, format24Hour]);

    const formatTime = (date) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !format24Hour,
        };
        return date.toLocaleTimeString('en-US', options);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className="clock-container">
            <div className="date">{formatDate(time)}</div>
            <div className="time">{formatTime(time)}</div>

            <div className="controls">
                <button onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Pause' : 'Resume'}
                </button>
                <label>
                    <input
                        type="checkbox"
                        checked={format24Hour}
                        onChange={(e) => setFormat24Hour(e.target.checked)}
                    />
                    24-Hour Format
                </label>
            </div>
        </div>
    );
}

export default RealTimeClock;