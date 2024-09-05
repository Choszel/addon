const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Addon_db',
    password: '123',
    port: 5432
});

app.use(cors({
    origin: 'http://localhost:5173' 
}));


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