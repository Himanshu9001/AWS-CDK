import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface RdsInstanceProps {
  vpc: ec2.IVpc;
  instanceType: string;
  databaseName: string;
  multiAz: boolean;
  environment: string;
  allocatedStorage?: number;
  maxAllocatedStorage?: number;
}