import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import useSWR, { SWRResponse } from "swr";
import styles from "../styles/Home.module.css";
import fetcher from "../utils/fetcher";
import { Data } from "../utils/types";

const Home: NextPage = () => {
  const { data }: { data?: Data } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/me`,
    fetcher
  );

  async function logout(email: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/auth/logout`,
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      return;
    } catch (error) {
      //@ts-ignore
      console.error(error.message);
      return;
    }
  }

  if (data)
    return (
      <div className={styles.container}>
        <Head>
          <title>User Auth App</title>
        </Head>
        <main className={styles.main}>
          <div>
            <h2>Current user is: {data.name}</h2>
            <button onClick={() => logout(data.email)}>Log Out</button>
          </div>
        </main>
      </div>
    );

  return (
    <div className={styles.container}>
      <Head>
        <title>User Auth App</title>
      </Head>

      <main className={styles.main}>
        <div>
          <Link passHref href='/auth/login'>
            <a>Please Log in</a>
          </Link>
          <br />
          <br />
          <br />
          <Link passHref href='/auth/register'>
            <a>Or Register</a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
