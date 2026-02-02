import { EnvironmentConfig } from './environment-config';

export const prodConfig: EnvironmentConfig = {
  environment: 'prod',
  region: 'us-east-1',
  
  vpc: {
    cidr: '10.1.0.0/16',
    maxAzs: 3,
    natGateways: 3,
  },
  
  ec2: {
    instanceType: 't3.large',
    keyName: undefined,
    enableMonitoring: true,
  },
  
  s3: {
    bucketName: undefined,
    websitePath: './website',
    enableVersioning: true,
    encryption: true,
  },
  
  rds: {
    instanceType: 'r5.large',
    databaseName: 'myapp_prod',
    multiAz: true,
  },
  
  tags: {
    Environment: 'prod',
    Project: 'MyApp',
    ManagedBy: 'CDK',
    CostCenter: 'Engineering',
  },
};