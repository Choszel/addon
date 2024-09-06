const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const app = express();
const port = 3001;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const pool = new Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});

app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.urlencoded({ extended: true }));


app.post('/api/register', async (req, res) => {
    const { name, login, password } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPass = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (name, login, password, user_type) VALUES ($1, $2, $3, 0)',
            [name, login, hashedPass]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Invalid login" });
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, userType: user.rows[0].user_type }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/headers', async(req, res)=>{
    const {tableName} = req.query;

    try{    
        const result = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', [tableName]);
        res.json(result.rows.map(row => row.column_name));
    }catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
})

app.get('/api/categories', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM categories;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/difficultyLevel', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM difficulty_level;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/englishWords', async (req, res) => {
    try {
        const { id } = req.query;

        let query = 'SELECT * FROM english_words';
        const queryParams = [];

        if (id) {
            query += ' WHERE id = $1';
            queryParams.push(id);
        }
        const result = await pool.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Phrase not found" });
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.get('/api/quizes', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM quizes;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/quizesWords', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM quizes_words;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/translationPLNENG', async(req, res)=>{
         
    try{
        const { id } = req.query;
    
        let query = "SELECT * FROM translation_pl_eng";
        const queryParams = [];
    
        if (id) {
            query += ' WHERE id = $1';
            queryParams.push(id);
        }

        const result = await pool.query(query, queryParams);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Phrase not found" });
        }

        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/users', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM users;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/usersQuizesQuestions', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM users_quizes_questions;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/usersQuizesScores', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM users_quizes_scores;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/usersWords', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM users_words;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/wordsPolish', async(req, res)=>{
    try{
        const { id } = req.query;
        let query = "SELECT * FROM words_polish";
        const queryParams = [];
    
        if (id) {
            query += ' WHERE id = $1';
            queryParams.push(id);
        }

        const result = await pool.query(query, queryParams);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Phrase not found" });
        }

        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});