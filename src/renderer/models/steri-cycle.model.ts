import { SteriCycleItemFragment, SteriCycleItemModel } from "./steri-cycle-item.model"
import { UserFragment } from "./user.model"

export type SteriCycleModel = {
    id: number;
    created_at: string;
    updated_at: string;
    steri_id: number;
    status: 'loading'|'running'|'finished'|'failed'
    steri?: {
        id: number;
        name: string;
        serial: string;
        clinic?: {
            id: number;
            name: string;
        }
    }
    cycle_id: string;
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
    steri_cycle_items?: SteriCycleItemModel[]
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
    cycle_id
    start_user {
        ${UserFragment}
    }
    start_at
    finish_user {
        ${UserFragment}
    }
    finish_at
    notes
    steri_cycle_items(order_by: {id: desc}) {
        ${SteriCycleItemFragment}
    }
`