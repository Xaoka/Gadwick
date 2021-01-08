import { IUser } from '../../../../apis/user';
import { Roles } from './UserRoles';
import { IAppUser } from './UserTable';

export default function getCurrentPermissionLevel(userID: string, invites: IAppUser[], owner: IUser): Roles
{
    let asInvitedUser = invites.filter((i) => i.user_id === owner.id);
    console.log(`USER: ${userID}, owner: ${owner.id}`)
    if (userID === owner.id)
    {
        return Roles.Admin;
    }
    else if (asInvitedUser.length > 0)
    {
        return asInvitedUser[0].role;
    }
    else
    {
        return Roles.Guest;
    }
}