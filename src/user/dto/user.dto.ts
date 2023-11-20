import { ProviderType } from '../models/user.model';

export interface IGoggleProfile {
  provider: ProviderType;
  providerId: string;
  email: string;
  displayName: string;
  picture: string;
}
