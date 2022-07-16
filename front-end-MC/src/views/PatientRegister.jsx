import Navbar from "../components/Navbar";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import cepPromise from 'cep-promise';
import { useParams } from 'react-router-dom';
import './PatientRegister.css';
import { useState, useEffect } from 'react';

function InputNumberAddress({ numberAddress, setNumberAddress }) {
    return (
        <Container maxWidth="sm" sx={{ display: "flex", gap: "1px", flexDirection: "column", padding: "0 !important" }}>
            <label htmlFor="numberAddress">Apto/N°</label>
            <input value={!numberAddress ? "" : numberAddress} type="number" id="numberAddress" name="numberAddress" placeholder="XX" onChange={(event) => {
                setNumberAddress(event.target.value);
            }}></input>
        </Container>
    )
}
function PatientRegister() {
    const [alert, setAlert] = useState([]);
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [birthDate, setbirthDate] = useState(null);
    const [address, setAddress] = useState(null);
    const [numberAddress, setNumberAddress] = useState(null);
    const [newUser, setNewUser] = useState(false);
    const { editId } = useParams();
    const [userEdit, setUserEdit] = useState(false);
    async function createData() {
        try {
            const response = await cepPromise(address.replace("-", ""));
            const addressByCep = `${response.street}, ${numberAddress} - ${response.neighborhood}, ${response.city} - ${response.state}`
            try {
                const user = await axios.post(`${process.env.REACT_APP_API_URL}/patientRegister`, { name, email, birthDate, address: addressByCep })
                if (user.data.alreadyExist) {
                    setAlert([user.data.alreadyExist]);
                    return true;
                }
                if (user.data.cannotBeCreated) {
                    setAlert([user.data.cannotBeCreated]);
                    return true;
                }
            } catch (e) {
                setAlert(["Ocorreu um erro ao tentarmos cadastrar o usuário."]);
                return true;
            }
        } catch (e) {
            setAlert(["CEP não pode ser encontrado."]);
            return true;
        }
    };
    function verificateAddress() {
        if (typeof address !== "string" || address === "") errors.push("Endereço é um campo requerido.");
    }
    function verificateCEP() {
        if (address.length !== 9 || typeof address !== "string") errors.push("Digite um CEP válido");
        if (address.split("").indexOf("-") === -1) errors.push("O CEP deverá conter um '-'.");
        for (let value of address.replace("-", "").split("")) {
            if (!typeof Number(value) === "number") errors.push("O CEP deverá conter apenas números.");
        }
    }
    function verificData() {
        //Verific Name
        if (typeof name !== "string" || name === "") errors.push("Nome do paciente é um campo obrigatório.");
        if (name && name.split("").indexOf(" ") === -1) errors.push("Digite seu nome e sobrenome para continuar.");
        //Verific E-mail
        const emailRegex = /\S+@\S+\.\S+/;
        if (typeof email !== "string" || email === "") errors.push("E-mail é um campo obrigatório.");
        if (!emailRegex.test(email)) errors.push("E-mail inválido.");
        //Verific Date Birth
        const birthRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
        if (typeof birthDate !== "string" || birthDate === "") errors.push("Data de Nascimento é um campo obrigatório.");
        if (!birthRegex.test(birthDate)) errors.push("Data de nascimento inválida. Favor digitar no formato dd/mm/aaaa.");
        //Verific Address or CEP
        editId ? verificateAddress() : verificateCEP()
    }
    async function submitData(event) {
        if (errors.length > 0) {
            event.preventDefault();
            setAlert([...errors]);
            setErrors([]);
        } else {
            event.preventDefault();
            setErrors([]);
            setAlert([]);
            const alreadyExist = await createData();
            if (alreadyExist) return;
            setNewUser(true);
        }
    }

    async function ParamsForEdit() {
        try{
        if (editId) {
            const user = await axios.get(`${process.env.REACT_APP_API_URL}/patientRegister/${editId}`);
            if (!user) return;
            setName(`${user.data.name}`);
            setEmail(`${user.data.email}`);
            setbirthDate(`${user.data.birthDate}`);
            setAddress(`${user.data.address}`);
        }
        return;
        }catch(e){
            setAlert(["Paciente não pôde ser encontrado."]);
        }
    }
    async function updateData(event) {
        try {
            if (errors.length > 0) {
                event.preventDefault();
                setAlert([...errors]);
                setErrors([]);
                setUserEdit(false);
            } else {
                event.preventDefault();
                const editMessage = await axios.put(`${process.env.REACT_APP_API_URL}/patientRegister`, { name, email, birthDate, address, _id: editId });
                setUserEdit(true);
            }
        } catch (e) {
            setUserEdit(undefined);
        }
    }
    useEffect(() => {
        ParamsForEdit();
    }, [])
    return (
        <>
            <CssBaseline />
            <Navbar />
            <Stack sx={{ width: "auto", margin: "40px 60px" }} spacing={2}>
                {alert.length > 0 && <Alert severity="error" sx={{ fontSize: "16px" }}>{alert.map((error) => (
                    <p key={error}>
                        {error}
                    </p>
                ))}</Alert>}
                {newUser && <Alert severity="success">Paciente "{name}" foi cadastrado com sucesso!</Alert>}

                {userEdit && <Alert severity="success">Paciente foi editado com sucesso!</Alert>}
                {typeof userEdit === "undefined" && <Alert severity="warning">Paciente não pode ser encontrado,Tente novamente mais tarde.</Alert>}
            </Stack>
            <Box
                sx={{
                    width: "auto",
                    height: "auto",
                    margin: "40px 60px",
                    backgroundColor: "whitesmoke",
                    padding: "5px 30px 20px 30px"
                }}>
                <Container maxWidth="sm" sx={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "1.2rem", minWidth: "100%", padding: "5px", color: "#24125c", textAlign: "center" }}>
                    <HowToRegIcon />
                    <Typography sx={{ fontSize: "1.2rem" }} whiteSpace="nowrap" component="div" variant="h2">
                        Cadastro de Paciente
                    </Typography>
                </Container>
                <hr></hr>
                <form action="/patientRegisters/authentication" method="post" onSubmit={editId ? updateData : submitData}>
                    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 4 }} sx={{ paddingTop: "20px" }}>
                        <Grid item xs={12} sm={6}>
                            <Container maxWidth="sm" sx={{ display: "flex", gap: "1px", flexDirection: "column", fontWeight: "700", color: "#24125c" }}>
                                <label htmlFor="nameInput">Nome do paciente:</label>
                                <input value={!name ? "" : name} type="text" id="nameInput"
                                    name="name" maxLength="50" placeholder="Nome do paciente" onChange={(event) => {
                                        setName(event.target.value);
                                    }} />
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Container maxWidth="sm" sx={{ display: "flex", gap: "1px", flexDirection: "column", fontWeight: "700", color: "#24125c" }}>
                                <label htmlFor="emailInput">E-mail:</label>
                                <input value={!email ? "" : email} type="text" id="emailInput" name="email" placeholder="Endereço de E-mail" onChange={(event) => {
                                    setEmail(event.target.value);
                                }} />
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Container maxWidth="sm" sx={{ display: "flex", gap: "1px", flexDirection: "column", fontWeight: "700", color: "#24125c" }}>
                                <label htmlFor="birthDateInput">Data de Nascimento:</label>
                                <input value={!birthDate ? "" : birthDate} type="text" id="birthDateInput" name="birthDate" placeholder="dd/mm/aaaa" onChange={(event) => {
                                    if (event.target.value.length === 2 || event.target.value.length === 5) {
                                        event.target.value = event.target.value + "/"
                                    }
                                    setbirthDate(event.target.value);
                                }} />
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Container maxWidth="sm" sx={{ display: "flex", gap: "1px", flexDirection: "row",gap:"15px", fontWeight: "700", color: "#24125c" }}>
                                <Container maxWidth="sm" sx={{ display: "flex", gap: "1px", flexDirection: "column",padding: "0 !important" }}>
                                    <label htmlFor="addressInput">{editId ? "Endereço" : "CEP"}</label>
                                    <input value={!address ? "" : address} type="text" id="addressInput" name="address" placeholder="" onChange={(event) => {
                                        if (editId) {
                                            setAddress(event.target.value);
                                        } else {
                                            if (event.target.value.length === 5) {
                                                event.target.value = event.target.value + "-"
                                            }
                                            setAddress(event.target.value);
                                        }
                                    }} />
                                </Container>
                                {!editId && <InputNumberAddress numberAddress={numberAddress} setNumberAddress={setNumberAddress} />}
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Container maxWidth="sm">
                                <Button type="submit" variant="contained" startIcon={<AssignmentTurnedInIcon />} onClick={verificData}>{editId ? "Editar" : "Cadastrar"}</Button>
                            </Container>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )
}
export default PatientRegister;