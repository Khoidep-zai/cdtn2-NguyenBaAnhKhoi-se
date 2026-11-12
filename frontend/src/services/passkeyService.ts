import { apiClient } from './apiClient';
import { ApiResponse, AuthResponse } from '../types';

// Helper utilities to convert between Base64URL and ArrayBuffer
function bufferToBase64url(buffer: ArrayBuffer): string {
  const byteView = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < byteView.byteLength; i++) {
    str += String.fromCharCode(byteView[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export const passkeyService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && !!window.PublicKeyCredential;
  },

  async isConditionalAutofillAvailable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    if (typeof (window.PublicKeyCredential as any).isConditionalMediationAvailable === 'function') {
      try {
        return await (window.PublicKeyCredential as any).isConditionalMediationAvailable();
      } catch {
        return false;
      }
    }
    return false;
  },

  async registerPasskey(email: string): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ WebAuthn / Passkeys.');
    }

    // 1. Get registration options from server
    const optionsRes = await apiClient.post<ApiResponse<any>>('/auth/passkey/register-options', { email });
    const opts = optionsRes.data.data;

    // 2. Prepare publicKey options for navigator.credentials.create
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: base64urlToBuffer(opts.challenge),
      rp: opts.rp,
      user: {
        id: new TextEncoder().encode(opts.user.id),
        name: opts.user.name,
        displayName: opts.user.displayName,
      },
      pubKeyCredParams: opts.pubKeyCredParams.map((p: any) => ({
        type: p.type,
        alg: Number(p.alg),
      })),
      timeout: opts.timeout || 60000,
      authenticatorSelection: {
        userVerification: 'preferred',
        residentKey: 'preferred',
      },
      attestation: opts.attestation || 'none',
    };

    // 3. Prompt user for biometric / security key
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Đăng ký Passkey bị hủy hoặc không thành công.');
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    // 4. Send back to server to finalize registration
    const registerPayload = {
      email,
      credentialId: credential.id,
      rawId: bufferToBase64url(credential.rawId),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
      nickname: 'Thiết bị hiện tại',
    };

    const finalRes = await apiClient.post<ApiResponse<boolean>>('/auth/passkey/register', registerPayload);
    return finalRes.data.data;
  },

  async loginWithPasskey(email: string): Promise<AuthResponse> {
    if (!this.isSupported()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ WebAuthn / Passkeys.');
    }

    // 1. Get login challenge from server
    const optionsRes = await apiClient.post<ApiResponse<any>>('/auth/passkey/login-options', { email });
    const opts = optionsRes.data.data;

    // 2. Prepare assertion options
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: base64urlToBuffer(opts.challenge),
      rpId: window.location.hostname || opts.rpId || 'localhost',
      timeout: opts.timeout || 60000,
      userVerification: opts.userVerification || 'preferred',
    };

    if (opts.allowCredentials && opts.allowCredentials.length > 0) {
      publicKeyCredentialRequestOptions.allowCredentials = opts.allowCredentials.map((c: any) => ({
        type: 'public-key',
        id: base64urlToBuffer(c.id),
        transports: c.transports,
      }));
    }

    // 3. Request credential assertion from user
    const assertion = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential;

    if (!assertion) {
      throw new Error('Đăng nhập Passkey bị hủy.');
    }

    const response = assertion.response as AuthenticatorAssertionResponse;

    // 4. Verify signature on backend & issue JWT
    const verifyPayload = {
      email,
      credentialId: assertion.id,
      authenticatorData: bufferToBase64url(response.authenticatorData),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : '',
    };

    const verifyRes = await apiClient.post<ApiResponse<AuthResponse>>('/auth/passkey/verify-login', verifyPayload);
    return verifyRes.data.data;
  },
};
