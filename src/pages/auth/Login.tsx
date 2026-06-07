import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "../../components/ui";
import { loginSchema } from "../../validations/auth.schema";
import type { LoginFormData } from "../../validations/auth.schema";
import { loginUser } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { errorToast, successToast, getApiError } from "../../utils";

import testTubeMen from "../../assets/Images/testTubeMen.png";
import preProuteLogo from "../../assets/Images/preProuteLogo.png";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data.userId, data.password);

      login(response.data.token, response.data.user);

      successToast("Login successful");

      navigate("/dashboard");
    } catch (error) {
      errorToast(getApiError(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef4fa] px-6 py-8">
      <div className="grid h-[720px] w-full max-w-[1180px] grid-cols-1 overflow-hidden rounded-md bg-white md:grid-cols-2">
        <div className="hidden items-center justify-center bg-[#f3f8fd] md:flex">
          <img
            src={testTubeMen}
            alt="Login Illustration"
            className="w-[420px] max-w-[80%]"
          />
        </div>

        <div className="flex items-center justify-center border border-blue-100 bg-white px-8">
          <div className="w-full max-w-[420px]">
            <img
              src={preProuteLogo}
              alt="PrepRoute Logo"
              className="w-[150px] max-w-[80%]"
            />
            <h2 className="text-lg font-semibold text-gray-900">Login</h2>

            <p className="mt-3 text-xs text-gray-500">
              Use your company provided Login credentials
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="User ID"
                placeholder="Enter User ID"
                error={errors.userId?.message}
                {...register("userId")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter Password"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="button"
                  className="w-fit text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
