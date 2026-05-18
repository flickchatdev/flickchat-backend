export interface GoogleUserPayload {
  googleId: string;
  email: string;
  fullName: string;
  profilePicture?: string;
}

export interface DeviceInfo {
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  platform?: string;
  appVersion?: string;
  osVersion?: string;
  fcmToken?: string;
  ipAddress?: string;
  userAgent?: string;
}
