# Kubernetes Notes

## Important
Before deploying, update these image names:
- `your-dockerhub-username/helpdesk-backend:latest`
- `your-dockerhub-username/helpdesk-frontend:latest`

## Build and Push
```bash
docker build -t your-dockerhub-username/helpdesk-backend:latest ./backend
docker build -t your-dockerhub-username/helpdesk-frontend:latest ./frontend
docker push your-dockerhub-username/helpdesk-backend:latest
docker push your-dockerhub-username/helpdesk-frontend:latest
```

## Apply
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-configmap.yaml
kubectl apply -f k8s/postgres-init-configmap.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

## Verify
```bash
kubectl get all -n helpdesk
kubectl get ingress -n helpdesk
kubectl logs deployment/backend -n helpdesk
kubectl logs deployment/frontend -n helpdesk
kubectl logs deployment/postgres -n helpdesk
```
