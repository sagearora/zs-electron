export type PatientModel = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    dob: string;
    archived_at?: string;
}

export const PatientFragment = `
    id
    created_at
    updated_at
    name
    dob
    archived_at
`;
