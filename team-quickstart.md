# Help Desk Ticket System – Full Project
A cloud-ready **Help Desk Ticket System** developed as a final project for a Docker and Kubernetes course. This project demonstrates modern full-stack application deployment using containerization, orchestration, persistent storage, and multi-node infrastructure management.
The system enables users to create, manage, update, and track support tickets through a web-based interface while showcasing best practices in DevOps and cloud-native architecture. Deployment validation and Kubernetes setup were completed on Chameleon Cloud. :contentReference[oaicite:0]{index=0}
---
## Executive Summary
This project was designed to simulate a production-ready support platform using a three-tier architecture:

- **Frontend** for user interaction  
- **Backend API** for business logic and ticket management  
- **PostgreSQL Database** for persistent data storage  

The application was containerized using Docker and deployed to a Kubernetes cluster hosted in a cloud environment.
---
## Technology Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Nginx |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Containerization | Docker / Docker Compose |
| Orchestration | Kubernetes |
| Cloud Platform | Chameleon Cloud |
| Networking | Flannel CNI |
---
## Core Features
- Create support tickets  
- View all submitted tickets  
- Filter tickets by status  
- Update ticket progress and status  
- Delete tickets  
- Backend health monitoring endpoint  
- PostgreSQL persistent storage  
- Multi-container scalable deployment  
- Kubernetes workload orchestration  
---

## System Architecture

```text
User Browser
     ↓
Frontend (React + Nginx)
     ↓
Backend API (Node.js + Express)
     ↓
PostgreSQL Database

## Project Directory Structure
HelpdeskProject/
├── backend/
├── frontend/
├── k8s/
├── docs/
├── docker-compose.yml
└── README.md

## Local Development Deployment

Start with Docker Compose
cd HelpdeskProject
cp .env.example .env
docker compose up --build

##Local Access URLs
| Service     | URL                                                                    |
| ----------- | ---------------------------------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000)                         |
| Backend API | [http://localhost:5000/api/tickets](http://localhost:5000/api/tickets) |

##Kubernetes Deployment

Step 1 – Create Namespace
kubectl apply -f k8s/namespace.yaml
Step 2 – Deploy Database Resources
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-configmap.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
Step 3 – Deploy Application Resources
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

##Kubernetes Services
| Service    | Type                 | Port |
| ---------- | -------------------- | ---- |
| Frontend   | NodePort / ClusterIP | 80   |
| Backend    | ClusterIP            | 5000 |
| PostgreSQL | ClusterIP            | 5432 |


##Production Deployment Validation
The application was successfully deployed to a two-node Kubernetes cluster consisting of:
	1 Control Plane Node
	1 Worker Node

##Validated components:
	Frontend replicas healthy
	Backend replicas healthy
	PostgreSQL persistent storage operational
	Pod networking functional
	Browser access confirmed

##Accessing the Application
Browser Access via NodePort
	http://<worker-node-ip>:32507
Secure Access via SSH Tunnel (Recommended)
	ssh -i groupfinalproject.pem -L 8080:10.56.2.164:32507 cc@129.114.26.177
Then open:
	http://localhost:8080

##Cloud Deployment Notes
For VM or bare-metal environments:
	Use NodePort for simple service exposure
	Use Ingress Controller for advanced routing
	Open firewall/security group ports as required
	Use versioned Docker image tags instead of latest for production

##Demonstration Workflow
	Launch locally using Docker Compose
	Build Docker images
	Push images to Docker Hub
	Update Kubernetes manifests
	Deploy to Kubernetes cluster
	Access frontend in browser
	Demonstrate ticket lifecycle management

##Future Enhancements
	JWT Authentication
	Role-Based Access Control
	Technician/Admin dashboards
	File attachments
	Email notifications
	Monitoring with Prometheus & Grafana
	CI/CD pipelines with GitHub Actions
	HTTPS / TLS certificates
	Horizontal Pod Autoscaling

##Accessing the Application
Browser Access via NodePort
 http://<worker-node-ip>:32507
Secure Access via SSH Tunnel
 ssh -i groupfinalproject.pem -L 8080:10.56.2.164:32507 cc@129.114.26.177
Then open:
 http://localhost:8080

##Operations Commands
Check Cluster Resources
	kubectl get deploy,po,svckubectl get nodes -o widekubectl get all
View Logs
	kubectl logs <pod-name>
Troubleshooting
	kubectl describe pod <pod-name>

Contributors
	DeLuca M Thurmond
	GitHub: @cdmvthurmonds727
	Team Member:
	GitHub:
	Team Member:
	GitHub:

##Final Outcome
	This project successfully demonstrates the end-to-end deployment of a modern cloud-native application using Kubernetes, Docker, persistent storage, and multi-node orchestration.

##Final Running State
 Frontend: 2/2 Running
 Backend: 2/2 Running
 PostgreSQL: 1/1 Running

The application is fully operational and accessible through browser-based connectivity.


