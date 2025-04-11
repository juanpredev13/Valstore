import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userdb'; // ← Cambiar si es otro microservicio
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('users'); // ← Nombre plural de la colección

    await collection.deleteMany({});
    await collection.insertMany([
      { id: crypto.randomUUID(), name: 'User 1', email: 'user1@example.com' },
      { id: crypto.randomUUID(), name: 'User 2', email: 'user2@example.com' }
    ]);

    console.log('✅ Seed completed');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await client.close();
  }
}

seed();
