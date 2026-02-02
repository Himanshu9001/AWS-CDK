import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Ec2InstanceProps } from './types';

export class Ec2Instance extends Construct {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: Ec2InstanceProps) {
    super(scope, id);

    const { vpc, instanceType, keyName, enableMonitoring, environment, userData } = props;

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc,
      description: `Security group for ${id}`,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic'
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic'
    );

    this.instance = new ec2.Instance(this, 'Instance', {
      vpc: vpc,
      instanceType: new ec2.InstanceType(instanceType),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      keyName: keyName,
      securityGroup: securityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      detailedMonitoring: enableMonitoring,
      userData: userData ? ec2.UserData.custom(userData) : undefined,
    });

    // Add tags
    cdk.Tags.of(this.instance).add('Environment', environment);
  }
}

export * from './types';