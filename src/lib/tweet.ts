import {
	deleteTweetAction,
	toggleBookmarkAction,
	toggleLikeAction,
} from "@/actions/tweet.action";
import {
	CopyLinkTweetProps,
	DeleteTweetProps,
	ToggleBookmarkTweetProps,
	ToggleLikeTweetProps,
} from "@/interfaces/tweet.interface";
import { toastOptions } from "./utils";
import { likePostNotificationAction } from "@/actions/notification.action";

export const deleteTweet = ({
	isPending,
	startTransition,
	toast,
	path,
	id,
}: DeleteTweetProps) => {
	if (isPending) return;

	startTransition(() => {
		deleteTweetAction(id, path);

		toast("Your post was deleted", toastOptions);
	});
};

export const toggleBookmarkTweet = ({
	isPending,
	startTransition,
	toast,
	path,
	bookmark,
	userId,
	threadId,
}: ToggleBookmarkTweetProps) => {
	if (isPending) return;

	const message = bookmark
		? "Removed from your Bookmarks"
		: "Added to your Bookmarks";

	toast(message, toastOptions);

	startTransition(() => {
		toggleBookmarkAction({
			userId,
			threadId,
			path,
		});
	});
};

export const copyLinkTweet = ({
	toast,
	username,
	tweetId,
}: CopyLinkTweetProps) => {
	const url = process.env.NEXT_PUBLIC_NEXT_URL;
	navigator.clipboard.writeText(`${url}/${username}/status/${tweetId}`);

	toast("Copied to clipboard", toastOptions);
};

export const toggleLikeTweet = ({
	isPending,
	startTransition,
	liked,
	userId,
	currentUserId,
	threadId,
	path,
}: ToggleLikeTweetProps) => {
	if (isPending) return;

	startTransition(() => {
		toggleLikeAction({
			userId: currentUserId,
			threadId,
			path,
		});

		if (liked || currentUserId === userId) return;

		likePostNotificationAction({
			userId,
			sourceId: currentUserId,
			parentIdPost: threadId,
			path,
		});
	});
};

// generate by chatGPT
export const renderText = (text: string) => {
	const textWithoutEmptyLines = text.replace(/^\s*$/gm, " ");
	const textWithSingleLineBreaks = textWithoutEmptyLines.replace(/\n+/g, "\n");
	return textWithSingleLineBreaks;
};

// https://github.com/timdereaper1/caching-forms-in-react
export const URL_REGEX =
	/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
