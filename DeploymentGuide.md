Helpdesk Kubernetes Deployment Guide

##Prerequisites
Chameleon Cloud project with 2 Ubuntu nodes
One node = control-plane
One node = worker
SSH key access
Docker Hub images:
cdmvthurmonds727/helpdesk-frontend:latest
cdmvthurmonds727/helpdesk-backend:latest
Cluster Setup
Control Node

Install:

sudo apt update
sudo apt install -y docker.io containerd kubeadm kubelet kubectl

Initialize cluster:

sudo kubeadm init --config kubeadm-config.yaml --ignore-preflight-errors=SystemVerification

Configure kubectl:

mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

Install Flannel:

kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
Worker Node

Join cluster:

sudo kubeadm join <CONTROL-IP>:6443 --token <TOKEN> \
--discovery-token-ca-cert-hash sha256:<HASH> \
--ignore-preflight-errors=SystemVerification
Deploy Application

Clone repo:

git clone https://github.com/<your-repo>.git
cd HelpdeskProject/k8s

Create namespace:

kubectl create namespace helpdesk
kubectl config set-context --current --namespace=helpdesk

Apply manifests:

kubectl apply -f .
PostgreSQL Storage

Create PV/PVC:

kubectl apply -f postgres-pv.yaml
kubectl apply -f postgres-pvc.yaml
Verify Deployment
kubectl get nodes
kubectl get deploy,po,svc

Expected:

frontend = 2/2
backend = 2/2
postgres = 1/1
Access Application
NodePort

Frontend exposed on:

http://<worker-node-ip>:32507
SSH Tunnel (Recommended)

From Windows:

ssh -i "groupfinalproject.pem" -L 8080:10.56.2.164:32507 cc@129.114.26.177

Then open:

http://localhost:8080
