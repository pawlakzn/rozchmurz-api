import { Uuid } from '@utils/types';

export interface PresignedUrlResponse {
    url: string;
    id: Uuid;
    fields: Record<string, string>;
}
