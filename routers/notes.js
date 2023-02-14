const jwt = require('jsonwebtoken');
const notesRouter = require('express').Router();
const config = require('../utils/config');
const Note = require('../models/Note');
const User = require('../models/User');


const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    };
    return null;
};


notesRouter.get('/', (request, response) => {
    Note
        .find({})
        .populate('user')
        .then(result => response.json(result));
});

notesRouter.get('/:id', (request, response, next) => {
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
  
notesRouter.delete('/:id', (request, response, next) => {
    Note
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(200).send(request.params.id)
        })
        .catch(error => next(error));
});
  
notesRouter.post('/', (request, response, next) => {
    const decodedToken = jwt.verify(getTokenFrom(request), config.JWT_SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    };
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    };
    User
        .findById(decodedToken.id)
        .then(user => {
            const note = new Note({
                content: body.content,
                important: body.important || false,
                user: user._id
            });
            note
                .save()
                .then(savedNote => {
                    user.notes = user.notes.concat(savedNote._id);
                    user.save().then(() => response.json(savedNote));
                })
                .catch(error => next(error));
        })
        .catch(error => next(error));
});
  
notesRouter.put('/:id', (request, response, next) => {
    const { content, important } = request.body;
    const updatedNote = { content, important };
    Note
        .findByIdAndUpdate(
            request.params.id, 
            updatedNote, 
            { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => response.json(updatedNote))
        .catch(error => next(error));
});

module.exports = notesRouter;