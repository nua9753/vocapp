const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const WORDS_FILE = path.join(__dirname, 'global-words.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// GET all words
app.get('/api/words', (req, res) => {
  try {
    const data = fs.readFileSync(WORDS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.json({ words: [], lastUpdated: new Date().toISOString() });
  }
});

// POST new word
app.post('/api/words', (req, res) => {
  try {
    const newWord = req.body;

    if (!newWord.en || !newWord.fa) {
      return res.status(400).json({ error: 'انگلیسی و فارسی لازم است' });
    }

    let data = { words: [], lastUpdated: new Date().toISOString() };
    if (fs.existsSync(WORDS_FILE)) {
      data = JSON.parse(fs.readFileSync(WORDS_FILE, 'utf8'));
    }

    // Check if word exists
    if (data.words.find(w => w.en.toLowerCase() === newWord.en.toLowerCase())) {
      return res.status(400).json({ error: 'این کلمه قبلاً وجود دارد' });
    }

    // Add new word
    newWord.date = newWord.date || new Date().toISOString().split('T')[0];
    newWord.submittedBy = newWord.submittedBy || 'user';
    data.words.unshift(newWord);
    data.lastUpdated = new Date().toISOString();

    // Save to file
    fs.writeFileSync(WORDS_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, message: 'کلمه اضافه شد', word: newWord });
  } catch (err) {
    res.status(500).json({ error: 'خطا: ' + err.message });
  }
});

// DELETE word
app.delete('/api/words/:en', (req, res) => {
  try {
    const en = decodeURIComponent(req.params.en);
    let data = JSON.parse(fs.readFileSync(WORDS_FILE, 'utf8'));

    data.words = data.words.filter(w => w.en.toLowerCase() !== en.toLowerCase());
    data.lastUpdated = new Date().toISOString();

    fs.writeFileSync(WORDS_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'کلمه حذف شد' });
  } catch (err) {
    res.status(500).json({ error: 'خطا: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
