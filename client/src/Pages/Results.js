import { useHistory, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Results() {
  let history = useHistory();
  let id = useParams();
  sessionStorage.setItem('id', id.id);
  const [groupId, setGroupId] = useState(0);
  const dateISO = new Date().toISOString();

  useEffect(() => {
    Axios.get(`https://atwvc.herokuapp.com/event/${id.id}`).then((response) => {
      setGroupId(response.data[0].distrito);
    });
  }, []);

  const [eventList, setEventList] = useState([]);
  if (eventList.length === 0) {
    if (eventList !== null) {
      Axios.get(`https://atwvc.herokuapp.com/events/${groupId}`).then(
        (response) => {
          setEventList(response.data);
        }
      );
    }
  }

  const rescheck = (id_ele) => {
    history.push(`/resultsCheck/${id_ele}`);
  };

  const listEvents = { eventList }.eventList.map((item) => {
    if (dateISO > item.data_fim) {
      return (
        <tr>
          <td>{item.id_ele}</td>
          <td>{item.nome}</td>
          <td>Com resultados</td>
          <td>{item.d_nome}</td>
          <td>
            <Button
              variant="primary"
              onClick={rescheck.bind(this, item.id_ele)}
            >
              Resultados
            </Button>
            <a> </a>
            <Button variant="dark" disabled>
              Comprovativo
            </Button>
          </td>
        </tr>
      );
    }
  });

  const [generalList, setGeneralList] = useState([]);
  if (groupId > 1) {
    if (eventList.length === 0) {
      if (eventList !== null) {
        Axios.get(`https://atwvc.herokuapp.com/generalEvents`).then(
          (response) => {
            setGeneralList(response.data);
          }
        );
      }
    }
  }
  const listGeneralEvents = { generalList }.generalList.map((item2) => {
    if (dateISO > item2.data_fim) {
      return (
        <tr>
          <td>{item2.id_ele}</td>
          <td>{item2.nome}</td>
          <td>Com resultados</td>
          <td>{item2.d_nome}</td>
          <td>
            <Button
              variant="primary"
              onClick={rescheck.bind(this, item2.id_ele)}
            >
              Resultados
            </Button>
            <a> </a>
            <Button variant="dark" disabled>
              Comprovativo
            </Button>
          </td>
        </tr>
      );
    }
  });

  return (
    <Container fluid>
      <Row className="header">
        <h2>Menu</h2>
        <h4>Bem vindo {sessionStorage.getItem('name')}</h4>
      </Row>
      <Row className="mainCanvas">
        <Nav defaultActiveKey="/home" className="flex-column">
          <Nav.Link href={`../profile/${id.id}`}>Home</Nav.Link>
          <Nav.Link href={`../events/${id.id}`}>Evento/Votação</Nav.Link>
          <Nav.Link>Resultados</Nav.Link>
          <Nav.Link href="https://atwvc.herokuapp.com/logout">Logout</Nav.Link>
        </Nav>
        <div className="rest">
          <header>
            {' '}
            <h1> Votações </h1>{' '}
          </header>
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Designação do Evento</th>
                <th scope="col">Estado</th>
                <th scope="col">Agrupamento</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {listEvents}
              {listGeneralEvents}
            </tbody>
          </Table>
        </div>
      </Row>
      <Row className="rodape2">
        <p>Votrónico+ | Vitor Costa 2021</p>
      </Row>
    </Container>
  );
}

export default Results;
