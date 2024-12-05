const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const routes = express.Router();
const prisma = new PrismaClient();
require('dotenv').config();


// Rota para obter todos os usuários
routes.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});

// Rota para cadastrar um novo usuário
routes.post('/users', async (req, res) => {
    const { name, email, senha } = req.body;

    try {
        // Verifica se o e-mail já está em uso
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já está em uso." });
        }

        // Hashear a senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(senha, 10);

        const newUser = await prisma.user.create({
            data: { name, email, senha: hashedPassword },
        });

        return res.status(201).json(newUser);
    } catch (err) {
        console.error("Erro ao criar o usuário:", err);
        return res.status(500).json({ error: "Erro ao criar o usuário." });
    }
});

// Rota para login de usuário
routes.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log("Teste: ", req.body);
    try {
        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({ where: { email } });
        console.log("User:", user);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Verificar a senha
        const isPasswordCorrect = await bcrypt.compare(senha, user.senha);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Senha incorreta." });
        }

        // Gerar um token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET, // Use uma variável de ambiente para o segredo
            { expiresIn: "1h" }
        );

        const { senha: _, ...userWithoutPassword } = user; // Remover a senha do objeto retornado

        return res.json({ message: "Login bem-sucedido.", token, user: userWithoutPassword });
    } catch (err) {
        console.error("Erro ao realizar o login:", err);
        return res.status(500).json({ error: "Erro ao realizar o login." });
    }
});


module.exports = routes;


routes.post("/lista", async (req, res) => {
    const { name, categoria, userId } = req.body;

    if (!name || !categoria || !userId) {
        return res.status(400).json({ error: "Nome, categoria e userId são obrigatórios." });
    }

    try {
        const lista = await prisma.lista.create({
            data: {
                name,
                categoria,
                user: { connect: { id: userId } }
            }
        });
        return res.status(201).json(lista);
    } catch (error) {
        console.error("Erro ao criar lista:", error);
        return res.status(500).json({ error: "Erro ao criar lista." });
    }
});

routes.put('/lista/:id/acessar', async (req, res) => {
    const { id } = req.params;
  
    try {
        const lista = await prisma.lista.update({
            where: { id: parseInt(id) },
            data: { lastAccessed: new Date() }, 
        });
  
        res.json(lista);
    } catch (error) {
        console.log('Id:', id);
        console.error('Erro ao atualizar o último acesso:', error);
        res.status(500).json({ error: 'Erro ao atualizar o último acesso' });
    }
  });
  
routes.get('/lista/recentes', async (req, res) => {
    try {
        const recentes = await prisma.lista.findMany({
            orderBy: { lastAccessed: 'desc' }, 
            take: 5, 
        });
  
        res.json(recentes);
    } catch (error) {
        console.error('Erro ao buscar listas recentes:', error);
        res.status(500).json({ error: 'Erro ao buscar listas recentes' });
    }
  });
  

routes.post("/lista/:listaId/sublista", async (req, res) => {
    const { listaId } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório para a sublista." });
    }

    try {
        const sublista = await prisma.subLista.create({
            data: {
                name,
                lista: { connect: { id: parseInt(listaId) } },
            },
        });

        return res.status(201).json(sublista);
    } catch (error) {
        return res.status(400).json({ error: "Erro ao criar a sublista." });
    }
});

routes.get("/lista", async (req, res) => {
    try {
        const listas = await prisma.lista.findMany({
            include: { items: true }, 
        });
        return res.status(200).json(listas);
    } catch (erro) {
        return res.status(400).json({ error: "Erro ao procurar listas." });
    }
});

routes.get("/sublista/:listaId", async (req, res) => {
    const { listaId } = req.params;

    try {
        const sublistas = await prisma.subLista.findMany({
            where: { listaId: parseInt(listaId) }
        });
        return res.status(200).json(sublistas);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao buscar sublistas." });
    }
});

routes.put("/lista/:id", async (req, res) => {
    const { id } = req.params;
    const { name, categoria, favorito } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Id é obrigatório." });
    }

    try {
        const listaExiste = await prisma.lista.findUnique({
            where: { id: parseInt(id) },
        });

        if (!listaExiste) {
            return res.status(404).json({ error: "Lista não encontrada." });
        }

        const lista = await prisma.lista.update({
            where: { id: parseInt(id) },
            data: {
                ...(name !== undefined && { name }),
                ...(categoria !== undefined && { categoria }),
                ...(favorito !== undefined && { favorito }),
            },
        });

        return res.status(200).json(lista);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar a lista." });
    }
});

routes.put("/sublista/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Id é obrigatório." });
    }

    try {
        const sublistaExiste = await prisma.subLista.findUnique({
            where: { id: parseInt(id) }
        });

        if (!sublistaExiste) {
            return res.status(404).json({ error: "Sublista não encontrada." });
        }

        const sublista = await prisma.subLista.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        return res.status(200).json(sublista);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar a sublista." });
    }
});

routes.delete("/lista/:id", async (req, res) => {
    const { id } = req.params;
    const intId = parseInt(id);

    if (!intId) {
        return res.status(400).json({ error: "Id é obrigatório." });
    }

    try {
        const listaExiste = await prisma.lista.findUnique({
            where: { id: intId },
        });

        if (!listaExiste) {
            return res.status(404).json({ error: "Lista não encontrada." });
        }

        const sublistas = await prisma.subLista.findMany({
            where: { listaId: intId },
            select: { id: true }
        });

        const subListaIds = sublistas.map(subLista => subLista.id);

        await prisma.subLista.deleteMany({
            where: { listaId: intId }
        });

        await prisma.lista.delete({
            where: { id: intId }
        });

        return res.status(200).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao deletar a lista." });
    }
});

routes.delete("/sublista/:id", async (req, res) => {
    const { id } = req.params;
    const intId = parseInt(id);

    if (!intId) {
        return res.status(400).json({ error: "Id é obrigatório." });
    }

    try {
        const sublistaExiste = await prisma.subLista.findUnique({
            where: { id: intId }
        });

        if (!sublistaExiste) {
            return res.status(404).json({ error: "Sublista não encontrada." });
        }

        await prisma.subLista.delete({ where: { id: intId } });

        return res.status(200).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao deletar a sublista." });
    }
});

module.exports = routes;
