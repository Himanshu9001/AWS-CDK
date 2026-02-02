import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RdsInstance } from '../constructs/rds-instance';
import { EnvironmentConfig } from '../config';

export interface DatabaseStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
}

export class DatabaseStack extends cdk.Stack {
  public readonly rdsInstance?: RdsInstance;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { config, vpc } = props;

    if (!config.rds) {
      console.log(`No RDS configuration found for ${config.environment}, skipping database creation`);
      return;
    }

    this.rdsInstance = new RdsInstance(this, 'RdsInstance', {
      vpc: vpc,
      instanceType: config.rds.instanceType,
      databaseName: config.rds.databaseName,
      multiAz: config.rds.multiAz,
      environment: config.environment,
    });

    // Apply tags
    Object.entries(config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, String(value));
    });

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.rdsInstance.database.dbInstanceEndpointAddress,
      description: 'Database endpoint address',
      exportName: `${config.environment}-DatabaseEndpoint`,
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.rdsInstance.database.dbInstanceEndpointPort,
      description: 'Database port',
      exportName: `${config.environment}-DatabasePort`,
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: this.rdsInstance.database.secret?.secretArn || 'N/A',
      description: 'Secret ARN for database credentials',
      exportName: `${config.environment}-DatabaseSecretArn`,
    });
  }
}