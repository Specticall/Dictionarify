import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Components/Common/Button";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

type TRegisterFields = {
  email: string;
  password: string;
  repeatPassword: string;
};

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<TRegisterFields>();
  const onSubmit: SubmitHandler<TRegisterFields> = (value) => {
    try {
      if (value.password !== value.repeatPassword) {
        setError("repeatPassword", {
          message: "Password does not match",
        });
      }
      registerUser(value.email, value.password);

      navigate("/login");
    } catch (err) {
      if (
        !(err instanceof Error) ||
        err.message !== "Register: 'Email already exist'"
      )
        return;

      setError("email", {
        message: "Email already exist",
      });
    }
  };

  return (
    <main className="grid place-items-center min-h-screen">
      <form
        className="bg-white shadow-xl shadow-accent/10 px-12 py-12 rounded-lg w-full max-w-[32.5rem] mx-auto grid my-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-[1.75rem] text-main font-medium text-center">
          Create an Account
        </h1>
        <p className="text-light text-body mb-10 text-center mt-1 ">
          Register your new dictionarify account today
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
        <div className="mt-4 text-main text-body">
          <label>Repeat Password</label>
          <input
            type="password"
            placeholder="********"
            className="mt-3 border-[1px] border-border rounded-md px-6 py-4 w-full"
            style={errors.repeatPassword && { borderColor: "rgb(239 68 68)" }}
            {...register("repeatPassword", {
              required: "Field can't be empty",
            })}
          />
          <p className="text-red-500 text-end mt-2">
            {errors.repeatPassword?.message}
          </p>
        </div>
        <Button className="py-4 mt-8 w-[50%] mx-auto" style="accent">
          Register
        </Button>
        <p className="text-body text-light text-center mt-8">
          Already have an account?{" "}
          <span
            className="text-accent underline cursor-pointer hover:text-accent/60"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </main>
  );
}
