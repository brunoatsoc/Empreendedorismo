const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const e = require("express");
const app = express();
const port = 3000;

clienteEmail = null;
clienteId = null;

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
                clienteId = results[0].Cliente_ID;

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

app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM Produto_Servico';

    connection.query(query, (err, results) => {
        if (err) throw err;

        // Renderiza a página EJS com os dados obtidos
        res.render('produtos', { produtos: results });
    });
});

app.post('/adicionarAoCarrinho', (req, res) => {
    const { OS_ID } = req.body; // Obtém o ID do produto enviado pelo formulário
    var Cliente_ID = null;
    const query = 'SELECT Cliente_ID FROM Cliente WHERE Cliente_email = ?';

    connection.query(query, [clienteEmail], (err, results) => {
        if (err) {
            console.error('Erro ao buscar Cliente_ID:', err);
            return;
        }
    
        if (results.length > 0) {
            Cliente_ID = results[0].Cliente_ID;
            res.redirect(`/update_produto_servico/${Cliente_ID}/${OS_ID}`);
        } else {
            console.log('Nenhum cliente encontrado com o email fornecido.');
        }
    });
});

app.get('/update_produto_servico/:Cliente_ID/:OS_ID', (req, res) => {
    const Cliente_ID = req.params.Cliente_ID;
    const OS_ID = req.params.OS_ID;
    const query = 'UPDATE Produto_Servico SET Cliente_ID = ? WHERE OS_ID = ?';

    connection.query(query, [Cliente_ID, OS_ID], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar Cliente_ID:', err);
            return res.status(500).send('Erro ao atualizar registro.');
        }

        res.redirect(`/insert_carrinho/${Cliente_ID}/${OS_ID}`);
    });
});

app.get('/insert_carrinho/:Cliente_ID/:OS_ID', (req, res) => {
    const Cliente_ID = req.params.Cliente_ID;
    const OS_ID = req.params.OS_ID;
    const query = 'INSERT INTO Carrinho (Produto_Servico, Cliente_ID) VALUES (?, ?)';

    connection.query(query, [OS_ID, Cliente_ID], (err, results) => {
        if (err) {
            console.error('Erro ao inserir no carrinho:', err);
            return res.status(500).send('Erro ao adicionar ao carrinho.');
        }

        res.redirect("/produtos");
    });
});

app.get('/carrinhoCompras/', async (req, res) => {
    const query = `SELECT 
                        ps.OS_descricao_problema AS Produto_Descricao
                    FROM 
                        Cliente c
                    INNER JOIN 
                        Carrinho ca ON c.Cliente_ID = ca.Cliente_ID
                    INNER JOIN 
                        Produto_Servico ps ON ca.Produto_Servico = ps.OS_ID
                    WHERE ca.Cliente_ID = ?`;

    connection.query(query, [clienteId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar Carrinho:', err);
            return;
        }

        res.render('carrinho', { carrinho: results });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
