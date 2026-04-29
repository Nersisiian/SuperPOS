import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CashierPage from './pages/CashierPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CashierPage />} />
      </Routes>
    </BrowserRouter>
  );
}
