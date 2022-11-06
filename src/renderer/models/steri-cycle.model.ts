import { SteriLabelFragment, SteriLabelModel } from "./steri-label.model"
import { UserFragment } from "./user.model"

export type SteriStatus = 'loading'|'running'|'finished'|'failed'

export type SteriCycleModel = {
    id: number;
    created_at: string;
    updated_at: string;
    steri_id: number;
    status: SteriStatus;
    steri?: {
        id: number;
        name: string;
        serial: string;
        clinic?: {
            id: number;
            name: string;
        }
    }
    log_data?: string;
    cycle_number: number;
    start_user?: {
        id: number;
        name: string;
    }
    finish_user?: {
        id: number;
        name: string;
    }
    start_at?: string;
    finish_at?: string;
    notes?: string;
    steri_labels?: SteriLabelModel[]
}

export const SteriCycleFragment = `
    id
    created_at
    updated_at
    steri_id
    status
    steri {
        id
        name
        serial
    }
    log_data
    cycle_number
    start_user {
        ${UserFragment}
    }
    start_at
    finish_user {
        ${UserFragment}
    }
    finish_at
    notes
    steri_labels(order_by: {id: desc}) {
        ${SteriLabelFragment}
    }
`