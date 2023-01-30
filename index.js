// test db object:
let notes = [
    {
      "id": 1,
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "important": true
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    },
    {
      "content": "hello",
      "important": false,
      "id": 4
    },
    {
      "content": "henlo",
      "important": false,
      "id": 5
    },
    {
      "content": "lololo",
      "important": false,
      "id": 6
    },
    {
      "content": "TESTTEST",
      "important": false,
      "id": 7
    },
    {
      "content": "PRomiseStest",
      "important": true,
      "id": 8
    }
];
// ------------------------------------------------------------------



const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

const generateId = () => {
    const maxId = (notes.length > 0) 
        ? Math.max(...notes.map(note => note.id)) 
        : 0;
    return maxId + 1;
};

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

// delete note at id
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    console.log(notes);

    response.status(204).end();
});

// add note to notes
app.post('/api/notes', (request, response) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    };
    const newNote = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    };
    notes = notes.concat(newNote);
    response.json(newNote);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});