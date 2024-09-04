const express = require('express');
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

app.get('/api/englishWords', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM english_words;');
        res.json(result.rows);
    }catch(err){
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
        const result = await pool.query('SELECT * FROM translation_pl_eng;');
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

app.get('/api/words_polish', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM words_polish;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});