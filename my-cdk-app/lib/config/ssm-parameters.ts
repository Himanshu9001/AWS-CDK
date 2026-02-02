import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class SsmParameters {
  static getParameter(scope: Construct, name: string): string {
    return ssm.StringParameter.valueFromLookup(scope, name);
  }
  
  static putParameter(scope: Construct, name: string, value: string) {
    new ssm.StringParameter(scope, `Param-${name}`, {
      parameterName: name,
      stringValue: value,
    });
  }
}