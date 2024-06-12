import { child, get, getDatabase, onValue, ref, set } from "firebase/database";
import { database } from "../firebase";

export function registerUser(userId, username)
{
  set(ref(database, 'users/' + userId), {
    username
  });
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
    return userInfo;
    
}