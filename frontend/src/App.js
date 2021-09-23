import './App.css';
import Upload from './Upload.js'
import Dashboard from './Dashboard.js'
import Login from './Login.js'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/upload">
              <Upload />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </div>
      </Router>
      {/* <header className="App-header">
        <h1>Dermeyetology</h1>
        <Upload />
        <Dashboard />
      </header> */}
    </div>
  );
}

export default App;
