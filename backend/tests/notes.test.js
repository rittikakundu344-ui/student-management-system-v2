import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import Subject from '../../models/Subject.js';
import Note from '../../models/Note.js';
import jwt from 'jsonwebtoken';

let testToken;
let testUserId;
let testSubjectId;

beforeAll(async () => {
  // Create a test user and get token
  const user = await User.create({
    username: 'noteuser',
    email: 'notes@example.com',
    password: 'password123',
  });

  testUserId = user._id;
  testToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '7d' }
  );

  // Create a test subject
  const subject = await Subject.create({
    userId: testUserId,
    name: 'Test Subject',
    color: '#007bff',
  });

  testSubjectId = subject._id;
});

afterAll(async () => {
  // Clean up
  await User.deleteMany({});
  await Subject.deleteMany({});
  await Note.deleteMany({});
});

describe('Notes Controller', () => {
  describe('Create Note', () => {
    it('should create a new note', async () => {
      const res = await request(app)
        .post('/notes')
        .set('Cookie', `token=${testToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note',
          subjectId: testSubjectId.toString(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.note.title).toBe('Test Note');
    });

    it('should fail if title is missing', async () => {
      const res = await request(app)
        .post('/notes')
        .set('Cookie', `token=${testToken}`)
        .send({
          content: 'No title',
          subjectId: testSubjectId.toString(),
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('Get Notes', () => {
    beforeEach(async () => {
      await Note.create({
        userId: testUserId,
        subjectId: testSubjectId,
        title: 'Note 1',
        content: 'Content 1',
      });
      await Note.create({
        userId: testUserId,
        subjectId: testSubjectId,
        title: 'Note 2',
        content: 'Content 2',
        isPinned: true,
      });
    });

    afterEach(async () => {
      await Note.deleteMany({});
    });

    it('should get all user notes', async () => {
      const res = await request(app)
        .get('/notes')
        .set('Cookie', `token=${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter pinned notes only', async () => {
      const res = await request(app)
        .get('/notes?pinned=true')
        .set('Cookie', `token=${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.every(note => note.isPinned)).toBe(true);
    });
  });

  describe('Toggle Pin', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        userId: testUserId,
        subjectId: testSubjectId,
        title: 'Pin Test Note',
        content: 'Content',
      });
      noteId = note._id;
    });

    afterEach(async () => {
      await Note.deleteMany({});
    });

    it('should toggle note pin status', async () => {
      const res = await request(app)
        .patch(`/notes/${noteId}/pin`)
        .set('Cookie', `token=${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.note.isPinned).toBe(true);
    });
  });

  describe('Toggle Favorite', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        userId: testUserId,
        subjectId: testSubjectId,
        title: 'Favorite Test Note',
        content: 'Content',
      });
      noteId = note._id;
    });

    afterEach(async () => {
      await Note.deleteMany({});
    });

    it('should toggle note favorite status', async () => {
      const res = await request(app)
        .patch(`/notes/${noteId}/favorite`)
        .set('Cookie', `token=${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.note.isFavorite).toBe(true);
    });
  });

  describe('Delete Note', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        userId: testUserId,
        subjectId: testSubjectId,
        title: 'Delete Test Note',
        content: 'Content',
      });
      noteId = note._id;
    });

    it('should delete a note', async () => {
      const res = await request(app)
        .delete(`/notes/${noteId}`)
        .set('Cookie', `token=${testToken}`);

      expect(res.statusCode).toBe(200);

      // Verify note is deleted
      const deletedNote = await Note.findById(noteId);
      expect(deletedNote).toBeNull();
    });

    it('should fail to delete non-existent note', async () => {
      const res = await request(app)
        .delete(`/notes/507f1f77bcf86cd799439999`)
        .set('Cookie', `token=${testToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
