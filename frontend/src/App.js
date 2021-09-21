import './App.css';
import Upload from './Upload.js'
import Dashboard from './Dashboard.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dermeyetology</h1>
        <Upload />
        <Dashboard />
      </header>
    </div>
  );
}

export default App;
