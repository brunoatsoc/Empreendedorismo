const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const e = require("express");
const app = express();
const port = 3000;

clienteEmail = null;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1003200039",
    database: "Empreendedorismo",
});

connection.connect((err) => {
    if(err) {
        console.log("Error connecting to MySQL: " + err.stack);
        return;
    }

    console.log("Connected to MySQL with ID: " + connection.threadId);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render('index');
});

app.post('/cadastro', (req, res) => {
    const { Cliente_nome, Cliente_email, Cliente_endereco, Cliente_telefone, Cliente_senha } = req.body;
  
    connection.query('SELECT * FROM Cliente WHERE Cliente_email = ?', [Cliente_email], (err, results) => {
        if(err) throw err;
  
        if(results.length > 0) {
            res.send('Usuário já cadastrado. Por favor, escolha outro usuário.');
        } else {
            const usuario = { Cliente_nome, Cliente_email, Cliente_endereco, Cliente_telefone, Cliente_senha };

            connection.query('INSERT INTO Cliente SET ?', {Cliente_nome, Cliente_email, Cliente_endereco, Cliente_telefone, Cliente_senha}, (err, results) => {
                if(err) throw err;
                res.redirect('/loginPage');
            });
        }
    });
});

app.get("/loginPage", (req, res) => {
    res.render("login.ejs");
});

app.post('/login', (req, res) => {
    const { Cliente_email, Cliente_senha } = req.body;

    connection.query(
        'SELECT * FROM Cliente WHERE Cliente_email = ? AND Cliente_senha = ?', [Cliente_email, Cliente_senha],
        (err, results) => {
            if(err) throw err;
  
            if(results.length > 0) {
                clienteEmail = Cliente_email;
                // clienteSenha = senha;

                res.redirect('/options');
            } else {
                res.send('Credenciais inválidas!');
            }
        }
    );
});

app.get("/options", (req, res) => {
    res.render("options.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});