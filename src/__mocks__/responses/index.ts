import signin from "./signin.json";
import users from "./users.json";

import { apiRoutes } from "../routes/apiRoutes";

export default {
  [apiRoutes.signin]: signin,
  [apiRoutes.users]: users,
};
