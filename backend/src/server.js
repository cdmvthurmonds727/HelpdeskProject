const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status
      ? {
          text: 'SELECT * FROM tickets WHERE status = $1 ORDER BY created_at DESC',
          values: [status]
        }
      : {
          text: 'SELECT * FROM tickets ORDER BY created_at DESC',
          values: []
        };

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets', details: error.message });
  }
});

app.get('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket', details: error.message });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const {
      title,
      description,
      priority = 'Medium',
      status = 'Open',
      requester,
      assigned_to = ''
    } = req.body;

    if (!title || !description || !requester) {
      return res.status(400).json({ error: 'title, description, and requester are required' });
    }

    const result = await pool.query(
      `INSERT INTO tickets (title, description, priority, status, requester, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, priority, status, requester, assigned_to]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket', details: error.message });
  }
});

app.put('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, requester, assigned_to } = req.body;

    const result = await pool.query(
      `UPDATE tickets
       SET title = $1,
           description = $2,
           priority = $3,
           status = $4,
           requester = $5,
           assigned_to = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, priority, status, requester, assigned_to, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket', details: error.message });
  }
});

app.patch('/api/tickets/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const result = await pool.query(
      `UPDATE tickets
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket status', details: error.message });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully', ticket: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on port ${port}`);
});
