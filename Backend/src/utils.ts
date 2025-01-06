import { UserModel} from "./db/user.db";



//@ts-ignore
export const getAllUsers = async ({ userId }) => {
    const users = await UserModel.find({
        _id: { $ne: userId }
    });
    return users;
}