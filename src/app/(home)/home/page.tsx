import Topbar from "@/components/home/Topbar"
import CreateTweetForm from "@/components/forms/CreateTweetForm";
import TweetsList from "@/components/home/TweetsList";
import { getTweetsAction } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";

interface Props {
    searchParams: {
        filter: string;
    }
}

const Page = async ({ searchParams }: Props) => {
    const isFollowing = searchParams.filter === "following";

    const clerkUser = await currentUser()
    if (!clerkUser) return null;

    const user = await getUserAction(clerkUser.id)
    if (!user || "message" in user) redirect('/');

    let tweets = await getTweetsAction({ userId: user.id, isFollowing });
    if (!tweets || "message" in tweets) tweets = [];

    return (
        <div className="relative">
            <Topbar isFollowing={isFollowing} />
            <div className="border-b border-gray-300">
                <CreateTweetForm
                    userId={user.id}
                    imageUrl={user.imageUrl}
                    htmlForId="home"
                />
            </div>
            {/* TODO : Display Posts & Infinite Scrolls */}
            <TweetsList dataTweets={tweets ?? []} userId={user.id} />
        </div>
    )
}

export default Page