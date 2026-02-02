export interface VpcProps {
  cidr: string;
  maxAzs: number;
  natGateways: number;
  environment: string;
}