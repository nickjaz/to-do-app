'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Task = require('../model/task.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleTask = {
  title: 'test task',
  description: 'this is my test task'
};

describe('Task Routes', function() {
  afterEach( done => {
    Task.remove({})
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/task', function() {
    describe('with a valid request body', function() {
      it('should return the posted task', done => {
        request.post(`${url}/api/task`)
        .send(exampleTask)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('test task');
          expect(res.body.description).to.equal('this is my test task');
          expect(res.body.complete).to.equal(false);
          expect(res.body.alert).to.equal(false);
          expect(res.body.priority).to.equal(false);
          done();
        });
      });
    });

    describe('with an invalid request body', function() {
      it('should return 400 status: bad request', done => {
        request.post(`${url}/api/task`)
        .send({ name: 'test task' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
  });

  describe('GET: /api/task/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        Task.create(exampleTask)
        .then( task => {
          this.tempTask = task;
          done();
        })
        .catch(done);
      });

      it('should return a previously posted task', done => {
        request.get(`${url}/api/task/${this.tempTask._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('test task');
          expect(res.body.description).to.equal('this is my test task');
          expect(res.body.complete).to.equal(false);
          expect(res.body.alert).to.equal(false);
          expect(res.body.priority).to.equal(false);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      it('should return 404 status: not found', done => {
        request.get(`${url}/api/task/1234567890`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('PUT: /api/task/:id', function() {
    describe('with a valid id and request body', function() {
      before( done => {
        Task.create(exampleTask)
        .then( task => {
          this.tempTask = task;
          done();
        });
      });

      it('should return an updated task', done => {
        request.put(`${url}/api/task/${this.tempTask._id}`)
        .send({ title: 'new title', description: 'this is my updated description'})
        .end((err, res) => {
          if(err) return done(err);
          console.log('response body', res.body);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('new title');
          expect(res.body.description).to.equal('this is my updated description');
          expect(res.body.complete).to.equal(false);
          expect(res.body.alert).to.equal(false);
          expect(res.body.priority).to.equal(false);
          done();
        });
      });
    });

    describe('with a valid id but invalid request body', function() {
      before( done => {
        Task.create(exampleTask)
        .then( task => {
          this.tempTask = task;
          done();
        });
      });

      it('should return 400 status: bad request', done => {
        request.put(`${url}/api/task/${this.tempTask._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });

    describe('with an invalid id but valid body', function() {
      it('should return 404 status: not found', done => {
        request.put(`${url}/api/task/1234567890`)
        .send({ title: 'new title', description: 'this is my updated description'})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('DELETE: /api/task/:id', function() {
    describe('with valid id', function() {
      before( done => {
        Task.create(exampleTask)
        .then( task => {
          this.tempTask = task;
          done();
        })
        .catch(done);
      });

      it('should return a 204 status: removed', done => {
        request.delete(`${url}/api/task/${this.tempTask._id}`)
        .end((err, res) => {
          if(err) return done(err);
          console.log('response text', res.text);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      before( done => {
        Task.create(exampleTask)
        .then( task => {
          this.tempTask = task;
          done();
        });
      });

      it('should return 404 status: not found', done => {
        request.delete(`${url}/api/task/1234567890`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });
});
