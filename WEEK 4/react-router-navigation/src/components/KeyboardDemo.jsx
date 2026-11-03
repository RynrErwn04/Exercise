import { useState} from 'react';

function KeyboardDemo() {
    const [inputValue, setInputValue] = useState('');
    const[KeyLog, setKeyLog] = useState([]);
    const [charCount, setCharCount] = useState(0);

    const handleKeyDown = (e) => {
        // Handle special keys\
        if (e.key === 'Enter') {
            e.preventDefault();
            alert(`You entered: ${inputValue}`);
        } else if (e.key === 'Escape') {
            setInputValue('');
            setCharCount(0);
        }else if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            alert('Ctrl+A pressed!');
    }

    //Log the key pressed
    setKeyLog(prev => [...prev.slice(-4),e.key]);
};

const handleChange = (e) => {
   const value = e.target.value;
   setInputValue(value);
    setCharCount(value.length);
};

const handleKeyUp = (e) => {
    console.log(`Key released: ${e.key}`);
};

return (
    <div>
        <h3>Keyboard Event Demo</h3>
    <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder="Type here...(Try Enter, Escape, or Ctrl+A)"
        />
        <p>Character Count: {charCount}</p>
        <p>Recent Keys: {KeyLog.join(', ')}</p>
        <small>
            Special commands:<br/>
            Enter: Show alert<br/>
            Escape: Clear input<br/>
            Ctrl+A: Show alert<br/>
        </small>
    </div>
);
}

export default KeyboardDemo;