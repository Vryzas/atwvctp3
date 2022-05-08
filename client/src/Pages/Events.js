import Container from 'react-bootstrap/Container';
import { Alert, Button, Form, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Axios from 'axios';

function Events() {
  let history = useHistory();
  let id = useParams();
  sessionStorage.setItem('id', id.id);
  const [groupId, setGroupId] = useState(0);
  const [msg, setMsg] = useState();
  const state = new Date().toISOString().substring(0, 10);

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
  const votelink = (id_ele) => {
    Axios.get(`https://atwvc.herokuapp.com/voted/${id.id}/${id_ele}`).then(
      (response) => {
        if (response.data.length > 0) {
          setMsg(
            <Alert variant="danger">
              <Alert.Heading>
                Já submeteu o seu voto neste evento!
              </Alert.Heading>
            </Alert>
          );
        } else {
          history.push(`/votingOption/${id_ele}`);
        }
      }
    );
  };

  const listEvents = { eventList }.eventList.map((item) => {
    const a = item.data_ini.substring(0, 10);
    const b = item.data_fim.substring(0, 10);
    if (state < b && state > a) {
      return (
        <tr>
          <td>{item.id_ele}</td>
          <td>{item.nome}</td>
          <td>{a}</td>
          <td>{b}</td>
          <td>{item.d_nome}</td>
          <td>
            <Button onClick={votelink.bind(this, item.id_ele)}>Votar</Button>
          </td>
        </tr>
      );
    } else {
      if (state < a) {
        return (
          <tr>
            <td>{item.id_ele}</td>
            <td>{item.nome}</td>
            <td>{a}</td>
            <td>{b}</td>
            <td>{item.d_nome}</td>
            <td>
              <Button variant="danger" disabled>
                Indisponível
              </Button>
            </td>
          </tr>
        );
      }
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
    const a = item2.data_ini.substring(0, 10);
    const b = item2.data_fim.substring(0, 10);
    if (state < b && state > a) {
      return (
        <tr>
          <td>{item2.id_ele}</td>
          <td>{item2.nome}</td>
          <td>{a}</td>
          <td>{b}</td>
          <td>{item2.d_nome}</td>
          <td>
            <Button onClick={votelink.bind(this, item2.id_ele)}>Votar</Button>
          </td>
        </tr>
      );
    } else {
      if (state < a) {
        return (
          <tr>
            <td>{item2.id_ele}</td>
            <td>{item2.nome}</td>
            <td>{a}</td>
            <td>{b}</td>
            <td>{item2.d_nome}</td>
            <td>
              <Button variant="danger" disabled>
                Indisponível
              </Button>
            </td>
          </tr>
        );
      }
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
          <Nav.Link>Evento/Votação</Nav.Link>
          <Nav.Link href={`../results/${id.id}`}>Resultados</Nav.Link>
          <Nav.Link href="https://atwvc.herokuapp.com/logout">Logout</Nav.Link>
        </Nav>
        <div className="rest">
          <header>
            {' '}
            <h1> Votações </h1>{' '}
          </header>
          {msg}
          <Table responsive>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Designação do Evento</th>
                <th scope="col">Data de Inicio</th>
                <th scope="col">Data de Final</th>
                <th scope="col">Agrupamento</th>
                <th scope="col"></th>
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

export default Events;
