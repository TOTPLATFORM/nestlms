import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { successResponse } from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
@Injectable()
export class AgoraTokenService {
  constructor() {}

  async generateAccessToken(
    channelName: string,
    uid: string,
  ): Promise<ResponseModel> {
    try {
      const appID = 'dd92cc9b60f444119dee217688333add';
      const appCertificate = 'aad97f7df39045ba906cbd238128421a';
      const channelName = 'lol564654646546546'; // Customize as needed
      const uid = 0;

      const expirationTimeInSeconds = 35555500; // Token expiration time (1 hour)

      const role = RtcRole.PUBLISHER; // Adjust the role as needed
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs,
      );
      return successResponse('success', {
        token,
      });
    } catch (error) {
      console.error('Error generating Agora access token:', error);
      throw error;
    }
  }
}
