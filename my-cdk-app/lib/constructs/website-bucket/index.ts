import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { WebsiteBucketProps } from './types';

export class WebsiteBucket extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly websiteUrl: string;

  constructor(scope: Construct, id: string, props: WebsiteBucketProps) {
    super(scope, id);

    const { bucketName, websitePath, enableVersioning, encryption, environment } = props;

    this.bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: bucketName,
      versioned: enableVersioning,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      encryption: encryption 
        ? s3.BucketEncryption.S3_MANAGED 
        : s3.BucketEncryption.UNENCRYPTED,
      removalPolicy: environment === 'prod' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: environment !== 'prod',
    });

    new s3deploy.BucketDeployment(this, 'Deployment', {
      sources: [s3deploy.Source.asset(websitePath)],
      destinationBucket: this.bucket,
    });

    this.websiteUrl = this.bucket.bucketWebsiteUrl;
  }
}

export * from './types';