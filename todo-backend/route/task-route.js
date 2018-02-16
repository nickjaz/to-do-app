'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('todo:task-route');
const createError = require('http-errors');
const Task = require('../model/task.js');
const taskRouter = module.exports = new Router();

taskRouter.post('/api/task', jsonParser, function(req, res, next) {
  debug('POST: /api/task');

  new Task(req.body).save()
  .then( task => res.json(task))
  .catch( err => next(createError(400, err.message)));
});

taskRouter.get('/api/task/:id', function(req, res, next) {
  debug('GET: /api/task/:id');

  Task.findById(req.params.id)
  .then( task => res.json(task))
  .catch( err => next(createError(404, err.message)));
});

taskRouter.put('/api/task/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/task/:id');

  if(Object.keys(req.body).length === 0) {
    return next(createError(400, 'BadRequestError'));
  }

  Task.findByIdAndUpdate(req.params.id, req.body, { 'new': true })
  .then( task => res.json(task))
  .catch( err => next(createError(404, err.message)));
});

taskRouter.delete('/api/task/:id', function(req, res, next) {
  debug('DELETE: /api/task/:id');

  Task.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
