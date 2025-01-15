import { createClient } from "@/utils/supabase/server";
import Users from "./users";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>You need to sign in!</p>;
  }

  const { data: users } = await supabase
    .from("profiles")
    .select()
    .neq("id", user.id)
    .order("contributions", { ascending: false });

  const { data: follows } = await supabase
    .from("follows")
    .select()
    .match({ user_id: user.id });

  return users && users.length > 0 ? (
    <Users user={user} users={users} follows={follows || []} />
  ) : (
    <p>No users found</p>
  );
}
