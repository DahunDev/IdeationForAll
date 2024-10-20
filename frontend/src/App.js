import logo from './logo.svg';
import './App.css';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}
      <div>
         <RegisterPage /> {/* Use the RegisterPage component */}
       </div>
    </div>    
  );
}

export default App;
