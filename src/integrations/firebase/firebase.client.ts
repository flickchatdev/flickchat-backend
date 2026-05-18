import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { ENV, RESPONSE_MESSAGE } from "../../configs/index.js";
import { AppError } from "../../errors/AppError.js";

interface FirebaseTokenVerificationResult {
  uid: string;
  email?: string;
  phoneNumber?: string;
}

const parseFirebaseCredentials = () => {
  return {
    projectId: ENV.FIREBASE_PROJECT_ID,
    clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
    privateKey: ENV.FIREBASE_PRIVATE_KEY,
  };
};

class FirebaseClient {
  private ensureApp = () => {
    if (getApps().length > 0) {
      return;
    }

    const credentials = parseFirebaseCredentials();

    if (
      !credentials.projectId ||
      !credentials.clientEmail ||
      !credentials.privateKey
    ) {
      throw new AppError(
        500,
        RESPONSE_MESSAGE.FIREBASE_CONFIG_MISSING,
        "CONFIG_ERROR",
      );
    }

    initializeApp({
      credential: cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey.replace(/\\n/g, "\n"),
      }),
    });
  };

  verifyIdToken = async (
    token: string,
  ): Promise<FirebaseTokenVerificationResult> => {
    this.ensureApp();

    try {
      const decoded = await getAuth().verifyIdToken(token, true);

      return {
        uid: decoded.uid,
        email: decoded.email,
        phoneNumber: decoded.phone_number,
      };
    } catch {
      throw new AppError(
        401,
        RESPONSE_MESSAGE.INVALID_FIREBASE_TOKEN,
        "AUTH_ERROR",
      );
    }
  };

  verifyFcmToken = async (token: string): Promise<void> => {
    this.ensureApp();

    try {
      await getMessaging().send(
        {
          token,
          data: {
            validation: "true",
          },
        },
        true,
      );
    } catch {
      throw new AppError(401, RESPONSE_MESSAGE.INVALID_FCM_TOKEN, "AUTH_ERROR");
    }
  };
}

export default new FirebaseClient();
