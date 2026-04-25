export interface GuestTokenRequest {
  nickname: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  display_name?: string;
}

export interface UserOut {
  _id: string;
  email: string;
  display_name: string;
  is_guest: boolean;
  is_active: boolean;
}
