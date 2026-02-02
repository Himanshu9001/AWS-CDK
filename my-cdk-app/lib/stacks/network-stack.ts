import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { VpcConstruct } from '../constructs/vpc';
import { EnvironmentConfig } from '../config';

export interface NetworkStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class NetworkStack extends cdk.Stack {
  public readonly vpc: cdk.aws_ec2.Vpc;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const { config } = props;

    const vpcConstruct = new VpcConstruct(this, 'VPC', {
      cidr: config.vpc.cidr,
      maxAzs: config.vpc.maxAzs,
      natGateways: config.vpc.natGateways,
      environment: config.environment,
    });

    this.vpc = vpcConstruct.vpc;

    // Apply tags
    Object.entries(config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });

    // Outputs
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      exportName: `${config.environment}-VpcId`,
    });
  }
}