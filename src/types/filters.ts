import { Colors } from './card';

export interface FiltersI {
    name?: string;
    colorIdentity?: Colors[];
    type?: string;
    page?: number;
}
