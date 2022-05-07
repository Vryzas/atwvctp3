import {Alert, Button, Col, Form, Row, ToggleButton} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";



function VotingOption() {

    let history = useHistory();
    let id = useParams();
    const userid = sessionStorage.getItem("id");
    const [msg, setMsg] = useState();

    const submitvote = (idlista) => {
        let anonimo = 1;
        if(checked){
            anonimo = 0;
        }
        Axios.post(`http://localhost:3001/vote`, {
            userid: userid,
            idele: id.id,
            listid: idlista,
            anonim: anonimo,
        }).then((response) => {
            if (response.data.affectedRows === 1) {
                setMsg(<Alert variant="success">
                    <Alert.Heading>Voto submetido com sucesso!</Alert.Heading></Alert>);
                    history.goBack();
            } else {
                setMsg(<Alert variant="danger">
                    <Alert.Heading>Falha na votação!</Alert.Heading></Alert>);
            }
        });
    };

    const [lists, setLists] = useState([]);
    useEffect( () => {
        Axios.get(`http://localhost:3001/getlists/${id.id}`).then((response) => {
            setLists(response.data);
        })
    },[]);

    const [checked, setChecked] = useState(false);

    const votterlist = {lists}.lists.map((item) => {
        return (
            <tr value={item.id_listas}>
                <td>{item.id_listas}</td>
                <td>{item.descricao}</td>
                <td>{item.nome_can}</td>
                <td>
                    <Button
                        variant="primary"
                        className="button"
                        onClick={submitvote.bind(this,item.id_listas)}>
                        Submeter voto
                    </Button>
                </td>
            </tr>
        )
    });

    return (
        <Container fluid>
            <Row className="header">
                <h2>Voto</h2>
                <h4>Bem vindo {sessionStorage.getItem("name")}</h4>
            </Row>
            <header> <h1> Votação </h1> </header>
            {msg}
            <Row className="votos">
                <Form className="votos">
                    <Table responsive>
                        <thead>
                        <tr>
                            <th scope="col"> # </th>
                            <th scope="col"> Descrição </th>
                            <th scope="col"> Nome Candidato </th>
                            <th scope="col"> Voto </th>
                        </tr>
                        </thead>
                        <tbody>
                        {votterlist}
                        </tbody>
                    </Table>
                    <Row>
                        <Col></Col>
                        <Col>
                            <ToggleButton
                                className="mb-2"
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-primary"
                                checked={checked}
                                value="1"
                                onChange={(e) => setChecked(e.currentTarget.checked)}
                            >
                                Voto Público
                            </ToggleButton>
                        </Col>
                        <Col>
                            <Button
                                variant="secondary"
                                className="button"
                                onClick={history.goBack}>
                                Voltar atrás
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row className="rodape2" >
                <p>Votrónico+ | Vitor Costa 2021</p>
            </Row>
        </Container>
    )
}

export default VotingOption;