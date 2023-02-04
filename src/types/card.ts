export enum Colors {
    White = 'W',
    Black = 'B',
    Blue = 'U',
    Red = 'R',
    Green = 'G',
}

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Mythic Rare';

export interface CardI {
    id: string;
    name: string;
    manaCost: string;
    colorIdentity: Colors[];
    type: string;
    rarity: Rarity;
    text: string;
    number?: string;
    power?: string;
    toughness?: string;
    imageUrl?: string;
}
