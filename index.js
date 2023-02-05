require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

const Note = require('./models/note');

//-------------------------------------------------------------------

// get all notes
app.get('/api/notes', (request, response) => {
  Note
    .find({})
    .then(result => response.json(result));
});

// get note at id
app.get('/api/notes/:id', (request, response, next) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      };
    })
    .catch(error => next(error));
});

// delete note at id
app.delete('/api/notes/:id', (request, response, next) => {
    Note
      .findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(200).send(request.params.id)
      })
      .catch(error => next(error));
});

// add note to notes
app.post('/api/notes', (request, response, next) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    };
    const note = new Note({
        content: body.content,
        important: body.important || false,
    });
    note
      .save()
      .then(savedNote => response.json(savedNote))
      .catch(error => next(error));
});

// edit note
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;
  const updatedNote = { content, important };
  Note
    .findByIdAndUpdate(
      request.params.id, 
      updatedNote, 
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => response.json(updatedNote))
    .catch(error => next(error));
});

//-------------------------------------------------------------------

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);


const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  };
  next(error);
};
app.use(errorHandler);


//############# run server #############

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});