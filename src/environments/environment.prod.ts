function isTestMode(): boolean {
  console.log(!!(window as any).Cypress);
  return !!(window as any).Cypress;
}

export const environment = {
  production: true,
  backend_url: isTestMode()
    ? 'http://backend'
    : 'https://dash-webservices.herokuapp.com'
};
