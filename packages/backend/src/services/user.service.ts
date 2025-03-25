import { db } from "../db/index.js";

const UserService = () => {
  const createUser = async (authId: string) => {};

  const getUserById = async (authId: string) => {};

  return {
    createUser,
    getUserById,
  };
};

export default UserService();
