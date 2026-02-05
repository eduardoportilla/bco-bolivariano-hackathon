import { AuthResponseBD } from "./auth-db.reponse";
import { AuthResponse } from "./types";

export class AuthMapper {

    static toAuthResponse(response: AuthResponseBD): AuthResponse {

        return {
            user: {
                id: response.content.infoUser.documentNumber,
                email: response.content.infoUser.email,
                name: response.content.infoUser.fullName,
                phone: response.content.infoUser.phoneNumber,
                avatarUrl: response.content.infoUser.urlProfileImage
            },
            expiresAt: response.content.accessToken,
        };
    }
}