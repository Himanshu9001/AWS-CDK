#!/usr/bin/env node
// import * as cdk from 'aws-cdk-lib/core';
// import { MyCdkAppStack } from '../lib/my-cdk-app-stack';

// const app = new cdk.App();
// new MyCdkAppStack(app, 'MyCdkAppStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });
// #!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '../lib/config';
import { NetworkStack } from '../lib/stacks/network-stack';
import { StorageStack } from '../lib/stacks/storage-stack';
import { ComputeStack } from '../lib/stacks/compute-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';
const config = getConfig(environment);

const networkStackName = `${config.environment}-Network-Stack`;
const storageStackName = `${config.environment}-Storage-Stack`;
const computeStackName = `${config.environment}-Compute-Stack`;
const databaseStackName = `${config.environment}-Database-Stack`;

const stackProps: cdk.StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: config.region,
  },
};

const networkStack = new NetworkStack(app, networkStackName, {
  ...stackProps,
  config: config,
  stackName: networkStackName,
  description: `Network infrastructure for ${config.environment}`,
});

const storageStack = new StorageStack(app, storageStackName, {
  ...stackProps,
  config: config,
  stackName: storageStackName,
  description: `Storage infrastructure for ${config.environment}`,
});

const databaseStack = new DatabaseStack(app, databaseStackName, {
  ...stackProps,
  config: config,
  vpc: networkStack.vpc,
  stackName: databaseStackName,
  description: `Database infrastructure for ${config.environment}`,
});

const computeStack = new ComputeStack(app, computeStackName, {
  ...stackProps,
  config: config,
  vpc: networkStack.vpc,
  stackName: computeStackName,
  description: `Compute infrastructure for ${config.environment}`,
});

databaseStack.addDependency(networkStack);
computeStack.addDependency(networkStack);

app.synth();