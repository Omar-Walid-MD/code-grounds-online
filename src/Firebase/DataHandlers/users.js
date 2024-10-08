import { child, get, getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import { auth, database } from "../firebase";
import { generateAvatar } from "../../Helpers/avatar";
import { deleteUser } from "firebase/auth";

export function registerUser(userId, userInfo)
{
    set(ref(database, 'users/' + userId), userInfo);
    if(userInfo.username)
    {
        set(ref(database, 'usernames/' + userInfo.username.toLowerCase()), true);
    }

}

export function updateUserInfo(oldUserInfo, updatedUserInfo)
{
    update(ref(database, 'users/' + oldUserInfo.userId), updatedUserInfo);
    if(updatedUserInfo.username)
    {
        if(updatedUserInfo.username !== oldUserInfo?.username)
        {
            set(ref(database, 'usernames/' + updatedUserInfo.username.toLowerCase()), true);
            remove(ref(database, 'usernames/' + oldUserInfo.username.toLowerCase()));

        }
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

    return userInfo;
    
}



export async function usernameExists(username)
{
    return await get(child(ref(database), `usernames/${username.toLowerCase()}`)).then((snapshot) => {
            return snapshot.exists()
    });
}

export async function updateUserCompletedGames(userId,gameMode,won=false)
{
    let userStats = await get(child(ref(database), `users/${userId}/stats/`)).then((snapshot) => {
        return snapshot.exists() ? snapshot.val() : {};
    });
    
    if(userStats.completed[gameMode])
    {
        userStats.completed[gameMode]++;
    }
    else
    {
        userStats.completed[gameMode] = 1;
    }
    
    if(won)
    {
        if(userStats.won[gameMode])
        {
            userStats.won[gameMode]++;
        }
        else
        {
            userStats.won[gameMode] = 1;
        }
    }
    update(ref(database,`users/${userId}/stats/`),userStats);
    return userStats;
}