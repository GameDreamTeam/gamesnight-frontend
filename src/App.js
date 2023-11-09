import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [pingResponse, setPingResponse] = useState('');

  const getPingResponse = () => {
    axios.get('http://localhost:8080/health')
      .then(response => {
        setPingResponse(response.data.status);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Click the button to get the health of Go server.
        </p>
        <button onClick={getPingResponse}>
          Ping Server
        </button>
        {pingResponse && <p>Response: {pingResponse}</p>}
      </header>
    </div>
  );
}

export default App;
