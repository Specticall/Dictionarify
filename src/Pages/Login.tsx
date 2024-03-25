import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Components/Common/Button";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

type TLoginFields = {
  email: string;
  password: string;
};

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<TLoginFields>();
  const onSubmit: SubmitHandler<TLoginFields> = (value) => {
    try {
      loginUser(value.email, value.password);
      navigate("/app/home");
    } catch (err) {
      if (!(err instanceof Error)) return;

      if (err.message === "Login Error : Email not found") {
        setError("email", {
          message: "Email not found",
        });
        return;
      }
      if (err.message === "Login Error: Password does not match") {
        setError("password", {
          message: "Invalid Password",
        });
        return;
      }

      console.log("<Login/>: Unknown error detected!");
    }
  };
  return (
    <main className="grid place-items-center min-h-screen">
      <form
        className="bg-white shadow-xl shadow-accent/10 px-12 py-12 rounded-lg w-full max-w-[32.5rem] mx-auto grid my-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-[1.75rem] text-main font-medium text-center">
          Log in to Your Account
        </h1>
        <p className="text-light text-body mb-10 text-center mt-1 ">
          Login to your dictionarify account
        </p>
        <div className="mt-4 text-main text-body">
          <label>Your Email</label>
          <input
            type="text"
            placeholder="alexia@gmail.com"
            className="mt-3 border-[1px] border-border rounded-md px-6 py-4 w-full"
            style={errors.email && { borderColor: "rgb(239 68 68)" }}
            {...register("email", { required: "Field can't be empty" })}
          />
          <p className="text-red-500 text-end mt-2">{errors.email?.message}</p>
        </div>
        <div className="mt-4 text-main text-body">
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            className="mt-3 border-[1px] border-border rounded-md px-6 py-4 w-full"
            style={errors.password && { borderColor: "rgb(239 68 68)" }}
            {...register("password", { required: "Field can't be empty" })}
          />
          <p className="text-red-500 text-end mt-2">
            {errors.password?.message}
          </p>
        </div>

        <Button className="py-4 mt-8 w-[50%] mx-auto" style="accent">
          Login
        </Button>
        <p className="text-body text-light text-center mt-8">
          Don't have an account?{" "}
          <span
            className="text-accent underline cursor-pointer hover:text-accent/60"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </main>
  );
}
