# Kubernetes Demo API

A containerized Node.js/Express API deployed to a local Kubernetes cluster (minikube), demonstrating a complete Docker → Kubernetes deployment workflow, from image build through pod orchestration and service exposure.

## Overview

This project is a hands-on implementation of a real-world DevOps deployment pipeline. It takes a simple Express API, containerizes it with Docker, pushes the image to Docker Hub, and deploys it to Kubernetes with health checks, resource limits, and multiple replicas for availability.

## Tech Stack

- **Node.js / Express** — application server
- **Docker** — containerization
- **Kubernetes (minikube)** — container orchestration
- **Docker Hub** — image registry
- **Bash** — deployment automation

## Architecture

```
Source Code (index.js)
        │
        ▼
   Dockerfile  →  Docker Image
        │
        ▼
   Docker Hub  (image registry)
        │
        ▼
 Kubernetes Deployment (2 replicas)
        │
        ▼
 Kubernetes Service (NodePort)
        │
        ▼
  Exposed to network traffic
```

## Features

- **Non-root container user** — the Docker image runs as a dedicated unprivileged user rather than root, reducing the security blast radius if the application is ever compromised.
- **Readiness and liveness probes** — `/readyz` and `/healthz` endpoints let Kubernetes know when a pod is ready to receive traffic and whether it's still alive, enabling automatic restarts on failure.
- **Resource requests and limits** — each pod is constrained to defined CPU and memory boundaries, preventing a single container from starving the rest of the cluster.
- **Horizontal redundancy** — the deployment runs 2 replica pods behind a single Service, so traffic continues to be served if one pod fails.
- **One-command deployment** — a single bash script handles building, pushing, and deploying, mirroring how real CI/CD pipelines operate.

## Project Structure

```
.
├── index.js              # Express application with health check endpoints
├── Dockerfile             # Multi-step image build with non-root user
├── deploy.sh               # Automated build → push → deploy pipeline
├── docker-compose.yaml      # Local development with volume mounting
├── package.json
└── k8s/
    ├── deployment.yaml       # Pod spec, probes, resource limits
    └── service.yaml          # NodePort service exposing the app
```

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Returns a JSON payload identifying the responding pod and timestamp |
| `GET /readyz` | Readiness probe — confirms the app is ready to serve traffic |
| `GET /healthz` | Liveness probe — confirms the app is still running |

## Running Locally

### Prerequisites
- Docker Desktop
- minikube
- kubectl

### Steps

```bash
# start the local cluster
minikube start

# build, push, and deploy in one command
npm run deploy

# watch the pods come online
kubectl get pods -w

# check the running service
kubectl get services
```

The deploy script (`deploy.sh`) builds the Docker image, pushes it to Docker Hub, and applies the Kubernetes manifests — replicating the build-and-release stage of a CI/CD pipeline.

## What I Learned

Building this project involved working through several real deployment issues, including:

- Diagnosing `CrashLoopBackOff` pods by reading container logs and tracing the failure back to a stale image reference
- Fixing label/selector mismatches between a Kubernetes Service and Deployment that silently prevented traffic routing
- Resolving file-permission errors inside a non-root Docker container caused by build step ordering
- Recovering a corrupted minikube cluster by fully tearing down and recreating it
- Keeping image names, service names, and deployment scripts consistent across a multi-file project

## License

ISC
