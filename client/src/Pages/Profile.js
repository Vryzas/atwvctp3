import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container'
import { useParams } from "react-router-dom";
import {Alert, Button, Form, Row} from "react-bootstrap";

function Profile () {

    let history = useHistory();
    let id = useParams();
    const [msg, setMsg] = useState();

    const [nameuser, setNameUser] = useState("");
    const [mailAd, setEmailAd] = useState("");
    const [passw, setPassW] = useState("");
    const [doc_nr, setDoc_nr] = useState("");
    const [doc_type, setDoc_Type] = useState();

    const [docData, setDocData] = useState([]);
    if (docData.length === 0) {
        if (docData !== null) {
            Axios.post("http://localhost:3001/getDocs").then((response) => {
                setDocData(response.data);
            });
        }
    }

    const option = {docData}.docData.map((item) => {
        return (
            <option key={item.id_doc} value={item.id_doc}>
                {item.descricao}
            </option>
        );
    });

    const [userData, setUserData] = useState({
        id: -1,
        name: '',
        mail: '',
        pass: '',
        docnr: '',
        doctype: -1,
        group: -1
    });

    useEffect(() => {
        Axios.get( `http://localhost:3001/isLoggedIn/${id.id}`).then((response) => {
            setUserData({
                id: response.data[0].id_user,
                name: response.data[0].nome,
                mail: response.data[0].email,
                pass: response.data[0].password,
                docnr: response.data[0].nr_doc,
                doctype: response.data[0].tipo_doc,
                group: response.data[0].distrito,
            });
            sessionStorage.setItem("name", response.data[0].nome);
            setNameUser(response.data[0].nome);
            setEmailAd(response.data[0].email);
            setPassW(response.data[0].password);
            setDoc_nr(response.data[0].nr_doc);
            setDoc_Type(response.data[0].tipo_doc);
        });
    }, []);

    const updateUserData = () => {
        Axios.post("http://localhost:3001/update",{
            user_id: id.id,
            nameuser: nameuser,
            mailAd: mailAd,
            passw: passw,
            doc_nr: doc_nr,
            doc_type: doc_type,
        }).then((response) => {
            if (response.data.affectedRows === 1) {
                setMsg(<Alert variant="success">
                    <Alert.Heading>Dados alterados com sucesso!</Alert.Heading></Alert>);
            } else {
                setMsg(<Alert variant="danger">
                    <Alert.Heading>Falha na alteração!</Alert.Heading></Alert>);
            }
        });
    };

    return (
        <Container fluid>
            <Row className="header">
                <h2>Menu</h2>
                <h4>Bem vindo {sessionStorage.getItem("name")}</h4>
            </Row>
            <Row className="mainCanvas">
                <Nav defaultActiveKey="/profile" className="flex-column">
                    <Nav.Link >Home</Nav.Link>
                    <Nav.Link href={`/events/${userData.id}`} >Evento/Votação</Nav.Link>
                    <Nav.Link href={`/results/${userData.id}`}>Resultados</Nav.Link>
                    <Nav.Link href="http://localhost:3001/logout" >Logout</Nav.Link>
                </Nav>
                <div className="rest">
                    <header> <h1> Dados Pessoais </h1> </header>
                    <hr/>
                    {msg}
                    <Form>
                        <Form.Group type="text" placeholder="Normal text" >
                            <Form.Label>Utilizador</Form.Label>
                            <Form.Control size="sm"
                                          name="nameuser"
                                          onChange={(e)=> {
                                              setNameUser(e.target.value);
                                          }} placeholder={userData.name} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control size="sm" type="password" name="passw"
                                          onChange={(e)=> {
                                              setPassW(e.target.value);
                                          }} placeholder={"*********"} />

                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control size="sm" type="email" name="mailAd"
                                          onChange={(e)=> {
                                              setEmailAd(e.target.value);
                                          }} placeholder={userData.mail} />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Tipo Documento</Form.Label>
                            <Form.Control size="sm" as="select" name="doc_type"
                                          onChange={(e)=> {
                                              setDoc_Type(e.target.value);
                                          }} custom required>
                                {option}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group type="text" placeholder="Normal text" >
                            <Form.Label>Número de Documento</Form.Label>
                            <Form.Control size="sm" type="text" name="doc_nr"
                                          onChange={(e)=> {
                                              setDoc_nr(e.target.value);
                                          }} placeholder={userData.docnr}/>
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={updateUserData}>
                            Alterar
                        </Button>
                    </Form>
                </div>
            </Row>
            <Row className="rodape2" >
                <p>Votrónico+ | Vitor Costa 2021</p>
            </Row>
        </Container>
    );
}

export default Profile;