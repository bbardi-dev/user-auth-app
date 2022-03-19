import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/router";

const createUserSchema = object({
  name: string().nonempty({
    message: "Firstname required",
  }),
  password: string()
    .nonempty({
      message: "Password required",
    })
    .min(6, "Password should be a minimum of 6 characters"),
  passwordConfirmation: string({
    required_error: "Password confirmation required",
  }),
  email: string()
    .nonempty({
      message: "Email required",
    })
    .email("Not a valid email"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Password do not match",
  path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

export default function Register() {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<any>(null);

  const onFormSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    setSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/create`,
        data
      );
      console.log(response);
      router.push("/");
    } catch (error) {
      //@ts-ignore
      setRegisterError(error.message);
    } finally {
      reset();
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Register Here!</h1>
      <h5>{registerError}</h5>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <label htmlFor='email'>Email</label>
          <input id='email' type='email' placeholder='test@test.com' {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor='name'>Name</label>
          <input id='name' type='text' {...register("name")} />
          <p>{errors.name?.message}</p>
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input id='password' type='password' {...register("password")} />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label htmlFor='passwordConfirmation'>Confirm your Password</label>
          <input id='passwordConfirmation' type='password' {...register("passwordConfirmation")} />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button disabled={submitting} type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
}
