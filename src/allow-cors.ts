import { aws_apigateway as apigateway } from 'aws-cdk-lib';

// Type that covers both `IntegrationResponse` and `MethodResponse`.
interface Response<T> {
  responseParameters?: { [key: string]: T };
};

// Access-Control-Allow-Origin response header.
const ALLOW_ORIGIN = 'method.response.header.Access-Control-Allow-Origin';
// Access-Control-Allow-Headers response header.
const ALLOW_HEADERS = 'method.response.header.Access-Control-Allow-Headers';
// Access-Control-Allow-Methods response header.
const ALLOW_METHODS = 'method.response.header.Access-Control-Allow-Methods';

// surrounds `aws_apigateway.Cors.ALL_ORIGINS` with quotation marks.
const ALL_ORIGINS = `'${apigateway.Cors.ALL_ORIGINS}'`;
// joins `aws_apigateway.Cors.DEFAULT_HEADERS`
// and surrounds it with quotation marks.
const DEFAULT_HEADERS = `'${apigateway.Cors.DEFAULT_HEADERS.join(',')}'`;
// joins `aws_apigateway.Cors.ALL_METHODS`
// and surrounds it with quotation marks.
const ALL_METHODS = `'${apigateway.Cors.ALL_METHODS.join(',')}'`;

/**
 * Makes given {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.IntegrationResponse.html | IntegrationResponse}s allow CORS.
 *
 * @beta
 *
 * @remarks
 *
 * Configures the following response headers,
 *
 * - `Access-Control-Allow-Origin`: `*`
 *
 * - `Access-Control-Allow-Headers`: headers equivalent to
 *   {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Cors.html#static-default_headers | aws_apigateway.Cors.DEFAULT_HEADERS}
 *
 * - `Access-Control-Allow-Methods`: methods equivalent to
 *   {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Cors.html#static-all_methods | aws_apigateway.Cors.ALL_METHODS}
 *
 * @param responses -
 *
 *   Integration response settings to allow CORS.
 *
 * @returns
 *
 *   `responses` with updated
 *   {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.IntegrationResponse.html#responseparameters | responseParameters}.
 */
export function makeIntegrationResponsesAllowCors(
  responses: apigateway.IntegrationResponse[],
): apigateway.IntegrationResponse[] {
  responses = setResponseParameters(responses, ALLOW_ORIGIN, ALL_ORIGINS);
  responses = setResponseParameters(responses, ALLOW_HEADERS, DEFAULT_HEADERS);
  responses = setResponseParameters(responses, ALLOW_METHODS, ALL_METHODS);
  return responses;
}

/**
 * Makes given {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.MethodResponse.html | MethodResponse}s allow CORS.
 *
 * @beta
 *
 * @remarks
 *
 * Marks the following response headers included,
 *
 * - `Access-Control-Allow-Origin`
 *
 * - `Access-Control-Allow-Headers`
 *
 * - `Access-Control-Allow-Methods`
 *
 * @param responses -
 *
 *   Method response settings to allow CORS.
 *
 * @returns
 *
 *   `responses` with updated
 *   {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.MethodResponse.html#responseparameters | responseParameters}.
 */
export function makeMethodResponsesAllowCors(
  responses: apigateway.MethodResponse[],
): apigateway.MethodResponse[] {
  responses = setResponseParameters(responses, ALLOW_ORIGIN, true);
  responses = setResponseParameters(responses, ALLOW_HEADERS, true);
  responses = setResponseParameters(responses, ALLOW_METHODS, true);
  return responses;
}

// Sets the value of a given response header.
function setResponseParameters<T, U extends Response<T>>(
  responses: U[],
  key: string,
  value: T,
): U[] {
  return responses.map(response => {
    const { responseParameters } = response;
    return {
      ...response,
      responseParameters: {
        ...(responseParameters || {}),
        [key]: value,
      },
    };
  });
}
