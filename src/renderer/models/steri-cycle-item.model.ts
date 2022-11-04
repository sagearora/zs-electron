import { SteriLabelFragment, SteriLabelModel } from "./steri-label.model";
import { UserFragment, UserModel } from "./user.model";

export type SteriCycleItemModel = {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    steri_label: SteriLabelModel;
    steri_label_id: number;
    steri_cycle_id: number;
    clinic_user: UserModel;
}

export const SteriCycleItemFragment = `
    id
    created_at
    updated_at
    deleted_at
    steri_label_id
    steri_cycle_id
    steri_label {
        ${SteriLabelFragment}
    }
    clinic_user { 
        ${UserFragment}
    }
`;