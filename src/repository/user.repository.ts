import { AuthProvider, Prisma } from "@prisma/client";
import prisma from "../prisma/prisma.js";
import type { GoogleUserPayload, DeviceInfo } from "../integrations/google/index.js";

class UserRepository {
  findById = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  };

  findByGoogleId = async (googleId: string) => {
    return prisma.userAuthProvider.findUnique({
      where: {
        provider_providerId: {
          provider: AuthProvider.GOOGLE,
          providerId: googleId,
        },
      },
      include: { user: true },
    });
  };

  findByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
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

  linkGoogleProvider = async (userId: string, googleId: string) => {
    return prisma.userAuthProvider.create({
      data: {
        userId,
        provider: AuthProvider.GOOGLE,
        providerId: googleId,
        isVerified: true,
      },
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

  createSession = async (userId: string, refreshToken: string, device?: DeviceInfo) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return prisma.userSession.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
        deviceId: device?.deviceId,
        deviceName: device?.deviceName,
        deviceType: device?.deviceType,
        platform: device?.platform,
        appVersion: device?.appVersion,
        osVersion: device?.osVersion,
        fcmToken: device?.fcmToken,
        ipAddress: device?.ipAddress,
        userAgent: device?.userAgent,
      },
    });
  };
}

export default new UserRepository();
