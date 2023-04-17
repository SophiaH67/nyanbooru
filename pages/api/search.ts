// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from "@/types/Post";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  posts: Post[];
};

async function cloudflareFetch<T>(url: string): Promise<T> {
  const response = await fetch(process.env.FLARESOLVERR_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cmd: "request.get",
      maxTimeout: 60000,
      url,
    }),
  });

  const flaresolverResponse = await response.json();
  let data = flaresolverResponse.solution.response;
  //   Get rid of the chrome garbage html around the json
  data = data.substring(data.indexOf("["), data.lastIndexOf("]") + 1);

  return JSON.parse(data) as T;
}

async function getPosts({
  tags,
  limit = 200,
  page = 1,
}: {
  tags: string[];
  limit?: number;
  page?: number;
}): Promise<Post[]> {
  const posts = await cloudflareFetch<Post[]>(
    `https://danbooru.donmai.us/posts.json?tags=${tags.join(
      "+"
    )}&limit=${limit}&page=${page}`
  );

  return posts;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get tags from query string
  const tagsStr = req.query.tags as string;
  if (!tagsStr) {
    res.status(400).json({ posts: [] });
    return;
  }

  const tags = tagsStr.split(" ");
  const firstTwoTags = tags.slice(0, 2);

  let posts: Post[] = [];

  //   While the length of the posts array is divisible by 200, keep fetching posts
  let lastLength = -1;
  while (posts.length % 200 === 0 && posts.length !== lastLength) {
    lastLength = posts.length;

    const newPosts = await getPosts({
      tags: firstTwoTags,
      limit: 200,
      page: posts.length / 200 + 1,
    });

    posts = [...posts, ...newPosts];
  }

  //   Filter out posts that don't have all the tags
  posts = posts.filter((post) => {
    const postTags = post.tag_string_general.split(" ");
    postTags.push(...post.tag_string_character.split(" "));
    postTags.push(...post.tag_string_copyright.split(" "));
    postTags.push(...post.tag_string_artist.split(" "));
    postTags.push(...post.tag_string_meta.split(" "));
    return tags.every((tag) => postTags.includes(tag));
  });

  res.status(200).json({ posts });
}
