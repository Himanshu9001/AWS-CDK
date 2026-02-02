import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Ec2Instance } from '../constructs/ec2-instance';
import { EnvironmentConfig } from '../config';

export interface ComputeStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
}

export class ComputeStack extends cdk.Stack {
  public readonly instance: Ec2Instance;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const { config, vpc } = props;

    this.instance = new Ec2Instance(this, 'WebServer', {
      vpc: vpc,
      instanceType: config.ec2.instanceType,
      keyName: config.ec2.keyName,
      enableMonitoring: config.ec2.enableMonitoring,
      environment: config.environment,
      userData: `#!/bin/bash
        yum update -y
        yum install -y httpd
        systemctl start httpd
        systemctl enable httpd
        echo "<h1>Hello from ${config.environment}</h1>" > /var/www/html/index.html
      `,
    });

    // Apply tags
    Object.entries(config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });

    // Outputs
    new cdk.CfnOutput(this, 'InstanceId', {
      value: this.instance.instance.instanceId,
      exportName: `${config.environment}-InstanceId`,
    });

    new cdk.CfnOutput(this, 'InstancePublicIp', {
      value: this.instance.instance.instancePublicIp,
      exportName: `${config.environment}-InstancePublicIp`,
    });
  }
}