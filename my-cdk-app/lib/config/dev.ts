import { EnvironmentConfig } from './environment-config';

export const devConfig: EnvironmentConfig = {
  environment: 'dev',
  region: 'us-east-1',
  
  vpc: {
    cidr: '10.0.0.0/16',
    maxAzs: 2,
    natGateways: 1,
  },
  
  ec2: {
    instanceType: 't3.micro',
    keyName: undefined,
    enableMonitoring: false,
  },
  
  s3: {
    bucketName: undefined,
    websitePath: './website',
    enableVersioning: false,
    encryption: true,
  },
  
  rds: {
    instanceType: 't3.micro',
    databaseName: 'myapp_dev',
    multiAz: false,
  },
  
  tags: {
    Environment: 'dev',
    Project: 'MyApp',
    ManagedBy: 'CDK',
  },
};