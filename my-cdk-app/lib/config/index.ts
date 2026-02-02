import { EnvironmentConfig } from './environment-config';
import { devConfig } from './dev';
import { stagingConfig } from './staging';
import { prodConfig } from './prod';

export { EnvironmentConfig };

const configs: Record<string, EnvironmentConfig> = {
  dev: devConfig,
  staging: stagingConfig,
  prod: prodConfig,
};

export function getConfig(environment: string): EnvironmentConfig {
  const config = configs[environment];
  if (!config) {
    throw new Error(`Configuration for environment '${environment}' not found`);
  }
  return config;
}