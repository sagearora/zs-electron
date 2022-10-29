export type SteriItemModel = {
    id: number;
    created_at: string;
    updated_at: string;
    clinic_id: number;
    name: string;
    category: string;
    is_label_printed: boolean;
    contents?: string;
}

export const SteriItemFragment = `
    id
    created_at
    updated_at
    clinic_id
    name
    category
    is_label_printed
    contents
`;
