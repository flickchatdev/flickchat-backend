import { AuthProvider, Prisma } from "@prisma/client";
import prisma from "../prisma/prisma.js";
import { AppError } from "../errors/AppError.js";
import { RESPONSE_MESSAGE } from "../configs/index.js";
import type { GoogleUserPayload } from "../integrations/google/index.js";

class UserRepository {
  findById = async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        authProviders: true,
      },
    });
  };

  findByPhoneNumber = async (phoneNumber: string) => {
    return prisma.user.findUnique({ where: { phoneNumber } });
  };

  findByProvider = async (provider: AuthProvider, providerId: string) => {
    return prisma.userAuthProvider.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: {
        user: {
          include: {
            authProviders: true,
          },
        },
      },
    });
  };

  findByGoogleId = async (googleId: string) => {
    return this.findByProvider(AuthProvider.GOOGLE, googleId);
  };

  findByEmail = async (email: string) => {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      include: {
        authProviders: true,
      },
    });
  };

  findByUsername = async (username: string) => {
    return prisma.user.findUnique({ where: { username } });
  };

  create = async (userData: Prisma.UserCreateInput) => {
    return prisma.user.create({ data: userData });
  };

  update = async (id: string, userData: Prisma.UserUpdateInput) => {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  };

  delete = async (id: string) => {
    return prisma.user.delete({ where: { id } });
  };

  linkAuthProvider = async (
    userId: string,
    provider: AuthProvider,
    providerId: string,
  ) => {
    const existing = await prisma.userAuthProvider.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });

    if (existing) {
      if (existing.userId !== userId) {
        throw new AppError(
          409,
          RESPONSE_MESSAGE.PROVIDER_ALREADY_LINKED,
          "AUTH_ERROR",
        );
      }

      return existing;
    }

    return prisma.userAuthProvider.create({
      data: {
        userId,
        provider,
        providerId,
        isVerified: true,
      },
    });
  };

  createGoogleUser = async (googleUser: GoogleUserPayload, username: string) => {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: googleUser.fullName,
          username,
          email: googleUser.email,
          profilePicture: googleUser.profilePicture,
        },
      });

      await tx.userAuthProvider.create({
        data: {
          userId: user.id,
          provider: AuthProvider.GOOGLE,
          providerId: googleUser.googleId,
          isVerified: true,
        },
      });

      return user;
    });
  };

  updateGoogleProfile = async (
    userId: string,
    data: Pick<GoogleUserPayload, "fullName" | "email" | "profilePicture">,
  ) => {
    const updateData: Prisma.UserUpdateInput = {
      fullName: data.fullName,
      profilePicture: data.profilePicture,
    };

    if (data.email) {
      updateData.email = data.email;
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  };

  createSession = async (data: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    fcmToken?: string;
    deviceId?: string;
    deviceName?: string;
    deviceType?: string;
    platform?: string;
    appVersion?: string;
    osVersion?: string;
    ipAddress?: string;
    userAgent?: string;
  }) => {
    return prisma.userSession.create({
      data,
    });
  };

  findActiveSessionById = async (sessionId: string) => {
    return prisma.userSession.findFirst({
      where: {
        id: sessionId,
        isActive: true,
      },
    });
  };

  findActiveSessionByRefreshToken = async (refreshToken: string) => {
    return prisma.userSession.findFirst({
      where: {
        refreshToken,
        isActive: true,
      },
    });
  };

  updateSession = async (
    sessionId: string,
    data: Prisma.UserSessionUpdateInput,
  ) => {
    return prisma.userSession.update({
      where: { id: sessionId },
      data,
    });
  };

  deactivateSession = async (sessionId: string) => {
    return prisma.userSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
      },
    });
  };
}

export default new UserRepository();
