export type Colors = 'W' | 'B' | 'U' | 'R' | 'G';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Mythic Rare';

export interface Legality {
    format: string;
    legality: string;
}

export interface Card {
    name: string;
    manaCost: string;
    cmc: number;
    colors: Colors[];
    colorIdentity: Colors[];
    type: string;
    types: string[];
    subtypes: string[];
    rarity: Rarity;
    set: string;
    setName: string;
    text: string;
    artist: string;
    number: string;
    power: string;
    toughness: string;
    layout: string;
    multiverseid: string;
    imageUrl?: string;
    variations: string[];
    printings: string[];
    originalText: string;
    originalType: string;
    legalities: Legality[];
    id: string;
}
