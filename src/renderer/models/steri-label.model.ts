export type SteriLabelModel = {
    id: number;
    created_at: string;
    updated_at: string;
    steri_item: {
        id: number;
        name: string;
    }
    clinic_user: {
        id: number;
        name: string;
    }
}

export const SteriLabelFragment = `
    id
    created_at
    steri_item {
        id
        name
    }
    clinic_user {
        id
        name
    }
`;