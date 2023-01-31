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


const cors = require('cors');
const express = require('express');
const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('--------------------');
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);

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
    response.status(200).send(request.params.id);
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

// edit note
app.put('/api/notes/:id', (request, response) => {
  const newNoteData = request.body;
  const id = Number(request.params.id);
  notes = notes.map(note => 
    (note.id === id) ? newNoteData : note
  );
  response.json(newNoteData);
});



//############# run server #############

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});