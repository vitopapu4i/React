import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [counters, setCounters] = useState(Array(5).fill(0));
  const [active, setActive] = useState(null);

  const handleClick = (index) => {
    const newCounters = [...counters];
    newCounters[index] += 1; // Увеличиваем счетчик на единицу
    setCounters(newCounters);
    setActive(index);
  };

  return (
    <div>
      {counters.map((count, index) => (
        <button className={`btn ${active === index ? 'btn-success' : 'btn-primary'} m-2`} onClick={() => handleClick(index)}>
          {count}
        </button>))}
    </div>
  );
};

export default App;