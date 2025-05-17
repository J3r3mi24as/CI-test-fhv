export interface Item {
    id: number;
    name: string;
    description: string;
}

export type ItemCreate = Omit<Item, 'id'>;

export type ItemUpdate = Partial<Item>;