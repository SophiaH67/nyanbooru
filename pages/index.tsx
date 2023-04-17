import { DebounceSelect } from "@/components/DebounceSelect";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/Post";
import { Tag } from "@/types/Tag";
import Link from "next/link";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-component";

async function fetchTags(search: string) {
  const tags = await fetch(`/api/tags?search=${search}`);
  const data = await tags.json();
  return data.tags as Tag[];
}
export default function Home() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function doStuff() {
      const tagsFlatClone = tags.map((tag) => tag.value).join("+");
      const res = await fetch(`/api/posts?tags=${tagsFlatClone}`);
      const data = await res.json();
      // Check if tags are still the same
      if (tagsFlatClone === tags.map((tag) => tag.value).join("+")) {
        setPosts(data.posts);
      } else {
        console.warn("Tags changed, not updating posts");
      }
    }

    doStuff();
  }, [tags]);

  return (
    <>
      <DebounceSelect
        mode="multiple"
        value={tags}
        placeholder="Select tags"
        fetchOptions={fetchTags}
        onChange={(newValue) => {
          setTags(newValue as Tag[]);
        }}
        className="w-full"
        status={tags.length < 2 ? "error" : ""}
      />
      {tags.length < 2 ? (
        <>
          <h1 className="text-center text-gray-700 text-5xl mt-[40vh]">
            How to use
          </h1>
          <p className=" mx-auto max-w-xl mt-4 text-center text-gray-500">
            Select two or more tags to see posts. The first two tags are
            submitted to danbooru.donmai.us, the rest will be filtered
            server-side. Cloudflare bypass is provided by{" "}
            <Link
              href="https://github.com/FlareSolverr/FlareSolverr"
              className="text-blue-500"
            >
              FlareSolverr
            </Link>
            .
          </p>
        </>
      ) : (
        <>
          {/*@ts-expect-error - I love the half-arsed typing in this library!*/}
          <Masonry className="relative">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                addTag={(tag) => {
                  setTags([
                    ...tags,
                    {
                      label: tag,
                      value: tag,
                      category: 0,
                      post_count: 0,
                      type: "tag-word",
                    },
                  ]);
                }}
              />
            ))}
          </Masonry>
        </>
      )}
    </>
  );
}
