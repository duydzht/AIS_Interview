import './App.css';
import { BrowserRouter } from 'react-router-dom';
import React  from 'react';
import Main from './components/MainComponent';

function App() {
    return (
        <div className='App'>
            <BrowserRouter>
                <Main />
            </BrowserRouter>
        </div>
    );
}

export default App;
