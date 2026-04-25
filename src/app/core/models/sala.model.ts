export interface Miembro {
  rider_id: string;
  display_name: string;
  role: 'admin' | 'rider' | 'guest';
  joined_at: string;
}

export interface Sala {
  _id: string;
  name: string;
  description: string | null;
  owner_id: string;
  status: 'active' | 'closed';
  is_private: boolean;
  miembros: Miembro[];
  qr_token: string | null;
  invite_link: string | null;
  created_at: string;
  closed_at: string | null;
}
