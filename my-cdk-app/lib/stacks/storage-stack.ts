import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WebsiteBucket } from '../constructs/website-bucket';
import { EnvironmentConfig } from '../config';

export interface StorageStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class StorageStack extends cdk.Stack {
  public readonly websiteBucket: WebsiteBucket;

  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    const { config } = props;

    this.websiteBucket = new WebsiteBucket(this, 'WebsiteBucket', {
      bucketName: config.s3.bucketName,
      websitePath: config.s3.websitePath,
      enableVersioning: config.s3.enableVersioning,
      encryption: config.s3.encryption,
      environment: config.environment,
    });

    // Apply tags
    Object.entries(config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });

    // Outputs
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: this.websiteBucket.websiteUrl,
      exportName: `${config.environment}-WebsiteURL`,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: this.websiteBucket.bucket.bucketName,
      exportName: `${config.environment}-BucketName`,
    });
  }
}