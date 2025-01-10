const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const { OpenAI } = require('openai');
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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.post('/api/ai', async (req, res) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const {inLanguage, outLanguage, inputText } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `Translate the given text in language which code is "${inLanguage}" into language which code is "${outLanguage}".` },
                { role: "user", content: `Please, translate this: "${inputText}"` }
            ]
        });

        res.json({ analysis: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error from OpenAI API:", error);
        res.status(500).json({ error: "Tłumaczenie zakończono niepowodzeniem" });
    }
});

app.post('/api/ai/similarPhrases', async (req, res) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { inputText, inLanguage } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `Proszę, znajdź podone frazy, synonimy, antonimy, związki frazeologiczne, powiedzenia i tym podobne w języku 
                "${inLanguage}" z polskimi tłumaczeniami do słowa: "${inputText}". Tekst, który przekażesz będzie interpretowany jako surowy HTML, 
                więc oznacz w <h2><h2> nagłówki. Dodatkowo znalezione frazy w języku "${inLanguage}" oznacz w <strong><strong>.
                Nie dodawaj słowa html i nie rób listy punktowanej. Oddziel synonimy, związki frazeologiczne i tym podobne czymś w rodzaju nagłówków` },
                { role: "user", content: `Proszę, znajdź podone frazy, synonimy, związki frazeologiczne, powiedzenia, itp. do słowa: "${inputText}"` }
            ]
        });

        res.json({ analysis: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error from OpenAI API:", error);
        res.status(500).json({ error: "Wyszukiwanie zakończono niepowodzeniem" });
    }
});

app.post('/api/register', async (req, res) => {
    const { login, password } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Dany użytkownik już istnieje" });
        }
        const hashedPass = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (login, password, user_type) VALUES ($1, $2, 0)',
            [login, hashedPass]
        );

        res.status(201).json({ message: "Pomyślnie zarejestrowano" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/login', async (req, res) =>{
    const { login, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Podano niepoprawny login" });
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ error: "Podano niepoprawne hasło" });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, userLogin: user.rows[0].login, userType: user.rows[0].user_type }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/headers', async(req, res)=>{
    const {tableName} = req.query;

    try{    
        const result = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', [tableName]);
        res.json(result.rows.map(row => row.column_name));
    }catch(err){
        console.log(err);
        res.status(500).send(errorMessageTranslator(err.code));
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
        res.status(500).send(errorMessageTranslator(err.code));
    }   
});

