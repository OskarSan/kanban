
import mongoose, {Schema, Document} from "mongoose";

interface IKanBanCardContent extends Document{
    title: string;
    content: string;
    status: string;
}

const kanBanCardContentSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    status: {type: String, required: true}
}, {collection: 'kanBanCardContent'});

const KanBanCardContent = mongoose.model<IKanBanCardContent>('kanBanCardContent', kanBanCardContentSchema);

export {KanBanCardContent, IKanBanCardContent};