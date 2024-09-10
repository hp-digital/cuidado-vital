import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin,
  clientId: '1080022931919-tpab5dqhglqbe7an1iinpgadpctgv1ht.apps.googleusercontent.com',  //Client ID
  scope: 'openid profile email https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.activity.read',
  strictDiscoveryDocumentValidation: false,
};