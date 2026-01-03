#!/bin/bash
# setup-eks.sh

echo "Usage : ./setup-eks.sh [CLUSTER_NAME] [AWS_REGION]"

# Take cluster name and region as parameters with defaults
CLUSTER_NAME=${1:-my-eks}
AWS_REGION=${2:-${AWS_REGION:-${AWS_DEFAULT_REGION}}}

# Load environment variables
if [ ! -f config.env ]; then
    echo "Error: config.env not found. Copy config.env.example and configure it."
    exit 1
fi

source config.env

echo "Cluster Name: ${CLUSTER_NAME}"
echo "Region: ${AWS_REGION}"
echo "Console User: ${CONSOLE_USER_ARN}"
echo ""

# Generate config
sed -e "s|\${CLUSTER_NAME}|${CLUSTER_NAME}|g" \
    -e "s|\${AWS_REGION}|${AWS_REGION}|g" \
    -e "s|\${CONSOLE_USER_ARN}|${CONSOLE_USER_ARN}|g" \
    eksctl-config.template.yaml > eksctl-config.yaml

echo "Generated eksctl-config.yaml"

# Create cluster
eksctl create cluster -f eksctl-config.yaml
