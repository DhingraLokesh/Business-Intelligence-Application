import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../config-variables/index.js";
import { getUserById } from "../../services/user.service.js";

const jwtOptions = {
  secretOrKey : config.jwt.secret,
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try{
    const user = await getUserById(payload.userId);
    
    if(!user)
      return done(null, false);
    done(null, user);
  }catch(err){
    done(err, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };