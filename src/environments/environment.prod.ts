function isTestMode(): boolean {
  return !!(window as any).Cypress;
}

export const environment = {
  production: true,
  backend_url: isTestMode()
    ? 'http://docker:8080'
    : 'https://dash-webservices.herokuapp.com'
};
