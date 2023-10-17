"use server";

import {
	CommentPostNotificationActionProps,
	FollowUserNotificationActionProps,
	GetNotificationsActionProps,
	LikePostNotificationActionProps,
	ReplyCommentPostNotificationActionProps,
} from "@/interfaces/notification.interface";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const followUserNotificationAction = async ({
	userId,
	parentIdUser,
	sourceId,
	path,
}: FollowUserNotificationActionProps) => {
	try {
		if (!userId) throw new Error("userId required");
		if (!parentIdUser) throw new Error("parentIdUser required");
		if (!sourceId) throw new Error("sourceId required");
		if (!path) throw new Error("path required");

		await prisma.notification.create({
			data: {
				userId,
				parentIdUser,
				sourceId,
				activityType: "Follow",
				parentType: "User",
			},
		});
	} catch (error) {
		console.info("[ERROR_FOLLOW_USER_NOTIFICATION_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};

export const likePostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: LikePostNotificationActionProps) => {
	try {
		if (!userId) throw new Error("userId required");
		if (!sourceId) throw new Error("sourceId required");
		if (!parentIdPost) throw new Error("parentIdPost required");
		if (!path) throw new Error("path required");

		await prisma.notification.create({
			data: {
				userId,
				sourceId,
				parentIdPost,
				activityType: "Like",
				parentType: "Post",
			},
		});
	} catch (error) {
		console.info("[ERROR_LIKE_POST_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

export const commentPostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: CommentPostNotificationActionProps) => {
	try {
		if (!userId) throw new Error("userId required");
		if (!sourceId) throw new Error("sourceId required");
		if (!parentIdPost) throw new Error("parentIdPost required");
		if (!path) throw new Error("path required");

		await prisma.notification.create({
			data: {
				userId,
				sourceId,
				parentIdPost,
				parentType: "Post",
				activityType: "Comment",
			},
		});
	} catch (error) {
		console.info("[ERROR_COMMENT_POST_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

export const replyCommentPostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: ReplyCommentPostNotificationActionProps) => {
	try {
		if (!userId) throw new Error("userId required");
		if (!sourceId) throw new Error("sourceId required");
		if (!parentIdPost) throw new Error("parentIdPost required");
		if (!path) throw new Error("path required");

		await prisma.notification.create({
			data: {
				userId,
				sourceId,
				parentIdPost,
				parentType: "Post",
				activityType: "Reply",
			},
		});
	} catch (error) {
		console.info("[ERROR_REPLY_COMMENT_POST_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

export const getNotificationsAction = async ({
	userId,
	size = 30,
	page = 0,
}: GetNotificationsActionProps) => {
	try {
		if (!userId) throw new Error("userId required");

		const skip = size * page;

		const data = await prisma.notification.findMany({
			where: { userId },
			include: {
				sourceUser: {
					select: {
						id: true,
						username: true,
						imageUrl: true,
					},
				},
				post: {
					select: {
						id: true,
						text: true,
						imageUrl: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take: size,
		});

		const remainingData = await prisma.notification.count({
			where: { userId }
		})
		const hasNext = Boolean(remainingData - data.length - skip);

		return {
			data,
			hasNext
		}
	} catch (error) {
		console.info("[ERROR_GET_NOTIFICATIONS]", error);
	}
};

export const getTotalNotificationsAction = async (userId: string): Promise<number | undefined> => {
	try {
		return await prisma.notification.count({
			where: {
				userId,
				isRead: { not: true }
			}
		})
	} catch (error) {
		console.info("[ERROR_GET_TOTAL_NOTIFICATIONS_ACTION]", error);
	}
}

export const markAsReadNotification = async (
	notificationId: string,
	path: string
) => {
	try {
		if (!notificationId) throw new Error("notificationId required");
		if (!path) throw new Error("path required");

		await prisma.notification.update({
			where: { id: notificationId },
			data: {
				isRead: true,
			},
		});
	} catch (error) {
		console.info("[ERROR_MARK_AS_READ_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

export const markAllNotificationsAsReadAction = async (
	userId: string,
	path: string
) => {
	try {
		if (!userId) throw new Error("userId required");
		if (!path) throw new Error("path required");

		await prisma.notification.updateMany({
			where: { userId },
			data: {
				isRead: true,
			},
		});
	} catch (error) {
		console.info("[ERROR_MARK_ALL_NOTIFICATIONS_AS_READ_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};

export const deleteNotificationAction = async (
	notificationId: string,
	path: string
) => {
	try {
		if (!notificationId) throw new Error("notificationId required");
		
		await prisma.notification.delete({
			where: { id: notificationId },
		});
	} catch (error) {
		console.info("[ERROR_DELETE_NOTIFICATION_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};
