import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/Navbar';
import './App.css';
import TablePatientRegister from '../components/TablePatientRegister'
function App() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <TablePatientRegister />
    </>
  );
}

export default App;
