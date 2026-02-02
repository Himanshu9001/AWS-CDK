import { EnvironmentConfig } from './environment-config';

export const stagingConfig: EnvironmentConfig = {
  environment: 'staging',
  region: 'us-east-1',
  
  vpc: {
    cidr: '10.2.0.0/16',
    maxAzs: 2,
    natGateways: 2,
  },
  
  ec2: {
    instanceType: 't3.small',
    keyName: 'staging-keypair',
    enableMonitoring: true,
  },
  
  s3: {
    bucketName: 'my-website-staging',
    websitePath: './website',
    enableVersioning: true,
    encryption: true,
  },
  
  rds: {
    instanceType: 'db.t3.small',
    databaseName: 'myapp_staging',
    multiAz: true,
  },
  
  tags: {
    Environment: 'staging',
    Project: 'MyApp',
    ManagedBy: 'CDK',
  },
};