
//model for the task. Incorrectly named as kanBanCardContent.
//this model is used to store the content of the task

import { time } from "console";
import mongoose, {Schema, Document} from "mongoose";

interface IKanBanCardContent extends Document{
    title: string;
    content: string;
    status: string;
    timeStamp: Date;
}

const kanBanCardContentSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    status: {type: String, required: true},
    timeStamp: {type: Date, required: true}
}, {collection: 'kanBanCardContent'});

const KanBanCardContent = mongoose.model<IKanBanCardContent>('kanBanCardContent', kanBanCardContentSchema);

export {KanBanCardContent, IKanBanCardContent};