# Help Desk Ticket System - Full Project

A complete cloud-ready Help Desk Ticket System built for a Docker + Kubernetes course project.

## Stack
- Frontend: React + Nginx
- Backend: Node.js + Express
- Database: PostgreSQL
- Containers: Docker / Docker Compose
- Orchestration: Kubernetes manifests

## Features
- Create tickets
- View all tickets
- Filter tickets by status
- Update ticket status
- Delete tickets
- Health endpoint for backend
- PostgreSQL persistent storage in Kubernetes

## Project Structure
```text
helpdesk-full-project/
├── backend/
├── frontend/
├── k8s/
├── docs/
├── docker-compose.yml
└── README.md
```

## Local Run with Docker Compose
```bash
cd helpdesk-full-project
cp .env.example .env
docker compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/tickets

## Environment Variables
Create `.env` from `.env.example`.

## Kubernetes Deploy
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-configmap.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

## Default Kubernetes Services
- Frontend Service: ClusterIP on port 80
- Backend Service: ClusterIP on port 5000
- Postgres Service: ClusterIP on port 5432

## Notes for Chameleon Cloud / VM Cluster
- Install an ingress controller such as NGINX ingress if using the provided ingress manifest.
- For bare-metal access, change the frontend and backend services to `NodePort` if needed.
- For production, use image registry tags instead of `:latest`.

## Suggested Demo Flow
1. Show Docker Compose working locally.
2. Build Docker images.
3. Push images to Docker Hub or GitHub Container Registry.
4. Update Kubernetes manifests with your image names.
5. Deploy to Kubernetes cluster.
6. Create and update tickets live in the demo.

## Future Enhancements
- Authentication with JWT
- Role-based access (user/admin/technician)
- File attachments
- Email notifications
- Metrics with Prometheus/Grafana
- CI/CD with GitLab or GitHub Actions
