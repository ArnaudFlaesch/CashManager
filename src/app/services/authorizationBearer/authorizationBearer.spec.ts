import authorizationBearer from './authorizationBearer';

describe('Authorization bearer tests', () => {
  it('Should not retrieve a token when it does not exists', () => {
    expect(authorizationBearer()).toEqual('');
  });

  it('Should get the token', () => {
    const userData = {
      accessToken: 'accessToken',
      id: 2,
      username: 'admintest',
      email: 'admin@email.com',
      roles: ['ROLE_ADMIN'],
      tokenType: 'Bearer'
    };
    window.localStorage.setItem('user', JSON.stringify(userData));
    expect(authorizationBearer()).toEqual(`Bearer ${userData.accessToken}`);
  });

  it('Should not get the token when cookie exists but accessToken does not', () => {
    const userData = {
      id: 2,
      username: 'admintest',
      email: 'admin@email.com',
      roles: ['ROLE_ADMIN'],
      tokenType: 'Bearer'
    };
    window.localStorage.setItem('user', JSON.stringify(userData));
    expect(authorizationBearer()).toEqual('');
  });
});
