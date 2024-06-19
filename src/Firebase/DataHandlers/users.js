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

    return userInfo;
    
}


export function removeUserFromFirebase(user)
{    
    remove(ref(database, 'users/' + user.userId))
    remove(ref(database, 'usernames/' + user.username))
}

export async function usernameExists(username)
{
    return await get(child(ref(database), `usernames/${username}`)).then((snapshot) => {
            return snapshot.exists()
    });
}

export async function updateUserCompletedGames(userId,gameMode,won=false)
{
    let userCompletedGames = await get(child(ref(database), `users/${userId}/stats/completed`)).then((snapshot) => {
        return snapshot.exists() ? snapshot.val() : {};
    });
    if(userCompletedGames[gameMode])
    {
        userCompletedGames[gameMode]++;
    }
    else
    {
        userCompletedGames[gameMode] = 1;
    }
    update(ref(database,`users/${userId}/stats/completed`),userCompletedGames);

    if(won)
    {
        let userWonGames = await get(child(ref(database), `users/${userId}/stats/won`)).then((snapshot) => {
            return snapshot.exists() ? snapshot.val() : {};
        });
        if(userWonGames[gameMode])
        {
            userWonGames[gameMode]++;
        }
        else
        {
            userWonGames[gameMode] = 1;
        }
        update(ref(database,`users/${userId}/stats/won`),userWonGames);
    }
}