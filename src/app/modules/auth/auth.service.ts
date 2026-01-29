// import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { jwtHelper } from "../../helper/jwtHealper";
import { prsima } from "../../shared/prisma";
import { ILoginCredintial } from "./auth.interface";

const login = async (credintial: ILoginCredintial) => {
  const user = await prsima.user.findFirstOrThrow({
    where: {
      email: credintial.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(
    credintial.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }

  const accessToken = jwtHelper.generateToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt.secret,
    config.jwt.expires_in_accesstoken,
  );
  const refressToken = jwtHelper.generateToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt.secret,
    config.jwt.expires_in_refresstoken,
  );

  return {
    accessToken,
    refressToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const authService = {
  login,
};
