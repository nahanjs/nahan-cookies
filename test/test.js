'use strict';
const http = require('http');
const request = require('supertest');
const assert = require('assert');
const { Pipeline } = require('nahan-onion');
const Cookies = require('..');

describe('Cookies', () => {

    const app =
        Pipeline(
            async (ctx, next) => {
                await next();

                ctx.cookies.set('key1', 'val1');
                ctx.cookies.set('key2', 'val2');

                ctx.res.end('123');
            },
            Cookies()
        );
    const server = http.createServer((req, res) => app({ req, res }));
    const agent = request.agent(server);

    it('test', function (done) {
        agent
            .get('/')
            .expect(function (res) {
                assert.deepEqual(res.headers['set-cookie'], ['key1=val1', 'key2=val2']);
            })
            .end(done);
    });
});
