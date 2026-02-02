import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface Ec2InstanceProps {
  vpc: ec2.IVpc;
  instanceType: string;
  keyName?: string;  // Add the ? here
  enableMonitoring: boolean;
  environment: string;
  userData?: string;
}