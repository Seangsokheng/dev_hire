import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Jobs Controller (e2e) - Caching', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Must import your root AppModule
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/jobs GET - Should cache results', async () => {
    // First request
    const firstResponse = await request(app.getHttpServer())
      .get('/jobs')
      .expect(HttpStatus.OK);
    expect(firstResponse.body).toHaveProperty('data');
    expect(firstResponse.body).toHaveProperty('total');

    // Second request
    const secondResponse = await request(app.getHttpServer())
      .get('/jobs')
      .expect(HttpStatus.OK);
    expect(secondResponse.body).toHaveProperty('data');
    expect(secondResponse.body.data).toEqual(firstResponse.body.data);
  });

  afterAll(async () => {
    await app.close();
  });
});
