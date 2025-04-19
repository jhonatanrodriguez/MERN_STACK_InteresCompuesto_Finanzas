import logo from './logo.svg';
import './App.css';
import InteresSimple from './components/InteresSimple';
import DescuentoSimple from './components/DescuentoSimple';
import InteresCompuesto from './components/InteresCompuesto';
import DescuentoCompuesto from './components/DescuentoCompuesto';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element= {<InteresSimple/>} />
        <Route path='/descuentoSimple' element= {<DescuentoSimple/>} />
        <Route path='/interesCompuesto' element= {<InteresCompuesto/>} />
        <Route path='/descuentoCompuesto' element= {<DescuentoCompuesto/>} />
      </Routes>
    </div>
  );
};
export default App;
