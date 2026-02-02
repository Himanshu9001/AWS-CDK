export interface WebsiteBucketProps {
  bucketName?: string;  // Add the ? here
  websitePath: string;
  enableVersioning: boolean;
  encryption: boolean;
  environment: string;
}