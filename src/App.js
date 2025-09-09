import logo from './logo.svg';
import './App.css';
import AuthPage from './components/AuthPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TodoScreen from './components/TodoScreen';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage/>}/>
        <Route path='/todoscreen' element={<TodoScreen/>}/>
        </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
