import { child, get, getDatabase, onValue, ref, set } from "firebase/database";
import { database } from "../firebase";
import { generateAvatar } from "../../Helpers/avatar";

export function registerUser(userId, userInfo)
{
  set(ref(database, 'users/' + userId), userInfo);
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

    const avatar = userInfo?.avatar && generateAvatar(userInfo.avatar);
    if(avatar) userInfo = {...userInfo,avatar};
    return userInfo;
    
}