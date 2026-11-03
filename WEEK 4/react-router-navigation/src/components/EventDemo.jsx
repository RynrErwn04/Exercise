function EventDemo() {
  const handleEvent = (e) => {
    //Prevent default browser behaviour
    e.preventDefault();

    //Stop event bubbling
    e.stopPropagation();

    // Common properties 
    console.log('Event type:', e.type);
    console.log('Target:', e.target);
    console.log('Current Target:', e.currentTarget);
    console.log('Key pressed:', e.key);
    console.log('Mouse button:', e.button);
  };

  return <input onKeyDown={handleEvent} />;
}

export default EventDemo;