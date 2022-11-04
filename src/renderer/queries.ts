import { gql } from "@apollo/client";
import { SteriItemFragment } from "./models/steri-item.model";


export const QueryAllSteriItems = (f = SteriItemFragment) => gql`
    query steri_item {
        steri_item (where: {
            archived_at: {_is_null: true},
        }, order_by: {category: asc}) {
            ${f}
        }
    }`;