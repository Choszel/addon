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
    const { login, password } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPass = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (login, password, user_type) VALUES ($1, $2, $3, 0)',
            [login, hashedPass]
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
            { userId: user.rows[0].id, userLogin: user.rows[0].login, userType: user.rows[0].user_type }, 
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
    const { login } = req.query;
    try{
        const condition = "SELECT id, login, user_type FROM users WHERE login = '" + login + "';";
        const result = await pool.query(login ? condition : 'SELECT id, login, user_type FROM users ORDER BY id ASC;');
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
        const condition = 'select m.id, code, login as user, phrase, definition, c.name as category, level, part_of_speech ' 
            + 'from missing_phrases m, languages l, users u, categories c, difficulty_levels dl '
            + 'where m.languages_id=l.id and m.users_id=u.id and m.category=c.id and m.difficulty_level=dl.id ' 
            + 'AND m.id = ' + id + ';'
        const result = await pool.query(id ? condition : 'select m.id, code, login as user, phrase, definition, c.name as category, level, part_of_speech ' 
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
    const { phrase, definition, languages_id, users_id, difficulty_level, category, part_of_speech } = req.body;
    console.log("App ", phrase, users_id);
    try{
        const phraseExists = await pool.query('SELECT * FROM missing_phrases WHERE phrase = $1', [phrase]);
        if(phraseExists.rows.length > 0){
            return res.status(400).json({ error: "Phrase already reported" });
        }
        await pool.query(
            'INSERT INTO missing_phrases(phrase, definition, languages_id, users_id, difficulty_level, category, part_of_speech) VALUES ($1, $2, $3, $4, $5, $6, $7)', [phrase, definition, languages_id, users_id, difficulty_level, category, part_of_speech]
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

app.get('/api/wordsPolish/word', async (req, res) => {
    const { word } = req.query;
    try{
        if(!word)return;
        const result = await pool.query("SELECT id, word FROM words_polish WHERE word like '" + word + "%';");
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

app.get('/api/wordsPolishByWord', async(req, res)=>{
    const { word, category } = req.query;
    try{
        const condition = "SELECT * FROM words_polish WHERE word = '" + word + "' AND categories_id = " + category + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM words_polish ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }  
});

app.delete('/api/wordsPolish', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try{
        const result = await pool.query('DELETE FROM words_polish WHERE id = $1', [id]);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

app.put('/api/wordsPolish', async (req, res) =>{
    const { id, word, definition, categories_id, photo } = req.body;
    console.log(id, " ", word);
    try{
        const result = await pool.query('UPDATE words_polish SET word = $2, definition = $3, categories_id = $4, photo = $5 WHERE id = $1', [id, word, definition, categories_id, photo]);
        res.status(200).json({message: "Updated successfully"})
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error");
    }
})

app.post('/api/wordsPolish', async (req, res) => {
    const { word, categories_id, definition, photo } = req.body;
    console.log("App ", word, categories_id);
    
    try {
        const phraseExists = await pool.query('SELECT * FROM words_polish WHERE word = $1 AND categories_id = $2', [word, categories_id]);
        if (phraseExists.rows.length > 0) {
            return res.status(400).json({ error: "Phrase already exists" });
        }
        const insertResult = await pool.query('INSERT INTO words_polish(word, categories_id, definition, photo) VALUES ($1, $2, $3, $4) RETURNING id', 
            [word, categories_id, definition, photo]);
        
        const newWordId = insertResult.rows[0].id; 

        res.json({ id: newWordId }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


app.get('/api/wordsEnglish', async (req, res) => {
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM words_english WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM words_english ORDER BY popularity DESC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.put('/api/wordsEnglish/raisePopularity', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try {       
        const result = await pool.query('UPDATE words_english SET popularity = popularity+1 WHERE id = $1', [id]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.get('/api/wordsEnglish/word', async (req, res) => {
    const { word } = req.query;
    try{
        if(!word)return;
        const result = await pool.query("SELECT id, word FROM words_english WHERE word like '" + word + "%' ORDER BY popularity;");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/wordsEnglishDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = `SELECT we.id, word, definition, dl.level as level, c.name as category, part_of_speech `
            + 'FROM words_english we, categories c, difficulty_levels dl '
            + 'WHERE we.categories_id=c.id and we.difficultylevel_id=dl.id AND we.id = ' + id + ';'
        const result = await pool.query(id ? condition : 
            `SELECT we.id, word, definition, dl.level as level, c.name as category, part_of_speech as "part of speech"`
            + 'FROM words_english we, categories c, difficulty_levels dl '
            + 'WHERE we.categories_id=c.id and we.difficultylevel_id=dl.id ORDER BY we.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }  
});

app.delete('/api/wordsEnglish', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try{
        const result = await pool.query('DELETE FROM words_english WHERE id = $1', [id]);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

app.put('/api/wordsEnglish', async (req, res) =>{
    const { id, word, definition, difficultylevel_id, categories_id, part_of_speech } = req.body;
    console.log(id, " ", word);
    try{
        const result = await pool.query('UPDATE words_english SET word = $2, definition = $3, difficultylevel_id = $4, categories_id = $5, part_of_speech = $6 WHERE id = $1', [id, word, definition, difficultylevel_id, categories_id, part_of_speech]);
        res.status(200).json({message: "Updated successfully"})
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error");
    }
})

app.post('/api/wordsEnglish', async (req, res) => {
    const { word, definition, difficultylevel_id, categories_id, part_of_speech } = req.body;
    console.log("App ", word, categories_id);
    
    try {
        const phraseExists = await pool.query('SELECT * FROM words_english WHERE word = $1 AND categories_id = $2', [word, categories_id]);
        if (phraseExists.rows.length > 0) {
            return res.status(400).json({ error: "Phrase already exists" });
        }
        const insertResult = await pool.query('INSERT INTO words_english(word, definition, difficultylevel_id, categories_id, part_of_speech) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
            [word, definition, difficultylevel_id, categories_id, part_of_speech]);
        
        const newWordId = insertResult.rows[0].id; 

        res.json({ id: newWordId }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/api/translationPLNENGDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT tr.id, wp.word as word_polish, we.word as word_english '
            + 'FROM translations_pl_eng tr, words_polish wp, words_english we '
            + 'WHERE tr.words_polish_id=wp.id and tr.words_english_id=we.id AND tr.id = ' + id + ';';
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word as word_polish, we.word as word_english '
            + 'FROM translations_pl_eng tr, words_polish wp, words_english we '
            + 'WHERE tr.words_polish_id=wp.id and tr.words_english_id=we.id ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/translationPLNENG/pln', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT tr.id, we.word as word '
            + 'FROM translations_pl_eng tr, words_english we '
            + 'WHERE tr.words_english_id=we.id AND tr.words_polish_id = ' + id + ';';
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word, we.word '
            + 'FROM translations_pl_eng tr, words_polish wp, words_english we '
            + 'WHERE tr.words_polish_id=wp.id and tr.words_english_id=we.id ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/translationPLNENGDetailed/pln', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT we.id, tr.id as translation_id, we.word as word, definition, dl.level as level, c. name as category, part_of_speech '
            + 'FROM translations_pl_eng tr, words_english we, difficulty_levels dl, categories c '
            + 'WHERE tr.words_english_id=we.id AND dl.id = we.difficultylevel_id AND c.id = we.categories_id AND tr.words_polish_id = ' + id + ';';
        const result = await pool.query(id ? condition : 'SELECT we.id, tr.id as translation_id, we.word as word, definition, dl.level as level, c. name as category, part_of_speech '
            + 'FROM translations_pl_eng tr, words_english we, difficulty_levels dl, categories c '
            + 'WHERE tr.words_english_id=we.id AND dl.id = we.difficultylevel_id AND c.id = we.categories_id ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/translationPLNENG/eng', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT tr.id, wp.word as word '
            + 'FROM translations_pl_eng tr, words_polish wp '
            + 'WHERE tr.words_polish_id=wp.id AND tr.words_english_id = ' + id + ';';
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word, we.word '
            + 'FROM translations_pl_eng tr, words_polish wp, words_english we '
            + 'WHERE tr.words_polish_id=wp.id and tr.words_english_id=we.id ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/translationPLNENGDetailed/eng', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT wp.id, tr.id as translation_id, wp.word as word, definition, c. name as category, photo '
            + 'FROM translations_pl_eng tr, words_polish wp, categories c '
            + 'WHERE tr.words_polish_id=wp.id AND c.id = wp.categories_id AND tr.words_english_id = ' + id + ';';
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word as word, definition, c. name as category, photo '
            + 'FROM translations_pl_eng tr, words_polish wp, categories c '
            + 'WHERE tr.words_polish_id=wp.id AND c.id = wp.categories_id ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.get('/api/translationPLNENGDetailed/pln/word', async(req, res)=>{
    const { word } = req.query;
    try{
        const result = await pool.query("SELECT we.id, tr.id as translation_id, we.word as word, we.definition, dl.level as level, c. name as category, part_of_speech "
            + "FROM translations_pl_eng tr, words_english we, difficulty_levels dl, categories c, words_polish wp "
            + "WHERE tr.words_english_id=we.id AND dl.id = we.difficultylevel_id AND c.id = we.categories_id AND tr.words_polish_id = wp.id AND wp.word = '" + word + "';");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

app.delete('/api/translationPLNENG', async (req, res) =>{
    const { id } = req.body;
    try{
        const result = await pool.query('DELETE FROM translations_pl_eng WHERE id = $1', [id]);
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

app.post('/api/translationPLNENG', async (req, res) =>{
    const { words_polish_id, words_english_id } = req.body;
    console.log("App ", words_polish_id, words_english_id);
    try{
        const phraseExists = await pool.query('SELECT * FROM translations_pl_eng WHERE words_polish_id = $1 AND words_english_id = $2', [words_polish_id, words_english_id]);
        if(phraseExists.rows.length > 0){
            return res.status(400).json({ error: "Translation already exists" });
        }
        await pool.query(
            'INSERT INTO translations_pl_eng(words_polish_id, words_english_id) VALUES ($1, $2)', [words_polish_id, words_english_id]
        );
        res.status(200).json({ message: "Translation added successfully" });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.get('/api/quizzes', async (req, res) => {
    try {
        const { id, user, language, name } = req.query;
        let query = 'SELECT q.id, q.title, u.login as user, l.code as language, execution_date, type '
        + 'FROM quizzes q, users u, languages l '
        + 'WHERE q.users_id=u.id AND q.languages_id=l.id ';
        const conditions = [];
        if (id) conditions.push(`q.id = ${id}`);
        if (user) conditions.push(`u.login = '${user}'`);
        if (language) conditions.push(`l.code = '${language}'`);
        if (name) conditions.push(`q.title LIKE '%${name}%'`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        query += ' ORDER BY q.popularity DESC;';
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/api/quizzes', async (req, res) => {
    try{
        const { id } = req.body;
        console.log(id);
        const result = await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);
        res.status(200).json({message: result});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

app.post('/api/quizzes', async (req, res) =>{
    const { title, users_id, languages_id, execution_date } = req.body;
    console.log("App ", title, users_id, languages_id, execution_date);
    try{
        const insertResult = await pool.query(
            'INSERT INTO quizzes(title, users_id, languages_id, execution_date) VALUES ($1, $2, $3, $4) RETURNING id', [title, users_id, languages_id, execution_date]
        );
        const newQuizId = insertResult.rows[0].id; 

        res.json({ id: newQuizId }); 
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/api/quizzesQuestions/ENG', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT qqe.id, qqe.quizzes_id, qqe.question_id, we.word as word_second, we.definition as ws_definition, '
        + 'we.difficultylevel_id as ws_level_id, we.categories_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.categories_id as wp_category_id, wp.photo as wp_photo '
        + 'FROM quizzes_questions_eng qqe, translations_pl_eng tpe, words_english we, words_polish wp '
        + 'WHERE qqe.question_id = tpe.id AND tpe.words_polish_id = wp.id AND tpe.words_english_id = we.id AND qqe.quizzes_id = ' + id + ' ORDER BY qqe.id ASC'
        const result = await pool.query(id ? condition : 'SELECT qqe.id, qqe.quizzes_id, qqe.question_id, we.word as word_second, we.definition as ws_definition, '
        + 'we.difficultylevel_id as ws_level_id, we.categories_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.categories_id as wp_category_id, wp.photo as wp_photo '
        + 'FROM quizzes_questions_eng qqe, translations_pl_eng tpe, words_english we, words_polish wp '
        + 'WHERE qqe.question_id = tpe.id AND tpe.words_polish_id = wp.id AND tpe.words_english_id = we.id ORDER BY qqe.id ASC');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/quizzesQuestions/ENG', async (req, res) => {
    const { quiz_id, data } = req.body;
  
    console.log(quiz_id, data)
    try {
      const questions = JSON.parse(data);
      const values = questions.map((q) => [
        quiz_id,
        q.translation_id,
      ]);
  
      const query =
        'INSERT INTO quizzes_questions_eng (quizzes_id, question_id) VALUES ($1, $2)';
      const results = await Promise.all(
        values.map((value) => {return pool.query(query, value)})
      );
  
      res.json({ success: true, rows: results.map((result) => result.rows) });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

app.get('/api/quizzesQuestions/Count', async(req, res)=>{
    try{
        const { id } = req.query;
        const result = await pool.query('SELECT count(*) as amount_of_questions FROM quizzes_questions_eng WHERE quizzes_id=$1;', [id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
   
app.get('/api/usersQuizzesQuestions', async(req, res)=>{
    try{
        const { id, userId } = req.query;
        const condition = 'SELECT qqe.id, qqe.quizzes_id, qqe.question_id, we.word as word_second, we.definition as ws_definition, '
        + 'we.difficultylevel_id as ws_level_id, we.categories_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.categories_id as wp_category_id, wp.photo as wp_photo, '
        + 'EXISTS (SELECT 1 FROM users_quizzes_questions uqq, users_quizzes_scores uqs WHERE uqq.quizzes_questions_id = qqe.id AND uqs.users_id=' + userId + ' AND uqs.quizzes_id=qqe.quizzes_id AND uqq.users_quizzes_scores_id=uqs.id) AS done '
        + 'FROM quizzes_questions_eng qqe, translations_pl_eng tpe, words_english we, words_polish wp '
        + 'WHERE qqe.question_id = tpe.id AND tpe.words_polish_id = wp.id AND tpe.words_english_id = we.id AND qqe.quizzes_id = ' + id + ' ORDER BY qqe.id ASC'
        const result = await pool.query(userId ? condition : 'SELECT qqe.id, qqe.quizzes_id, qqe.question_id, we.word as word_second, we.definition as ws_definition, '
        + 'we.difficultylevel_id as ws_level_id, we.categories_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.categories_id as wp_category_id, wp.photo as wp_photo '
        + 'FROM quizzes_questions_eng qqe, translations_pl_eng tpe, words_english we, words_polish wp '
        + 'WHERE qqe.question_id = tpe.id AND tpe.words_polish_id = wp.id AND tpe.words_english_id = we.id AND qqe.quizzes_id = ' + id + ' ORDER BY qqe.id ASC');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});  

app.get('/api/usersQuizzesScores', async(req, res)=>{
    try{
        const { id } = req.query;
        const result = await pool.query('SELECT q.id, q.title, u.login as user, l.code as language, execution_date '
        + 'FROM quizzes q, users u, languages l, users_quizzes_scores uqs '
        + 'WHERE uqs.quizzes_id=q.id AND q.users_id=u.id AND q.languages_id=l.id AND uqs.users_id=$1 ORDER BY uqs.id DESC;', [id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/stories', async(req, res)=>{
    try{
        const { quiz_id } = req.query;
        const result = await pool.query('SELECT * '
        + 'FROM stories '
        + 'WHERE quiz_id = $1;', [quiz_id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/storiesQuestions', async(req, res)=>{
    try{
        const { quiz_id } = req.query;
        const result = await pool.query('SELECT * '
        + 'FROM stories_questions '
        + 'WHERE quiz_id = $1;', [quiz_id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/storiesAnswers', async(req, res)=>{
    try{
        const { question_id } = req.query;
        const result = await pool.query('SELECT * '
        + 'FROM stories_answers '
        + 'WHERE question_id = $1;', [question_id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});