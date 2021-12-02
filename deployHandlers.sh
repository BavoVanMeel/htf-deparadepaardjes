#!/bin/bash
export STACK_NAME=deparadepaardjes-htf2021-clueprocessing-handlers
export MY_REGION=eu-central-1
export MY_DEV_BUCKET=htf-deploymentbucket

# Package new cloudformation package
aws cloudformation package --template templates/handlers/template.yaml --s3-bucket htf-deploymentbucket --output-template export-notification-channel-handlers.yaml --region eu-central-1
# Deploy 
sam deploy --region eu-central-1 --template-file export-notification-channel-handlers.yaml --stack-name deparadepaardjes-htf2021-clueprocessing-handlers --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev

# Package new cloudformation package
aws cloudformation package --template templates/handlers/template2.yaml --s3-bucket htf-deploymentbucket --output-template export-notification-channel-handlers2.yaml --region eu-central-1
# Deploy 
sam deploy --region eu-central-1 --template-file export-notification-channel-handlers2.yaml --stack-name deparadepaardjes-htf2021-clueprocessing-handlers2 --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev

# Package new cloudformation package
aws cloudformation package --template templates/handlers/template3.yaml --s3-bucket htf-deploymentbucket --output-template export-notification-channel-handlers3.yaml --region eu-central-1
# Deploy 
sam deploy --region eu-central-1 --template-file export-notification-channel-handlers3.yaml --stack-name deparadepaardjes-htf2021-clueprocessing-handlers3 --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev