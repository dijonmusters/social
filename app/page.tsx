import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>You need to sign in!</p>;
  }

  const { data: follows } = await supabase
    .from("follows")
    .select()
    .match({ user_id: user.id });

  const followIds = follows?.map((follow) => follow.follow_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select()
    .in("id", followIds ?? []);

  const { data: posts } = await supabase
    .from("posts")
    .select()
    .in("user_id", followIds ?? []);

  const postsWithProfile =
    posts?.map((post) => ({
      ...post,
      profile: profiles?.find((profile) => profile.id === post.user_id),
    })) ?? [];

  // TODO: Collapse these three queries into a single view!

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 w-full">
        <h2 className="font-bold text-4xl mb-4">For me</h2>
        {posts && posts.length > 0 ? (
          <ul className="flex flex-col gap-2 border">
            {postsWithProfile.map((post) => (
              <li key={post.id} className="flex flex-col gap-1 border-b p-8">
                <div className="flex items-center">
                  <img
                    src={post.profile?.avatar_url}
                    width={48}
                    className="rounded-full"
                  />
                  <span className="ml-4 font-bold">
                    @{post.profile?.username}
                  </span>
                </div>
                <h3 className="font-medium text-lg">{post.title}</h3>
                <p className="m-4">{post.content}</p>
                <p className="flex items-center mx-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="ml-2 text-gray-500">
                    {Math.floor(Math.random() * (1000 - 0 + 1) + 0)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts found</p>
        )}
      </main>
    </>
  );
}
