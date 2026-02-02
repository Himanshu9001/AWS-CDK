import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { RdsInstanceProps } from './types';

export class RdsInstance extends Construct {
  public readonly database: rds.DatabaseInstance;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: RdsInstanceProps) {
    super(scope, id);

    const {
      vpc,
      instanceType,
      databaseName,
      multiAz,
      environment,
      allocatedStorage = 20,
      maxAllocatedStorage = 100,
    } = props;

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc,
      description: `Security group for ${id} RDS database`,
      allowAllOutbound: true,
    });

    this.securityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(3306),
      'Allow MySQL access from VPC'
    );

    const subnetGroup = new rds.SubnetGroup(this, 'SubnetGroup', {
      vpc: vpc,
      description: `Subnet group for ${id}`,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    // ✅ ONLY CHANGE: Use ec2.InstanceType.of() instead of new ec2.InstanceType()
    this.database = new rds.DatabaseInstance(this, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,  // Use latest 8.0
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [this.securityGroup],
      subnetGroup: subnetGroup,
      databaseName: databaseName,
      multiAz: multiAz,
      allocatedStorage: allocatedStorage,
      maxAllocatedStorage: maxAllocatedStorage,
      storageType: rds.StorageType.GP3,
      deletionProtection: environment === 'prod',
      removalPolicy: environment === 'prod' 
        ? cdk.RemovalPolicy.SNAPSHOT 
        : cdk.RemovalPolicy.DESTROY,
      backupRetention: environment === 'prod' 
        ? cdk.Duration.days(7) 
        : cdk.Duration.days(1),
      preferredBackupWindow: '03:00-04:00',
      preferredMaintenanceWindow: 'sun:04:00-sun:05:00',
      enablePerformanceInsights: environment === 'prod',
      cloudwatchLogsExports: ['error'],
      publiclyAccessible: false,
    });

    cdk.Tags.of(this.database).add('Environment', environment);
  }
}

export * from './types';