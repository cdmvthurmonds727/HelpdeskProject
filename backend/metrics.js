const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'helpdesk_' });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests handled by the Helpdesk backend',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds for the Helpdesk backend',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

const ticketsCreatedTotal = new client.Counter({
  name: 'tickets_created_total',
  help: 'Total number of helpdesk tickets created'
});

const ticketsUpdatedTotal = new client.Counter({
  name: 'tickets_updated_total',
  help: 'Total number of helpdesk tickets updated'
});

const ticketsDeletedTotal = new client.Counter({
  name: 'tickets_deleted_total',
  help: 'Total number of helpdesk tickets deleted'
});

const ticketsByStatus = new client.Gauge({
  name: 'tickets_by_status',
  help: 'Current number of helpdesk tickets by status',
  labelNames: ['status']
});

const databaseQueryDurationSeconds = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Database query duration in seconds for Helpdesk backend operations',
  labelNames: ['operation'],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2]
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(ticketsCreatedTotal);
register.registerMetric(ticketsUpdatedTotal);
register.registerMetric(ticketsDeletedTotal);
register.registerMetric(ticketsByStatus);
register.registerMetric(databaseQueryDurationSeconds);

function normalizeRoute(req) {
  if (req.route && req.route.path) return req.baseUrl + req.route.path;
  return req.path || 'unknown';
}

function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') return next();
  const endTimer = httpRequestDurationSeconds.startTimer();
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: normalizeRoute(req),
      status_code: String(res.statusCode)
    };
    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });
  next();
}

async function metricsEndpoint(req, res) {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}

async function timeDbQuery(operation, queryFunction) {
  const endTimer = databaseQueryDurationSeconds.startTimer({ operation });
  try {
    return await queryFunction();
  } finally {
    endTimer();
  }
}

function updateTicketStatusMetrics(rows) {
  ticketsByStatus.reset();
  for (const row of rows) {
    ticketsByStatus.set({ status: row.status }, Number(row.count));
  }
}

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
  ticketsCreatedTotal,
  ticketsUpdatedTotal,
  ticketsDeletedTotal,
  ticketsByStatus,
  databaseQueryDurationSeconds,
  timeDbQuery,
  updateTicketStatusMetrics
};
