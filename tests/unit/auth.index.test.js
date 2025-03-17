describe('When env vars are invalid', () => {
  test('throws an error if both AWS Cognito and HTTP Basic Auth are configured', () => {
    process.env = {
      AWS_COGNITO_CLIENT_ID: 'test-client-id',
      AWS_COGNITO_POOL_ID: 'test-pool-id',
      HTPASSWD_FILE: '/path/to/htpasswd',
    };

    expect(() => require('../../src/auth')).toThrow(
      new Error(
        'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
      )
    );
  });
});
