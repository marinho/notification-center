var request = require('supertest'),
    expect = require('expect.js'),
    app = require('../app');


describe('GET /healthcheck', function(){
    it('should get just WORKING sring', function(done){
        request(app).get('/healthcheck')
        .expect(200)
        .expect('WORKING', done);
    });
});


describe('GET /version', function(){
    it('should get the current version', function(done){
        request(app).get('/version')
        .expect(200)
        .expect('{"version":"0.1.0"}', done);
    });
});


describe('GET /console', function(){
    it('should get an HTML page', function(done){
        request(app).get('/console')
        .expect(200, done);
    });
});


describe('POST /ping', function(){
    it('should send a ping message', function(done){
        request(app).post('/ping')
        .expect(200)
        .expect("SENT", done);
    });
});


describe('POST /notification', function(){
    it('should reject empty notification', function(done){
        request(app).post('/notification')
        .expect("Invalid paket")
        .expect(400, done);
    });
    it('should send a valid notification message', function(done){
        request(app).post('/notification')
        .set('Content-Type', 'application/json')
        .send('{"channel": "chat", "securityToken": "VeraLeniLeticia"}')
        .expect(200)
        .expect('SENT', done);
    });
});
