export type SteriLabelModel = {
    id: number;
    created_at: string;
    updated_at: string;
    expiry_at: string;
    steri_item: {
        id: number;
        name: string;
        category: string;
    }
    clinic_user: {
        id: number;
        name: string;
    }
}

export const SteriLabelFragment = `
    id
    created_at
    updated_at
    expiry_at
    steri_item {
        id
        name
        category
    }
    clinic_user {
        id
        name
    }
`;