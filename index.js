const { notes } = require('./db.json');

const express = require('express');
const app = express();
const PORT = 3003;

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
});

// get all notes
app.get('/api/notes', (request, response) => {
    response.json(notes);
});

// get note at id
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    };
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});