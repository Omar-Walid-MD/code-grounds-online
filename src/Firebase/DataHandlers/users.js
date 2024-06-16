import { child, get, getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import { auth, database } from "../firebase";
import { generateAvatar } from "../../Helpers/avatar";
import { deleteUser } from "firebase/auth";

export function registerUser(userId, userInfo)
{
    set(ref(database, 'users/' + userId), userInfo);
    if(userInfo.username)
    {
        set(ref(database, 'usernames/' + userInfo.username), true);
    }

}

export function updateUserInfo(userId, userInfo)
{
    update(ref(database, 'users/' + userId), userInfo);
    if(userInfo.username)
    {
        set(ref(database, 'usernames/' + userInfo.username), true);
    }
}

export async function getUser(userId)
{
    let userInfo;
    await get(child(ref(database), `users/${userId}`)).then((snapshot) => {
        if(snapshot.exists())
        {
            userInfo = snapshot.val();
        }
    });


    // const avatar = userInfo?.avatar;
    // if(avatar) userInfo = {...userInfo,avatar};
    return userInfo;
    
}


export function removeUserFromFirebase(user)
{    
    remove(ref(database, 'users/' + user.userId))
    remove(ref(database, 'usernames/' + user.username))
}
