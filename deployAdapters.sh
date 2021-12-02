#!/bin/bash
export STACK_NAME=deparadepaardjes-htf2021-clueprocessing-adapters
export MY_REGION=eu-central-1
export MY_DEV_BUCKET=htf-deploymentbucket

# Package new cloudformation package
aws cloudformation package --template templates/adapters/template.yaml --s3-bucket htf-deploymentbucket --output-template export-event-source-adapters.yaml --region eu-central-1
# Deploy 
sam deploy --region eu-central-1 --template-file export-event-source-adapters.yaml --stack-name deparadepaardjes-htf2021-clueprocessing-adapters --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev