/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';
import { FiUser, FiCalendar } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  // TODO
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function pagination() {
    const response = await fetch(postsPagination.next_page).then(response =>
      response.json()
    );

    const [results] = response.results;

    setPosts([...posts, results]);
    setNextPage(null);
  }

  return (
    <main className={styles.postsContainer}>
      {posts.map(post => (
        <Link href={`/post/${post.uid}`} key={post.uid}>
          <a className={styles.post}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>
            <div>
              <span>
                <FiCalendar size={20} />
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </span>
              <span>
                <FiUser size={20} />
                {post.data.author}
              </span>
            </div>
          </a>
        </Link>
      ))}

      {nextPage !== null ? (
        <button className={styles.more} onClick={() => pagination()}>
          Carregar mais posts
        </button>
      ) : (
        ''
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  // console.log(postsResponse);

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
