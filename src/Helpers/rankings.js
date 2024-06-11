export function getSortedRankings(playingUsers)
{
    playingUsers = [...playingUsers];
    playingUsers.sort((a,b) => {
        if(a.state && b.state) return a.state.solvedQuestions.length - b.state.solvedQuestions.length;
        else return false;
    }).reverse();
    
    return playingUsers;
}

export function getRankingString(playingUsers,user)
{
    playingUsers = getSortedRankings(playingUsers);
    const rank = playingUsers.findIndex((u) => u.userId === user.userId) + 1;

    const strings = ["1st","2nd","3rd"];
    if(rank <= 3) return strings[rank-1];
    else return `${rank}th`;
}