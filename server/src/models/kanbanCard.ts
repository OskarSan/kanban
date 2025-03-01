import mongoose, {Schema, Document} from "mongoose";
import {KanBanCardContent, IKanBanCardContent } from "./KanBanCardContent";

interface IKanBanCard extends Document{
    id: number;
    title: string;
    content: IKanBanCardContent[];
    status: string;
    createdBy: string | undefined;

}


const kanBanCardSchema: Schema = new Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    content: {type: [Schema.Types.ObjectId], ref: 'kanBanCardContent'},
    status: {type: String, required: true},
    createdBy: {type: String, required: false}
}, {collection: 'kanBanCard'});

const KanBanCard = mongoose.model<IKanBanCard>('kanBanCard', kanBanCardSchema);

export {KanBanCard, IKanBanCard};