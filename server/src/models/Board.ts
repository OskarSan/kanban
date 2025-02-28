/*
import mongoose, { Schema, Document } from 'mongoose';
import {KanBanCard, IKanBanCard} from './KanbanCard';

interface IBoard extends Document {
    id: number;
    content: IKanBanCard[];
}


const boardSchema: Schema = new Schema({
    id: {type: Number, required: true},
    content: {type: [Schema.Types.ObjectId], ref: 'kanBanCard'}
}, {collection: 'board'});

const Board = mongoose.model<IBoard>('board', boardSchema);

export {Board, IBoard};
*/