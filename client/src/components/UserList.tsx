import { User } from '@/model/user';

interface Props {
  users: User[];
}

export const UserList = ({ users }: Props): JSX.Element => {
  return (
    <ul>
      {users.map((user) => (
        <li className="p-3 my-2 text-sm" key={user.id}>
          🦧 {user.email}
        </li>
      ))}
    </ul>
  );
};
