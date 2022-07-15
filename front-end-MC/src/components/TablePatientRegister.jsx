import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import './TablePatientRegister.css'
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TablePatientRegister() {
  const [patients, setPatients] = useState([{ name: "", dateBirth: "", email: "", address: "" }]);
  const [errors, setErrors] = useState([]);
  async function deleteData(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/patientRegister/${id}`)
      getPatients();
    } catch (e) {
      setErrors(["Paciente não pôde ser exluido."]);
    }
  }
  async function getPatients() {
    try {
      const patientList = await axios.get(`${process.env.REACT_APP_API_URL}/patientRegister`);
      setPatients(patientList.data)
    } catch (e) {
      setErrors(["Erro ao tentar carregar os registros."]);
    }
  }
  useEffect(() => {
    getPatients();
  }, [])

  return (
    <>
      {errors.length > 0 && <Alert severity="error" sx={{ fontSize: "16px" }}>{errors.map((error) => (
        <p key={error}>
          {error}
        </p>
      ))}</Alert>}
      <Box
        sx={{
          width: "75%",
          height: "auto",
          margin: "70px auto"
        }}
      >
        <TableContainer component={Paper} variant="outlined" sx={{ width: "auto" }}>
          <Table className="responsiveTable" aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell component="th" scope="col">Nome do Paciente</StyledTableCell>
                <StyledTableCell component="th" scope="col">Data de Nascimento</StyledTableCell>
                <StyledTableCell component="th" scope="col">E-mail</StyledTableCell>
                <StyledTableCell component="th" scope="col">Endereço</StyledTableCell>
                <StyledTableCell component="th" scope="col">Editar</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <StyledTableRow key={patient.name}>
                  <StyledTableCell data-label="Nome" component="td" scope="row">
                    <Typography whiteSpace="wrap" textOverflow="ellipsis" overflow="hidden" sx={{ fontSize: "0.9rem" }}>
                      {patient.name}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell data-label="Nascimento" component="td">
                    <Typography whiteSpace="wrap" textOverflow="ellipsis" overflow="hidden" sx={{ fontSize: "0.9rem" }}>
                      {patient.birthDate}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell data-label="Email" component="td">
                    <Typography whiteSpace="wrap" textOverflow="ellipsis" overflow="hidden" sx={{ fontSize: "0.9rem" }}>
                      {patient.email}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell data-label="Endereço" component="td">
                    <Typography whiteSpace="wrap" textOverflow="ellipsis" overflow="hidden" sx={{ fontSize: "0.9rem" }}>
                      {patient.address}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell data-label="Editar" component="td"> <Link color="inherit" href={`${process.env.REACT_APP_URL}/patientRegisters/${patient._id}`}><EditIcon sx={{ cursor: "pointer" }} /></Link> <DeleteIcon onClick={() => {
                    deleteData(patient._id)
                  }} sx={{ cursor: "pointer" }} /> </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default TablePatientRegister;