// Example Express integration. Merge this into your existing backend app.js/server.js.
const express = require('express');
const {
  metricsMiddleware,
  metricsEndpoint,
  ticketsCreatedTotal,
  ticketsUpdatedTotal,
  ticketsDeletedTotal,
  timeDbQuery,
  updateTicketStatusMetrics
} = require('./metrics');

const app = express();
app.use(express.json());
app.use(metricsMiddleware);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'helpdesk-backend' });
});

app.get('/metrics', metricsEndpoint);

// Example route patterns. Keep your existing SQL/db logic and add the metric lines.
app.post('/api/tickets', async (req, res) => {
  // const result = await timeDbQuery('create_ticket', () => pool.query(...));
  ticketsCreatedTotal.inc();
  res.status(201).json({ message: 'ticket created' });
});

app.put('/api/tickets/:id', async (req, res) => {
  // const result = await timeDbQuery('update_ticket', () => pool.query(...));
  ticketsUpdatedTotal.inc();
  res.json({ message: 'ticket updated' });
});

app.delete('/api/tickets/:id', async (req, res) => {
  // const result = await timeDbQuery('delete_ticket', () => pool.query(...));
  ticketsDeletedTotal.inc();
  res.json({ message: 'ticket deleted' });
});

// Call this after ticket create/update/delete or on a timer.
async function refreshTicketStatusMetrics(pool) {
  const result = await timeDbQuery('ticket_status_counts', () =>
    pool.query('SELECT status, COUNT(*)::int AS count FROM tickets GROUP BY status')
  );
  updateTicketStatusMetrics(result.rows);
}

module.exports = app;
