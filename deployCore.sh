#!/bin/bash
export STACK_NAME=deparadepaardjes-htf2021-clueprocessing-core
export MY_REGION=eu-central-1
export MY_DEV_BUCKET=htf-deploymentbucket

# Package new cloudformation package
aws cloudformation package --template templates/core/template.yaml --s3-bucket htf-deploymentbucket --output-template export-clue-processing-service.yaml --region eu-central-1
# Deploy 
sam deploy --region eu-central-1 --template-file export-clue-processing-service.yaml --stack-name deparadepaardjes-htf2021-clueprocessing-core --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev