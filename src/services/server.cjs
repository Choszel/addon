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

app.post('/api/login', async (req, res) =>{
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
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM categories WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM categories ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }   
});

app.post('/api/category', async (req, res) =>{
    const { name } = req.body;
    console.log("App ", name);
    try{
        const categoryExists = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
        if(categoryExists.rows.length > 0){
            return res.status(400).json({ error: "Category already exists" });
        }
        await pool.query(
            'INSERT INTO categories(name) VALUES ($1)', [name]
        );
        res.status(200).json({ message: "Category added successfully" });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.delete('/api/category', async (req, res) =>{
    const { id } = req.body;
    try{
        const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

app.put('/api/category', async (req, res) =>{
    const { id, name } = req.body;
    console.log(id, " ", name);
    try{
        const result = await pool.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
        res.status(200).json({message: "Updated successfully"})
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error");
    }
})

app.get('/api/difficultyLevel', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM difficulty_levels;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/languages', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM languages WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM languages ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }   
})

app.post('/api/language', async (req, res) =>{
    const { code } = req.body;
    console.log("App ", code);
    try{
        const languageExists = await pool.query('SELECT * FROM languages WHERE code = $1', [code]);
        if(languageExists.rows.length > 0){
            return res.status(400).json({ error: "Language already exists" });
        }
        await pool.query('INSERT INTO languages(code) VALUES ($1);', [code]);
        res.status(200).json({ message: "Language added successfully" });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.delete('/api/language', async (req, res) =>{
    const { id } = req.body;
    try{
        const result = await pool.query('DELETE FROM languages WHERE id = $1', [id]);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

app.put('/api/language', async (req, res) =>{
    const { id, code } = req.body;
    console.log(id, " ", code);
    try{
        const result = await pool.query('UPDATE languages SET code = $1 WHERE id = $2', [code, id]);
        res.status(200).json({message: "Updated successfully"})
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error");
    }
})

app.get('/api/users', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = "SELECT id, name, login, user_type FROM users WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT id, name, login, user_type FROM users ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }   
});

app.get('/api/missingPhrases', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM missing_phrases WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM missing_phrases ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }   
})

app.get('/api/missingPhrasesDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'select m.id, code, login as login, phrase, definition, c.name as category, level ' 
            + 'from missing_phrases m, languages l, users u, categories c, difficulty_levels dl '
            + 'where m.languages_id=l.id and m.users_id=u.id and m.category=c.id and m.difficulty_level=dl.id ' 
            + 'AND m.id = ' + id + ';'
        const result = await pool.query(id ? condition : 'select m.id, code, login as login, phrase, definition, c.name as category, level ' 
            + 'from missing_phrases m, languages l, users u, categories c, difficulty_levels dl '
            + 'where m.languages_id=l.id and m.users_id=u.id and m.category=c.id and m.difficulty_level=dl.id ' 
            + 'ORDER BY m.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }   
})

app.post('/api/missingPhrases', async (req, res) =>{
    const { phrase, definition, languages_id, users_id, difficulty_level, category } = req.body;
    console.log("App ", phrase, users_id);
    try{
        const phraseExists = await pool.query('SELECT * FROM missing_phrases WHERE phrase = $1', [phrase]);
        if(phraseExists.rows.length > 0){
            return res.status(400).json({ error: "Phrase already reported" });
        }
        await pool.query(
            'INSERT INTO missing_phrases(phrase, definition, languages_id, users_id, difficulty_level, category) VALUES ($1, $2, $3, $4, $5, $6)', [phrase, definition, languages_id, users_id, difficulty_level, category]
        );
        res.status(200).json({ message: "Phrase reported successfully" });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.delete('/api/missingPhrases', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try{
        const result = await pool.query('DELETE FROM missing_phrases WHERE id = $1', [id]);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

app.get('/api/wordsPolish', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM words_polish WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM words_polish ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }  
});

app.get('/api/wordsPolishDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT wp.id, word, definition, photo, c.name as category '
            + 'FROM words_polish wp, categories c '
            + 'WHERE wp.categories_id=c.id AND wp.id = ' + id + ';'
        const result = await pool.query(id ? condition : 
            'SELECT wp.id, word, definition, photo, c.name as category '
            + 'FROM words_polish wp, categories c '
            + 'WHERE wp.categories_id=c.id ORDER BY wp.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }  
});

app.get('/api/wordsEnglish', async (req, res) => {
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM words_english WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM words_english ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/wordsEnglishDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT we.id, word, definition, dl.level as level, c.name as category '
            + 'FROM words_english we, categories c, difficulty_levels dl '
            + 'WHERE we.categories_id=c.id and we.difficultylevel_id=dl.id AND id = ' + id + ';'
        const result = await pool.query(id ? condition : 
            'SELECT we.id, word, definition, dl.level as level, c.name as category '
            + 'FROM words_english we, categories c, difficulty_levels dl '
            + 'WHERE we.categories_id=c.id and we.difficultylevel_id=dl.id ORDER BY we.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }  
});

app.get('/api/translationPLNENG', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM translations_pl_eng WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM translations_pl_eng ORDER BY id ASC;');
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

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});