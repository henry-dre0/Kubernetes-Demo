#!/usr/bin/env bash

# set -e means: if ANY command in this script fails (returns a non-zero exit code),
# stop the script immediately instead of continuing on to the next line.
# This prevents a failed build from accidentally still trying to deploy broken code.
set -e

NAME="kubernetes-demo-api"          # the base name of your app/image
USERNAME="henrydre"                 # your Docker Hub username — needed so others (and Kubernetes) can pull this image
IMAGE="$USERNAME/$NAME:latest"      # combines them into the full image tag Docker Hub expects:
                                    # e.g. henrydre/kubernetese-demo-api:latest

echo "Building Docker image..."
# Builds a Docker image from the Dockerfile in the current directory (the "." at the end)
# tags it with the full name stored in $IMAGE
docker build -t $IMAGE .

echo "Pushing image to Docker Hub..."
# Uploads that built image to Docker Hub (a public/private image registry)
# This makes the image available to be pulled from ANYWHERE — including inside
# a real Kubernetes cluster in the cloud, not just your local minikube
docker push $IMAGE

echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

echo "Getting pods..."
kubectl get pods

echo "Getting services..."
kubectl get services

echo "Fetching the main service"
# NOTE: this only works if your service name matches "$NAME-service" exactly
kubectl get services $NAME-service