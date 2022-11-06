import { gql } from "@apollo/client";
import { AppointmentFragment } from "./models/appointment.model";
import { OpFragment } from "./models/op.model";
import { SteriItemFragment } from "./models/steri-item.model";
import { SteriFragment } from "./models/steri.model";


export const QueryAllSteriItems = (f = SteriItemFragment) => gql`
    query steri_item {
        steri_item (where: {
            archived_at: {_is_null: true},
        }, order_by: {category: asc}) {
            ${f}
        }
    }`;


export const QueryOpList = (f = OpFragment) => gql`
query list_ops($cursor: bigint!, $limit: Int!) { 
    op(limit: $limit, where: {
        id: {_gt: $cursor}
    } order_by: {id: asc}) {
        ${f}
    }
}
`


export const QueryAppointmentsByDate = (f = AppointmentFragment) => gql`
query list_appointments($date: date!, $cursor: bigint!, $limit: Int!) { 
    appointment(limit: $limit, where: {
        _and: [
            {schedule_date: {_eq: $date}},
            {id: {_gt: $cursor}},
        ]
    }, order_by: {id: asc}) {
        ${f}
    }
}
`


export const QuerySteriList = (f = SteriFragment, archived?: boolean) => gql`
query { 
    steri(order_by: {id: desc}, where: {archived_at: {_is_null: true}}) {
        ${f}
    }
}
`