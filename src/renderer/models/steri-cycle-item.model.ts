import { SteriLabelFragment, SteriLabelModel } from "./steri-label.model";
import { UserFragment, UserModel } from "./user.model";

export type SteriCycleItemModel = {
    id: number;
    created_at: string;
    updated_at: string;
    steri_label: SteriLabelModel;
    clinic_user: UserModel;
}

export const SteriCycleItemFragment = `
    id
    created_at
    updated_at
    steri_label {
        ${SteriLabelFragment}
    }
    clinic_user { 
        ${UserFragment}
    }
`;