import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';

function ResultsView() {
  let history = useHistory();
  let id = useParams();

  const [unvoted, setUnvoted] = useState(0);
  useEffect(() => {
    Axios.get(`https://atwvc.herokuapp.com/getnovotes/${id.id}`).then(
      (response) => {
        setUnvoted(response.data[0].total);
      }
    );
  }, []);

  const [publicvoters, setPublicVoters] = useState([]);
  useEffect(() => {
    Axios.get(`https://atwvc.herokuapp.com/getpublic/${id.id}`).then(
      (response) => {
        setPublicVoters(response.data);
      }
    );
  }, []);

  const [votes, setVotes] = useState([]);
  useEffect(() => {
    Axios.get(`https://atwvc.herokuapp.com/getvotes/${id.id}`).then(
      (response) => {
        setVotes(response.data);
      }
    );
  }, []);

  let total = unvoted;
  const totalvotes = { votes }.votes.map((item) => {
    total += item.countvotos;
  });
  const votesLists = { votes }.votes.map((item) => {
    const perc = (item.countvotos / total) * 100;
    return (
      <tr>
        <td>{item.listanome}</td>
        <td>{item.countvotos}</td>
        <td>{Math.round(perc) + '%'}</td>
      </tr>
    );
  });

  const publicVoters = { publicvoters }.publicvoters.map((item) => {
    return (
      <tr>
        <td>{item.nome}</td>
        <td>{item.descricao}</td>
      </tr>
    );
  });

  return (
    <Container fluid>
      <Row className="header">
        <h2>Resultados</h2>
        <h4>Bem vindo {sessionStorage.getItem('name')}</h4>
      </Row>
      <header>
        {' '}
        <h1> Resultados </h1>{' '}
      </header>
      <Button variant="secondary" className="button" onClick={history.goBack}>
        Voltar atrás
      </Button>
      <hr />

      <Row className="resultados">
        <Col xs={3}>
          <h3>Votos por Lista</h3>
          <Table responsive>
            <thead>
              <tr>
                <th scope="col">Designação</th>
                <th scope="col">Votos</th>
                <th scope="col">Percentagem</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {votesLists}
              <tr>
                <td>Abstenção</td>
                <td>{unvoted}</td>
                <td>{Math.round((unvoted / total) * 100) + '%'}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col xs={3}>
          <tr>
            <th scope="col">Gráfico</th>
          </tr>
        </Col>
        <Col xs={3}>
          <h3>Votos Públicos</h3>
          <Table responsive>
            <thead>
              <tr>
                <th scope="col">Votante</th>
                <th scope="col">Lista Votada</th>
              </tr>
            </thead>
            <tbody>{publicVoters}</tbody>
          </Table>
        </Col>
      </Row>
      <Row className="rodape2">
        <p>Votrónico+ | Vitor Costa 2021</p>
      </Row>
    </Container>
  );
}

export default ResultsView;
