# Architecture Overview

## Components
- React frontend for ticket submission and management
- Express API for business logic and CRUD operations
- PostgreSQL database for persistent ticket storage
- Kubernetes for orchestration and scaling

## Request Flow
1. User accesses frontend in browser.
2. Frontend sends API requests to backend.
3. Backend reads/writes ticket data to PostgreSQL.
4. Kubernetes manages pods, services, storage, and networking.

## Kubernetes Objects
- Namespace isolates the project resources.
- Secret stores database password.
- ConfigMap stores non-secret DB values.
- PVC persists PostgreSQL data.
- Deployments manage frontend, backend, and database pods.
- Services provide stable networking.
- Ingress exposes the app externally.
