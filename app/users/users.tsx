"use client";

import { useOptimistic } from "react";
import { followUser, unfollowUser } from "../actions";
import { redirect } from "next/navigation";
import KonamiListener from "./konami-listener";
import Countdown from "./countdown";

export default function Users({
  user,
  users,
  follows,
}: {
  // TODO! Fix these types
  user: any;
  users: any[];
  follows: any[];
}) {
  const [optimisticFollows, addOptimisticFollow] = useOptimistic<any[], any>(
    follows,
    (state, newFollowState) => {
      if (newFollowState.unfollowing) {
        return state.filter(
          (follow) =>
            follow.follow_id !== newFollowState.follow_id ||
            follow.user_id !== newFollowState.user_id
        );
      }
      return [...state, newFollowState];
    }
  );

  const unfollowAction = async (formData: FormData) => {
    const userId = formData.get("userId") as string;

    const newFollowState = {
      user_id: user.id,
      follow_id: userId,
      unfollowing: true,
    };

    addOptimisticFollow(newFollowState);

    await unfollowUser(userId);
  };

  const followAction = async (formData: FormData) => {
    const userId = formData.get("userId") as string;

    const newFollowState = {
      user_id: user.id,
      follow_id: userId,
    };

    addOptimisticFollow(newFollowState);

    await followUser(userId);

    if (optimisticFollows.length >= 10) {
      redirect("/onboarding/passed");
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-6 px-4">
      <KonamiListener />
      <Countdown numFollowed={optimisticFollows.length} />
      <ul className="grid grid-cols-3 gap-6">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex flex-col items-center gap-4 bg-gray-900 p-8"
          >
            <img
              src={user.avatar_url}
              alt={user.username}
              className="rounded-full w-24 h-24"
            />
            <div className="flex gap-2 items-center">
              <h2 className="font-medium text-lg">{user.username}</h2>
              {optimisticFollows.find(
                (follow) => follow.follow_id === user.id && !follow.unfollowing
              ) ? (
                <form action={unfollowAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button className=" px-2 rounded-md text-muted-foreground">
                    Unfollow
                  </button>
                </form>
              ) : (
                <form action={followAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button className="border border-white px-2 rounded-md hover:bg-gray-800">
                    Follow
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
