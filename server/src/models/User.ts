import mongoose, {Document, Schema} from 'mongoose';

interface IUser extends Document {
    username: string;
    password?: string;
    board: mongoose.Types.ObjectId;
    cardIds: mongoose.Types.ObjectId[];
    googleId?: string;
    
}


const UserSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: false},
    board: {type: Schema.Types.ObjectId, ref: 'Board'},
    cardIds: {type: [Schema.Types.ObjectId], ref: 'KanBanCard'},
    googleId: {type: String, required: false}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export {User, IUser};