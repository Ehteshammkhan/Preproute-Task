import api from "./axios";

export const loginUser = async (
  userId: string,
  password: string
) => {
  const response = await api.post(
    "/auth/login",
    {
      userId,
      password,
    }
  );

  return response.data;
};