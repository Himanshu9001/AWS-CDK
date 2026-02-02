export interface EnvironmentConfig {
  environment: string;
  region: string;
  account?: string;
  
  vpc: {
    cidr: string;
    maxAzs: number;
    natGateways: number;
  };
  
  ec2: {
    instanceType: string;
    keyName?: string;
    enableMonitoring: boolean;
  };
  
  s3: {
    bucketName?: string;
    websitePath: string;
    enableVersioning: boolean;
    encryption: boolean;
  };
  
  rds?: {
    instanceType: string;
    databaseName: string;
    multiAz: boolean;
  };
  
  tags: {
    Environment: string;
    Project: string;
    ManagedBy: string;
    CostCenter?: string;
  };
}