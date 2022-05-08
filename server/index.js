//node\express application (backend)
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const req = require('express');
const res = require('express');
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

app.use(
  cors({
    origin: [process.env.CLIENT],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//session cookie
app.use(
  session({
    key: 'userid',
    secret: 'somethingcomplicated',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'strict',
      expires: 60 * 60 * 24,
    },
  })
);

//if user already logged in...
app.get('/isLoggedIn/:id', (req, res) => {
  const id = req.params.id;
  const sqlUser = 'SELECT * FROM utilizadores where id_user = ?';
  db.query(sqlUser, id, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

//login
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    'SELECT * FROM utilizadores WHERE nome = ? AND password = ?',
    [username, password],
    (err, result) => {
      console.log(result);
      if (err) {
        return res.send({ err: err });
      }
      if (!result) {
        return res.send({ message: 'Nome de Utilizador ou Password errado!' });
      }
      if (result.length > 0) {
        req.session.user = result;
        return res.send(result);
      }
    }
  );
});

//vote register
app.post('/vote', (req, res) => {
  const user = req.body.userid;
  const ele = req.body.idele;
  const list = req.body.listid;
  const anonimo = req.body.anonim;
  const sqlLists = `INSERT INTO votos (utilizador_id, eleicao_id, lista_id, anonim) VALUES ('${user}', '${ele}', '${list}', '${anonimo}')`;
  db.query(sqlLists, [user, ele, list, anonimo], (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      res.send(result);
      sendMail(user, ele, list);
    }
  });
});

//mail send
function sendMail(user, ele, list) {
  function get_info([user, ele, list], callback) {
    var sql =
      'SELECT utilizadores.email, eleicoes.nome, listas.descricao FROM utilizadores, eleicoes, listas, votos WHERE utilizadores.id_user=? AND eleicoes.id_ele = ? AND listas.id_listas=? GROUP BY utilizadores.email';
    db.query(sql, [user, ele, list], (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result[0]);
      return callback(result[0]);
    });
  }
  get_info([user, ele, list], function (result) {
    console.log(result.email);
    let message = {
      from: 'noreplyvotronico@server.com',
      to: result.email,
      subject: 'Voto em ' + result.nome,
      text:
        'O seu voto no evento ' +
        result.nome +
        ' na lista ' +
        result.descricao +
        ' foi registado com sucesso.',
    };
    transport.sendMail(message);
  });
}

// has voted???
app.get('/voted/:userid/:eleid', (req, res) => {
  const userid = req.params.userid;
  const eleid = req.params.eleid;
  db.query(
    'SELECT * FROM votos WHERE utilizador_id = ? AND eleicao_id = ?',
    [userid, eleid],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        res.send(result);
      }
    }
  );
});

// docs list
app.post('/getDocs', (req, res) => {
  db.query('SELECT * FROM tipos_documentos', (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      res.send(result);
    }
  });
});

//events grouping
app.get('/event/:id', (req, res) => {
  const group = req.params.id;
  const sqlGroup = 'SELECT distrito FROM utilizadores WHERE id_user = ?';
  db.query(sqlGroup, group, (err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });
});

//events list
app.get('/events/:id', (req, res) => {
  const user = req.params.id;
  const sqlEvent =
    'SELECT eleicoes.*,grupos.d_nome FROM eleicoes, grupos WHERE eleicoes.distrito=grupos.d_id AND grupos.d_id=?';
  db.query(sqlEvent, user, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

// generic events
app.get('/generalEvents', (req, res) => {
  const sqlEvents =
    'SELECT eleicoes.*,grupos.d_nome FROM eleicoes, grupos WHERE eleicoes.distrito=grupos.d_id AND grupos.d_id=?';
  db.query(sqlEvents, 1, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

// event lists
app.get('/getlists/:id', (req, res) => {
  const electionid = req.params.id;
  const sqlList = 'SELECT * FROM listas WHERE eleicao_id = ?';
  db.query(sqlList, electionid, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.get('/getvotes/:id', (req, res) => {
  const eleid = req.params.id;
  const sqlVotesTotal =
    'SELECT listas.descricao AS listanome, COUNT(*) AS countvotos FROM votos LEFT JOIN listas ON listas.id_listas = votos.lista_id WHERE votos.eleicao_id=? GROUP BY lista_id;';
  db.query(sqlVotesTotal, eleid, (err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });
});

//abstention/no votes
app.get('/getnovotes/:id', (req, res) => {
  const ele = req.params.id;
  const sqlNoVotes =
    'SELECT COUNT(*) as total FROM utilizadores JOIN eleicoes ON eleicoes.distrito = utilizadores.distrito LEFT JOIN votos ON votos.utilizador_id = utilizadores.id_user AND votos.eleicao_id = eleicoes.id_ele WHERE eleicoes.id_ele = ? AND votos.utilizador_id IS NULL';
  db.query(sqlNoVotes, ele, (err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });
});

// public voters
app.get('/getpublic/:id', (req, res) => {
  const ele = req.params.id;
  const sqlPublicVoters =
    'SELECT votos.*, utilizadores.nome, listas.descricao FROM votos, utilizadores, listas WHERE votos.anonim = 0 AND votos.utilizador_id=utilizadores.id_user AND votos.lista_id=listas.id_listas AND votos.eleicao_id=?';
  db.query(sqlPublicVoters, ele, (err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });
});

//update user data
app.post('/update', (req, res) => {
  const userid = req.body.user_id;
  const nome = req.body.nameuser;
  const email = req.body.mailAd;
  const password = req.body.passw;
  const doc_nr = req.body.doc_nr;
  const doc_type = req.body.doc_type;
  const sqlUpdate =
    'UPDATE utilizadores SET nome = ?, email = ?, password = ?, nr_doc = ?, tipo_doc = ? WHERE id_user = ?';
  db.query(
    sqlUpdate,
    [nome, email, password, doc_nr, doc_type, userid],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        res.send(result);
      }
    }
  );
});

//logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(process.env.CLIENT);
});

app.listen(3001, () => {
  console.log('running on port 3001');
});
