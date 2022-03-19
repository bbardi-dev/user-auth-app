import axios, { AxiosRequestHeaders } from "axios";
import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetcher from "../utils/fetcher";

const Home: NextPage = () => {
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/me`, fetcher);

  return (
    <div className={styles.container}>
      <Head>
        <title>User Auth App</title>
      </Head>

      <main className={styles.main}>
        {data ? (
          <div>
            <h2>Current user is: {data.name}</h2>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Home;
