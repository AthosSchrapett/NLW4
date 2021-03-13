import { Connection, getConnection } from 'typeorm';
import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe("Survey", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });

    it('Should be able to create a new survey', async () => {
        const response = await request(app).post('/surveys').send({
            title: 'Title exemple',
            description: 'Description exemple'
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('Sould be able to get all surveys', async () => {
        await request(app).post('/surveys').send({
            title: 'Title exemple2',
            description: 'Description exemple2'
        });

        const response = await request(app).get('/surveys');

        expect(response.body.length).toBe(2);
    });
});