app.post('/api/category', async (req, res) =>{
    const { name } = req.body;
    console.log("App ", name);
    try{
        const categoryExists = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
        if(categoryExists.rows.length > 0){
            return res.status(400).json({ error: "Dana kategoria już istnieje" });
        }
        await pool.query(
            'INSERT INTO categories(name) VALUES ($1)', [name]
        );
        res.status(200).json({ message: "Pomyślnie dodano kategorię" });
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.delete('/api/category', async (req, res) =>{
    const { id } = req.body;
    try{
        const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto kategorię" });
        } else {
            res.status(404).json({ message: "Nie znaleziono kategorii o podanym ID" });
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.put('/api/category', async (req, res) =>{
    const { id, name } = req.body;
    console.log(id, " ", name);
    try{
        const categoryExists = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
        if(categoryExists.rows.length > 0){
            return res.status(400).json({ error: "Dana kategoria już istnieje" });
        }
        const result = await pool.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
        res.status(200).json({message: "Pomyślnie edytowano kategorię"})
    }catch(err){
        console.log(err.message)
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.get('/api/difficultyLevel', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM difficulty_levels;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
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
        res.status(500).send(errorMessageTranslator(err.code));
    }   
})

app.post('/api/language', async (req, res) =>{
    const { code } = req.body;
    console.log("App ", code);
    try{
        const languageExists = await pool.query('SELECT * FROM languages WHERE code = $1', [code]);
        if(languageExists.rows.length > 0){
            return res.status(400).json({ error: "Dany język już istnieje" });
        }
        await pool.query('INSERT INTO languages(code) VALUES ($1);', [code]);
        res.status(200).json({ message: "Pomyślnie dodano język" });
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.delete('/api/language', async (req, res) =>{
    const { id } = req.body;
    try{
        const result = await pool.query('DELETE FROM languages WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto język" });
        } else {
            res.status(404).json({ message: "Nie znaleziono języka o podanym ID" });
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.put('/api/language', async (req, res) =>{
    const { id, code } = req.body;
    console.log(id, " ", code);
    try{
        const languageExists = await pool.query('SELECT * FROM languages WHERE code = $1', [code]);
        if(languageExists.rows.length > 0){
            return res.status(400).json({ error: "Dany język już istnieje" });
        }
        await pool.query('UPDATE languages SET code = $1 WHERE id = $2', [code, id]);
        res.status(200).json({message: "Pomyślnie edytowano język"})
    }catch(err){
        console.log(err.message)
        res.status(500).json(err.message);
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
        res.status(500).send(errorMessageTranslator(err.code));
    }   
});

app.put('/api/users', async (req, res) =>{
    const { login, user_type } = req.body;
    console.log("users put", login, " ", user_type);
    try{
        await pool.query('UPDATE users SET user_type = $1 WHERE login = $2', [user_type, login]);
        res.status(200).json({message: "Pomyślnie mianowano użytkownika"})
    }catch(err){
        console.log(err.message)
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.get('/api/missingPhrases', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = "SELECT * FROM missing_phrases WHERE id = " + id + ";";
        const result = await pool.query(id ? condition : 'SELECT * FROM missing_phrases ORDER BY id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }   
})

app.get('/api/missingPhrasesDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT m.id, l.code, u.login AS user, m.phrase, m.definition, c.name AS category, dl.level, m.part_of_speech, photo '
            + 'FROM missing_phrases m '
            + 'JOIN languages l ON m.language_id = l.id '
            + 'JOIN users u ON m.user_id = u.id '
            + 'JOIN categories c ON m.category_id = c.id '
            + 'LEFT OUTER JOIN difficulty_levels dl ON m.difficulty_level_id = dl.id '
            + 'WHERE m.id = ' + id + ';'
        const result = await pool.query(id ? condition : 'SELECT m.id, l.code, u.login AS user, m.phrase, m.definition, c.name AS category, dl.level, m.part_of_speech, photo '
            + 'FROM missing_phrases m '
            + 'JOIN languages l ON m.language_id = l.id '
            + 'JOIN users u ON m.user_id = u.id '
            + 'JOIN categories c ON m.category_id = c.id '
            + 'LEFT OUTER JOIN difficulty_levels dl ON m.difficulty_level_id = dl.id '
            + 'ORDER BY m.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }   
})

app.post('/api/missingPhrases', async (req, res) =>{
    const { phrase, definition, language_id, user_id, photo, difficulty_level_id, category_id, part_of_speech } = req.body;
    console.log("App ", phrase, user_id);
    try{
        const phraseExists = await pool.query('SELECT * FROM missing_phrases WHERE phrase = $1', [phrase]);
        if(phraseExists.rows.length > 0){
            return res.status(400).json({ error: "Dana fraza już została zgłoszona" });
        }
        await pool.query(
            'INSERT INTO missing_phrases(phrase, definition, language_id, user_id, photo, difficulty_level_id, category_id, part_of_speech) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [phrase, definition, language_id, user_id, photo, difficulty_level_id, category_id, part_of_speech]
        );
        res.status(200).json({ message: "Pomyślnie zgłoszono frazę" });
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.delete('/api/missingPhrases', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try{
        const result = await pool.query('DELETE FROM missing_phrases WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto frazę" });
        } else {
            res.status(404).json({ message: "Nie znaleziono frazy o podanym ID" });
        }    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
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
        res.status(500).send(errorMessageTranslator(err.code));
    }  
});

app.get('/api/wordsPolish/word', async (req, res) => {
    const { word } = req.query;
    try{
        if(!word)return res.status(500).send('Nie podano wskaźnika');
        const result = await pool.query("SELECT id, word FROM words_polish WHERE word like '" + word + "%';");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/wordsPolishDetailed', async(req, res)=>{
    const { id } = req.query;
    try{
        const condition = 'SELECT wp.id, word, definition, photo, c.name as category '
            + 'FROM words_polish wp, categories c '
            + 'WHERE wp.category_id=c.id AND wp.id = ' + id + ';'
        const result = await pool.query(id ? condition : 
            'SELECT wp.id, word, definition, photo, c.name as category '
            + 'FROM words_polish wp, categories c '
            + 'WHERE wp.category_id=c.id ORDER BY wp.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }  
});

app.delete('/api/wordsPolish', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try{
        const result = await pool.query('DELETE FROM words_polish WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto frazę" });
        } else {
            res.status(404).json({ message: "Nie znaleziono frazy o podanym ID" });
        }    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.put('/api/wordsPolish', async (req, res) =>{
    const { id, word, definition, category_id, photo } = req.body;
    console.log(id, " ", word);
    try{
        const phraseExists = await pool.query('SELECT * FROM words_polish WHERE word = $1 AND category_id = $2', [word, category_id]);
        if (phraseExists.rows.length > 0 && phraseExists.rows[0].id != id) {
            return res.status(400).json({ error: "Dana fraza już istnieje" });
        }
        const result = await pool.query('UPDATE words_polish SET word = $2, definition = $3, category_id = $4, photo = $5 WHERE id = $1', [id, word, definition, category_id, photo]);
        res.status(200).json({message: "Pomyślnie edytowano frazę"})
    }catch(err){
        console.log(err.message)
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.post('/api/wordsPolish', async (req, res) => {
    const { word, category_id, definition, photo } = req.body;
    console.log("App ", word, category_id);
    
    try {
        const phraseExists = await pool.query('SELECT * FROM words_polish WHERE word = $1 AND category_id = $2', [word, category_id]);
        if (phraseExists.rows.length > 0) {
            return res.status(400).json({ error: "Dana fraza już istnieje" });
        }
        const insertResult = await pool.query('INSERT INTO words_polish(word, category_id, definition, photo) VALUES ($1, $2, $3, $4) RETURNING id', 
            [word, category_id, definition, photo]);
        
        const newWordId = insertResult.rows[0].id; 

        res.json({ id: newWordId }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/words/limit', async (req, res) => {
    const { language, limit } = req.query;
    const { isAllowed = true, table }= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try {
        const result = await pool.query(
            `SELECT * FROM ${table} ORDER BY popularity DESC LIMIT $1;`,
            [limit]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.put('/api/words/raisePopularity', async (req, res) =>{
    const { language, id } = req.body;
    const { isAllowed = true, table }= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    console.log(id);
    try {       
        const result = await pool.query(`UPDATE ${table} SET popularity = popularity+1 WHERE id = $1`, [id]);
        res.status(200).json({ message: "Pomyślnie znaleziono frazę" });;
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.get('/api/wordsSecond/word', async (req, res) => {
    const { language, word } = req.query;
    const { isAllowed = true, table}= allowedLanguage(language);
    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        if(!word)return;
        const result = await pool.query(`SELECT id, word FROM ${table} WHERE word like '` + word + "%' ORDER BY popularity;");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/wordsSecond', async (req, res) => {
    const { language, id } = req.query;
    const { isAllowed = true, table }= allowedLanguage(language);
    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = `SELECT * FROM ${table} WHERE id = ` + id + ";";
        const result = await pool.query(id ? condition : `SELECT * FROM ${table} ORDER BY popularity DESC;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/wordsSecondDetailed', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true, table } = allowedLanguage(language);
    console.log("wordsSecondDetailed language", language);
    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = `SELECT ws.id, word, definition, dl.level as level, c.name as category, part_of_speech `
            + `FROM ${table} ws, categories c, difficulty_levels dl `
            + 'WHERE ws.category_id=c.id and ws.difficulty_level_id=dl.id AND ws.id = ' + id + ';'
        const result = await pool.query(id ? condition : 
            `SELECT ws.id, word, definition, dl.level as level, c.name as category, part_of_speech as "part of speech"`
            + `FROM ${table} ws, categories c, difficulty_levels dl `
            + 'WHERE ws.category_id=c.id and ws.difficulty_level_id=dl.id ORDER BY ws.id ASC;');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }  
});

app.delete('/api/wordsSecond', async (req, res) =>{
    const { language, id } = req.body;
    const { isAllowed = true, table }= allowedLanguage(language);
    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    console.log(id);
    try{
        const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto frazę" });
        } else {
            res.status(404).json({ message: "Nie znaleziono frazy o podanym ID" });
        }    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.put('/api/wordsSecond', async (req, res) =>{
    const { language, id, word, definition, difficulty_level_id, category_id, part_of_speech } = req.body;
    const { isAllowed = true, table }= allowedLanguage(language);
    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    console.log(id, " ", word);

    try{
        const phraseExists = await pool.query(`SELECT * FROM ${table} WHERE word = $1 AND category_id = $2`, [word, category_id]);
        if (phraseExists.rows.length > 0 && phraseExists.rows[0].id != id) {
            return res.status(400).json({ error: "Dana fraza już istnieje" });
        }
        const result = await pool.query(`UPDATE ${table} SET word = $2, definition = $3, difficulty_level_id = $4, category_id = $5, part_of_speech = $6 WHERE id = $1`, [id, word, definition, difficulty_level_id, category_id, part_of_speech]);
        res.status(200).json({message: "Pomyślnie edytowano frazę"})
    }catch(err){
        console.log(err.message)
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.post('/api/wordsSecond', async (req, res) => {
    const { language, word, definition, difficulty_level_id, category_id, part_of_speech } = req.body;
    const { isAllowed = true, table }= allowedLanguage(language);
    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    console.log("App ", word, category_id);
    
    try {
        const phraseExists = await pool.query(`SELECT * FROM ${table} WHERE word = $1 AND category_id = $2`, [word, category_id]);
        if (phraseExists.rows.length > 0) {
            return res.status(400).json({ error: "Dana fraza już istnieje" });
        }
        const insertResult = await pool.query(`INSERT INTO ${table}(word, definition, difficulty_level_id, category_id, part_of_speech) VALUES ($1, $2, $3, $4, $5) RETURNING id`, 
            [word, definition, difficulty_level_id, category_id, part_of_speech]);
        
        const newWordId = insertResult.rows[0].id; 

        res.json({ id: newWordId }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/translationPOL_Detailed', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    console.log("translationPOL_Detailed", language, id);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = 'SELECT tr.id, wp.word as word_polish, ws.word as word_second, ws.category_id, ws.difficulty_level_id '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp, ${table} ws `
            + `WHERE tr.word_polish_id=wp.id and tr.${fkName}=ws.id AND tr.id = ` + id + ';';
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word as word_polish, ws.word as word_second, ws.category_id, ws.difficulty_level_id '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp, ${table} ws `
            + `WHERE tr.word_polish_id=wp.id and tr.${fkName}=ws.id ORDER BY id ASC;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/translationPOL_/pol', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = 'SELECT tr.id, ws.word as word_second '
            + `FROM translations_pl_${language.toLowerCase()} tr, ${table} ws `
            + `WHERE tr.${fkName}=ws.id AND tr.word_polish_id = ` + id + `;`;
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word as word_polish, ws.word as word_second '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp, ${table} ws `
            + `WHERE tr.word_polish_id=wp.id and tr.${fkName}=ws.id ORDER BY id ASC;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/translationPOL_Detailed/pol', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = 'SELECT ws.id, tr.id as translation_id, ws.word as word, definition, dl.level as level, c. name as category, part_of_speech '
            + `FROM translations_pl_${language.toLowerCase()} tr, ${table} ws, difficulty_levels dl, categories c `
            + `WHERE tr.${fkName}=ws.id AND dl.id = ws.difficulty_level_id AND c.id = ws.category_id AND tr.word_polish_id = ` + id + ';';
        const result = await pool.query(id ? condition : 'SELECT ws.id, tr.id as translation_id, ws.word as word, definition, dl.level as level, c. name as category, part_of_speech '
            + `FROM translations_pl_${language.toLowerCase()} tr, ${table} ws, difficulty_levels dl, categories c `
            + `WHERE tr.${fkName}=ws.id AND dl.id = ws.difficulty_level_id AND c.id = ws.category_id ORDER BY id ASC;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/translationPOL_/_', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = 'SELECT tr.id, wp.word as word_polish '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp `
            + `WHERE tr.word_polish_id=wp.id AND tr.${fkName} = ` + id + ';';
        const result = await pool.query(id ? condition : 'SELECT tr.id, wp.word as word_polish, ws.word as word_second '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp, ${table} ws `
            + `WHERE tr.word_polish_id=wp.id and tr.${fkName}=ws.id ORDER BY id ASC;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/translationPOL_Detailed/_', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }
    console.log("translationPOL_Detailed/_",language, id)

    try{
        const condition = 'SELECT wp.id, tr.id as translation_id, wp.word as word, definition, c. name as category, photo '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp, categories c `
            + `WHERE tr.word_polish_id=wp.id AND c.id = wp.category_id AND tr.${fkName} = ` + id + ';';
        const result = await pool.query(id ? condition : 'SELECT wp.id, tr.id as translation_id, wp.word as word, definition, c. name as category, photo '
            + `FROM translations_pl_${language.toLowerCase()} tr, words_polish wp, categories c `
            + `WHERE tr.word_polish_id=wp.id AND c.id = wp.category_id ORDER BY id ASC;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.get('/api/translationPOL_Detailed/pol/word', async(req, res)=>{
    const { language, word } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const result = await pool.query("SELECT ws.id, tr.id as translation_id, ws.word as word, ws.definition, dl.level as level, c. name as category, part_of_speech "
            + `FROM translations_pl_${language.toLowerCase()} tr, ${table} ws, difficulty_levels dl, categories c, words_polish wp `
            + `WHERE tr.${fkName}=ws.id AND dl.id = ws.difficulty_level_id AND c.id = ws.category_id AND tr.word_polish_id = wp.id AND wp.word = '` + word + "';");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    } 
});

app.delete('/api/translationPOL_', async (req, res) =>{
    const { id } = req.body;
    const { language } = req.query;
    const { isAllowed } = allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    } 

    try{
        const result = await pool.query(`DELETE FROM translations_pl_${language.toLowerCase()} WHERE id = $1`, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto tłumaczenie" });
        } else {
            res.status(404).json({ message: "Nie znaleziono tłumaczenia o podanym ID" });
        }}catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.post('/api/translationPOL_', async (req, res) =>{
    const { language, word_polish_id, word_second_id } = req.body;
    const { isAllowed = true, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }  

    console.log("App ", word_polish_id, word_second_id);
    try{
        const phraseExists = await pool.query(`SELECT * FROM translations_pl_${language.toLowerCase()} WHERE word_polish_id = $1 AND ${fkName} = $2`, [word_polish_id, word_second_id]);
        if(phraseExists.rows.length > 0){
            return res.status(400).json({ error: "Dane tłumaczenie już istnieje" });
        }
        await pool.query(
            `INSERT INTO translations_pl_${language.toLowerCase()}(word_polish_id, ${fkName}) VALUES ($1, $2)`, [word_polish_id, word_second_id]
        );
        res.status(200).json({ message: "Pomyślnie dodano tłumaczenie" });
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.get('/api/quizzes', async (req, res) => {
    try {
        const { id, user, language, title } = req.query;
        let query = 'SELECT q.id, q.title, u.login as user, l.code as language, execution_date, q.type '
        + 'FROM quizzes q, users u, languages l '
        + 'WHERE q.user_id=u.id AND q.language_id=l.id ';
        const conditions = [];
        if (id) conditions.push(`q.id = ${id}`);
        if (user) conditions.push(`u.login LIKE '%${user}%'`);
        if (language) conditions.push(`l.code = '${language}'`);
        if (title) conditions.push(`LOWER(q.title) LIKE '%${title}%'`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        query += ' ORDER BY q.popularity DESC;';
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.put('/api/quizzes/raisePopularity', async (req, res) =>{
    const { id } = req.body;
    console.log(id);
    try {       
        await pool.query('UPDATE quizzes SET popularity = popularity+1 WHERE id = $1', [id]);
        res.status(200).json({ message: "Pomyślnie zwiększono popularność quizu" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
})

app.delete('/api/quizzes', async (req, res) => {
    try{
        const { id } = req.body;
        console.log(id);
        const result = await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "Pomyślnie usunięto zestaw do nauki" });
        } else {
            res.status(404).json({ message: "Nie znaleziono zestawu do nauki o podanym ID" });
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/quizzes', async (req, res) =>{
    const { title, user_id, language_id, execution_date, type } = req.body;
    console.log("App ", title, user_id, language_id, execution_date);
    try{
        const insertResult = await pool.query(
            'INSERT INTO quizzes(title, user_id, language_id, execution_date, type) VALUES ($1, $2, $3, $4, $5) RETURNING id', [title, user_id, language_id, execution_date, type]
        );
        const newQuizId = insertResult.rows[0].id; 

        res.json({ id: newQuizId }); 
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/quizzesQuestions', async(req, res)=>{
    const { id, language } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = 'SELECT qqe.id, qqe.quiz_id, qqe.question_id, we.word as word_second, we.definition as ws_definition, '
        + 'we.difficulty_level_id as ws_level_id, we.category_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.category_id as wp_category_id, wp.photo as wp_photo '
        + `FROM quizzes_questions_${language.toLowerCase()} qqe, translations_pl_${language.toLowerCase()} tpe, ${table} we, words_polish wp `
        + `WHERE qqe.question_id = tpe.id AND tpe.word_polish_id = wp.id AND tpe.${fkName} = we.id AND qqe.quiz_id = ` + id + ' ORDER BY qqe.id ASC'
        const result = await pool.query(id ? condition : 'SELECT qqe.id, qqe.quiz_id, qqe.question_id, we.word as word_second, we.definition as ws_definition, '
        + 'we.difficulty_level_id as ws_level_id, we.category_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.category_id as wp_category_id, wp.photo as wp_photo '
        + `FROM quizzes_questions_${language.toLowerCase()} qqe, translations_pl_${language.toLowerCase()} tpe, ${table} we, words_polish wp `
        + `WHERE qqe.question_id = tpe.id AND tpe.word_polish_id = wp.id AND tpe.${fkName} = we.id ORDER BY qqe.id ASC`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/quizzesQuestions', async (req, res) => {
    const { language, quiz_id, data } = req.body;
    const { isAllowed = true }= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }
  
    console.log(quiz_id, data)
    try {
      const questions = JSON.parse(data);
      const values = questions.map((q) => [
        quiz_id,
        q.translation_id,
      ]);
  
      const query =
        `INSERT INTO quizzes_questions_${language.toLowerCase()} (quiz_id, question_id) VALUES ($1, $2)`;
      const results = await Promise.all(
        values.map((value) => {return pool.query(query, value)})
      );
  
      res.json({ success: true, rows: results.map((result) => result.rows) });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/quizzesQuestions/Count', async(req, res)=>{
    const { language, id } = req.query;
    const { isAllowed = true }= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const result = await pool.query(`SELECT count(*) as amount_of_questions FROM quizzes_questions_${language.toLowerCase()} WHERE quiz_id=$1;`, [id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/usersQuizzesQuestions', async(req, res)=>{
    try{
        const { language, id } = req.query;
        const { isAllowed = true }= allowedLanguage(language);

        if (!isAllowed) {
            return res.status(400).send('Niepoprawny język');
        }

        const condition = `SELECT * FROM users_quizzes_questions_${language.toLowerCase()} uqq `
        + 'WHERE user_quiz_score_id = ' + id + ' ' 
        + 'ORDER BY id ASC ;'
        const result = await pool.query(id ? condition : `SELECT * FROM users_quizzes_questions_${language.toLowerCase()} uqq ORDER BY id ASC ;`);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
}); 

function allowedLanguage(language){
    const allowedLanguages = ["POL", "ENG", "SPA"];

    if (!allowedLanguages.includes(language)) {
        return {isAllowed: false};
    }

    let table = "";
    switch(language){
        case "ENG":
            table = "words_english";
            break;
        case "SPA":
            table = "words_spanish";
            break;
        default:
            table = "words_polish"    
            break;
    }
    let fkName = table.substring(0, 4) + table.substring(5) + "_id"

    return {isAllowed: true, table: table, fkName: fkName};
}

function errorMessageTranslator(errorCode){
    switch(errorCode){
        case "23505":
            return "Błąd. Naruszono unikalność.";
        case "23503":
            return "Błąd. Naruszono klucz obcy.";
        case "22P02":
            return "Błąd. Podano nieprawidłowe dane.";
        default:
            return "Wystąpił błąd serwera, spróbuj ponownie później."    
    }
}
   
app.get('/api/usersQuizzesQuestionsDetailed', async(req, res)=>{
    const { language, id, userId } = req.query;
    const { isAllowed = true, table, fkName}= allowedLanguage(language);

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }

    try{
        const condition = 'SELECT qqe.id, qqe.quiz_id, qqe.question_id, ws.word as word_second, ws.definition as ws_definition, '
        + 'ws.difficulty_level_id as ws_level_id, ws.category_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.category_id as wp_category_id, wp.photo as wp_photo, '
        + `EXISTS (SELECT 1 FROM users_quizzes_questions_${language.toLowerCase()} uqq, users_quizzes_scores uqs WHERE uqq.quiz_question_id = qqe.id AND uqs.user_id=` + userId + ' AND uqs.quiz_id=qqe.quiz_id AND uqq.user_quiz_score_id=uqs.id) AS done '
        + `FROM quizzes_questions_${language.toLowerCase()} qqe, translations_pl_${language.toLowerCase()} tpe, ${table} ws, words_polish wp `
        + `WHERE qqe.question_id = tpe.id AND tpe.word_polish_id = wp.id AND tpe.${fkName} = ws.id AND qqe.quiz_id = ` + id + ' ORDER BY qqe.id ASC'
        const result = await pool.query(userId ? condition : 'SELECT qqe.id, qqe.quiz_id, qqe.question_id, ws.word as word_second, ws.definition as ws_definition, '
        + 'ws.difficulty_level_id as ws_level_id, ws.category_id as ws_category_id, '
        + 'wp.word as word_polish, wp.definition as wp_definition, wp.category_id as wp_category_id, wp.photo as wp_photo '
        + `FROM quizzes_questions_${language.toLowerCase()} qqe, translations_pl_${language.toLowerCase()} tpe, ${table} ws, words_polish wp `
        + `WHERE qqe.question_id = tpe.id AND tpe.word_polish_id = wp.id AND tpe.${fkName} = ws.id AND qqe.quiz_id = ` + id + ' ORDER BY qqe.id ASC');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});  

app.post('/api/usersQuizzesQuestions', async (req, res) => {
    const { language, quiz_score_id, data } = req.body;
    const { isAllowed = true }= allowedLanguage(language);
    console.log("Post usersQuizzesQuestions", language, quiz_score_id, data)

    if (!isAllowed) {
        return res.status(400).send('Niepoprawny język');
    }
  
    try {
      const questions = JSON.parse(data);
      const values = questions.map((q) => [
        quiz_score_id,
        q,
      ]);
  
      const query =
        `INSERT INTO users_quizzes_questions_${language.toLowerCase()}(user_quiz_score_id, quiz_question_id) VALUES ($1, $2)`;
      const results = await Promise.all(
        values.map((value) => {return pool.query(query, value)})
      );
  
      res.json({ success: true, rows: results.map((result) => result.rows) });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/usersQuizzesScores', async(req, res)=>{
    try{
        const { id } = req.query;
        const result = await pool.query('SELECT q.id, uqs.id as quiz_score_id, q.title, u.login as user, l.code as language, execution_date, q.type '
        + 'FROM quizzes q, users u, languages l, users_quizzes_scores uqs '
        + 'WHERE uqs.quiz_id=q.id AND q.user_id=u.id AND q.language_id=l.id AND uqs.user_id=$1 ORDER BY uqs.id DESC;', [id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/usersQuizzesScores', async(req, res)=>{
    const { user_id, quiz_id } = req.body;
    console.log("usersQuizzesScores ", user_id, quiz_id);
    try{
        const entityExists = await pool.query('SELECT * FROM users_quizzes_scores WHERE user_id = $1 AND quiz_id = $2', [user_id, quiz_id]);
        if(entityExists.rows.length > 0){
            return res.status(200).json({ message: "Rozpoczęto quiz" });
        }
        await pool.query(
            'INSERT INTO users_quizzes_scores(user_id, quiz_id) VALUES ($1, $2)', [user_id, quiz_id]
        );

        res.status(200).json({ message: "Rozpoczęto nowy quiz" });
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.delete('/api/usersQuizzesScores', async (req, res) => {
    try{
        const { user_id, quiz_id } = req.body;
        console.log("usersQuizzesScores delete", user_id, quiz_id);
        const result = await pool.query('DELETE FROM users_quizzes_scores WHERE user_id = $1 AND quiz_id = $2', [user_id, quiz_id]);
        res.status(200).json({message: result});
    }catch(err){
        console.log(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/stories', async(req, res)=>{
    try{
        const { quiz_id } = req.query;
        const condition = 'SELECT * '
        + 'FROM stories '
        + 'WHERE quiz_id = ' + quiz_id + ' ' 
        const result = await pool.query(quiz_id ? condition : 'SELECT * FROM stories '
        + 'ORDER BY id ASC');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/stories', async(req, res)=>{
    try{
        const { quiz_id, text } = req.body;
        await pool.query(
            'INSERT INTO stories(quiz_id, text) VALUES ($1, $2)', [quiz_id, text]
        );
        res.status(200).json({ message: "Pomyślnie dodano historię" });
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
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
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/storiesQuestionsAndAnswers', async (req, res) => {
    const { quiz_id, data } = req.body;
  
    try {
      const questions = JSON.parse(data);
  
      const results = await Promise.all(
        questions.map(async (q) => {
          const questionResult = await pool.query(
            `INSERT INTO stories_questions(quiz_id, question) VALUES ($1, $2) RETURNING id`,
            [quiz_id, q.question]
          );
          const questionId = questionResult.rows[0].id;
  
          if (q.answers && q.answers.length > 0) {
            const answerValues = q.answers.map((a) => [questionId, a.answear, a.correct]);
            const answerQuery = `INSERT INTO stories_answers(question_id, answear, correct) VALUES ($1, $2, $3)`;
            await Promise.all(answerValues.map((value) => pool.query(answerQuery, value)));
          }
  
          return { questionId, question: q.question };
        })
      );
  
      res.json({ success: true, questions: results });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(errorMessageTranslator(err.code));
    }
  });

app.post('/api/storiesQuestions', async(req, res)=>{
    const { quiz_id, data } = req.body;

    console.log(quiz_id, data)
    try {
      const questions = JSON.parse(data);
      const values = questions.map((q) => [
        quiz_id,
        q.question,
      ]);
  
      const query =
        `INSERT INTO stories_questions(quiz_id, question) VALUES ($1, $2) RETURNING id`;
      const results = await Promise.all(
        values.map((value) => {return pool.query(query, value)})
      );
  
      res.json({ success: true, rows: results.map((result) => result.rows) });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(errorMessageTranslator(err.code));
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
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.post('/api/storiesAnswers', async(req, res)=>{
    const { question_id, data } = req.body;

    console.log(question_id, data)
    try {
      const questions = JSON.parse(data);
      const values = questions.map((q) => [
        question_id,
        q.answear,
        q.correct
      ]);
  
      const query =
        `INSERT INTO stories_answers(question_id, answear, correct) VALUES ($1, $2,) RETURNING id`;
      const results = await Promise.all(
        values.map((value) => {return pool.query(query, value)})
      );
  
      res.json({ success: true, rows: results.map((result) => result.rows) });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/storiesQuestions/Count', async(req, res)=>{
    try{
        const { id } = req.query;
        const result = await pool.query('SELECT count(*) as amount_of_questions FROM stories_questions WHERE quiz_id=$1;', [id]);
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});

app.get('/api/usersStoriesQuestions', async(req, res)=>{
    const { id, userId } = req.query;
    try{
        const result = await pool.query('SELECT sq.id, sq.quiz_id, sq.question, '
        + `EXISTS (SELECT 1 FROM users_stories_questions usq, users_quizzes_scores uqs WHERE usq.story_question_id = sq.id AND uqs.quiz_id=sq.quiz_id AND uqs.user_id = ` + userId + ' AND usq.user_quiz_score_id=uqs.id) AS done '
        + 'FROM stories_questions sq WHERE sq.quiz_id = ' + id + ' ORDER BY sq.quiz_id ASC');
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send(errorMessageTranslator(err.code));
    }
});  

app.post('/api/usersStoriesQuestions', async (req, res) => {
    const { quiz_score_id, data } = req.body;
    console.log("Post usersStoriesQuestions", quiz_score_id, data)

    try {
      const questions = JSON.parse(data);
      const values = questions.map((q) => [
        quiz_score_id,
        q,
      ]);
  
      const query =
        `INSERT INTO users_stories_questions(user_quiz_score_id, story_question_id) VALUES ($1, $2)`;
      const results = await Promise.all(
        values.map((value) => {return pool.query(query, value)})
      );
  
      res.json({ success: true, rows: results.map((result) => result.rows) });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(errorMessageTranslator(err.code));
    }
});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});