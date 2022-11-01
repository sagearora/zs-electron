import { OpFragment, OpModel } from "./op.model";
import { SteriLabelFragment, SteriLabelModel } from "./steri-label.model";
import { UserFragment, UserModel } from "./user.model";

export type PatientSteriLabelModel = {
    id: number;
    created_at: string;
    updated_at: string;
    steri_label: SteriLabelModel;
    op: OpModel;
    clinic_user: UserModel;
}

export const PatientSteriLabelFragment = `
    id
    created_at
    updated_at
    steri_label {
        ${SteriLabelFragment}
    }
    op {
        ${OpFragment}
    }
    clinic_user {
        ${UserFragment}
    }
`;