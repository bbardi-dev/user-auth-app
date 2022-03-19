import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/router";

const loginUserSchema = object({
  password: string()
    .nonempty({
      message: "Password required",
    })
    .min(6, "Password should be a minimum of 6 characters"),
  email: string()
    .nonempty({
      message: "Email required",
    })
    .email("Not a valid email"),
});

type LoginUserInput = TypeOf<typeof loginUserSchema>;

export default function Login() {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<any>(null);

  const onFormSubmit: SubmitHandler<LoginUserInput> = async (data) => {
    setSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/auth`, data, {
        withCredentials: true,
      });
      console.log(response);
      router.push("/");
    } catch (error) {
      //@ts-ignore
      setLoginError(error.message);
    } finally {
      reset();
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <h5>{loginError}</h5>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <label htmlFor='email'>Email</label>
          <input id='email' type='email' placeholder='test@test.com' {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input id='password' type='password' {...register("password")} />
          <p>{errors.password?.message}</p>
        </div>
        <button disabled={submitting} type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
}
