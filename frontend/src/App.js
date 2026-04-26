import React, { useEffect, useMemo, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GRAFANA_URL = process.env.REACT_APP_GRAFANA_URL || 'http://129.114.26.191:32000/d/adc48tx/help-desk-system-e28093-operations-dashboard?orgId=1&from=now-24h&to=now&timezone=browser'
const defaultForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Open',
  requester: '',
  assigned_to: ''
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint = filter === 'All'
        ? `${API_URL}/api/tickets`
        : `${API_URL}/api/tickets?status=${encodeURIComponent(filter)}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to load tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'Open').length;
    const progress = tickets.filter((t) => t.status === 'In Progress').length;
    const closed = tickets.filter((t) => t.status === 'Closed').length;
    return { total: tickets.length, open, progress, closed };
  }, [tickets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to create ticket');
      }
      setForm(defaultForm);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTicket = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete ticket');
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Cloud Project</p>
          <h1>Group12 Help Desk Ticket System</h1>
	  #   <p className="subtext">
	  #   A containerized React + Node + PostgreSQL application ready for Docker and Kubernetes deployment.
	  #</p>
 
          <a
            href={GRAFANA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="grafana-link"
          >
            📊 Open Grafana Dashboard
          </a>
        </div>

       <button className="refresh-btn" onClick={fetchTickets}>
         Refresh Tickets
       </button>
     </header>
      <section className="stats-grid">
        <div className="stat-card"><span>Total</span><strong>{stats.total}</strong></div>
        <div className="stat-card"><span>Open</span><strong>{stats.open}</strong></div>
        <div className="stat-card"><span>In Progress</span><strong>{stats.progress}</strong></div>
        <div className="stat-card"><span>Closed</span><strong>{stats.closed}</strong></div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <main className="main-grid">
        <section className="panel">
          <h2>Create Ticket</h2>
          <form onSubmit={handleSubmit} className="ticket-form">
            <input name="title" placeholder="Ticket title" value={form.title} onChange={handleChange} required />
            <textarea name="description" placeholder="Describe the problem" value={form.description} onChange={handleChange} required rows="5" />
            <input name="requester" placeholder="Requester name" value={form.requester} onChange={handleChange} required />
            <input name="assigned_to" placeholder="Assigned team or technician" value={form.assigned_to} onChange={handleChange} />
            <div className="form-row">
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
            </div>
            <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Create Ticket'}</button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Ticket Queue</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          {loading ? (
            <p>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
            <div className="ticket-list">
              {tickets.map((ticket) => (
                <article className="ticket-card" key={ticket.id}>
                  <div className="ticket-top">
                    <div>
                      <h3>{ticket.title}</h3>
                      <p>{ticket.description}</p>
                    </div>
                    <span className={`badge priority-${ticket.priority.toLowerCase().replace(' ', '-')}`}>{ticket.priority}</span>
                  </div>
                  <div className="ticket-meta">
                    <span><strong>Status:</strong> {ticket.status}</span>
                    <span><strong>Requester:</strong> {ticket.requester}</span>
                    <span><strong>Assigned:</strong> {ticket.assigned_to || 'Unassigned'}</span>
                  </div>
                  <div className="ticket-actions">
                    <button onClick={() => updateStatus(ticket.id, 'Open')}>Open</button>
                    <button onClick={() => updateStatus(ticket.id, 'In Progress')}>In Progress</button>
                    <button onClick={() => updateStatus(ticket.id, 'Closed')}>Closed</button>
                    <button className="danger" onClick={() => deleteTicket(ticket.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
