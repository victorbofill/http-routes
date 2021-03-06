const chai = require('chai');
const chaiHttp = require('chai-http');
const client = require('../lib/db-client');
const app = require('../lib/app');

const { assert } = chai;
chai.use(chaiHttp);

describe('Friends Tests', () => {
    before(() => client.query('DELETE FROM friends'));

    let austin = {
        name: 'Austin',
        role: 'Literally everything good about us.'
    };

    let kasey = {
        name: 'Kasey',
        role: 'Setting a low bar for the rest of us.'
    };

    before(() => {
        return chai.request(app)
            .post('/friends')
            .send(austin)
            .then(({ body }) => {
                assert.equal(body.name, austin.name);
                assert.equal(body.role, austin.role);
                austin = body;
            });
    });

    it('Saves a friend', () => {
        assert.ok(austin.id);
    });

    it('Retrieve friend by id', () => {
        return chai.request(app)
            .get(`/friends/${austin.id}`)
            .then(({ body }) => {
                assert.deepEqual(body, austin);
            });
    });

    it('Updates a friend', () => {
        austin.role = 'Better than Jesus';
        return chai.request(app)
            .put(`/friends/${austin.id}`)
            .send(austin)
            .then(({ body }) => {
                assert.deepEqual(body, austin);
            });
    });

    it('Retrieves all friends', () => {
        return chai.request(app)
            .post(`/friends`)
            .send(kasey)
            .then(({ body }) => {
                kasey = body;
                return chai.request(app)
                    .get('/friends');
            })
            .then(({ body }) => {
                assert.deepEqual(body, [austin, kasey]);
            });
    });

    it('Deletes a friend', () => {
        return chai.request(app)
            .del(`/friends/${kasey.id}`)
            .then(() => {
                return chai.request(app)
                    .get('/friends');
            })
            .then(({ body }) => {
                assert.deepEqual(body, [austin]);
            });
    });

    it('Handles bad requests with 404', () => {
        return chai.request(app)
            .get('/bad')
            .then((res) => {
                assert.equal(res.status, 404);
            });
    });

    after(() => {
        client.end();
    });
});