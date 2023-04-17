import { Post } from "@/types/Post";
import { Card, Image, Tag } from "antd";
import Link from "next/link";

export function PostCard({
  post,
  addTag,
}: {
  post: Post;
  addTag: (tag: string) => void;
}) {
  const characterTags = post.tag_string_character.split(" ");
  const artistTags = post.tag_string_artist.split(" ");
  const generalTags = post.tag_string_general.split(" ");
  const copyrightTags = post.tag_string_copyright.split(" ");

  function onClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();

    addTag(e.currentTarget.innerText);
  }

  return (
    <Link
      href={`https://danbooru.donmai.us/posts/${post.id}`}
      key={post.id}
      style={{
        width: "24rem",
        margin: "1rem",
      }}
    >
      <Card
        hoverable
        cover={
          <Image
            src={post.large_file_url}
            alt={post.tag_string_character}
            fallback={post.preview_file_url}
            onClick={(e) => {
              e.preventDefault();
              // We don't stop propagation because we want to still have antd's image preview
              //   e.stopPropagation();
            }}
          ></Image>
        }
      >
        <Card.Meta
          title="Tags"
          description={
            <>
              {artistTags.map((tag) => (
                <Tag key={tag} color="green" onClick={onClick}>
                  {tag}
                </Tag>
              ))}

              {copyrightTags.map((tag) => (
                <Tag key={tag} color="gold" onClick={onClick}>
                  {tag}
                </Tag>
              ))}
              {characterTags.map((tag) => (
                <Tag key={tag} color="pink" onClick={onClick}>
                  {tag}
                </Tag>
              ))}
              {generalTags.map((tag) => (
                <Tag key={tag} color="blue" onClick={onClick}>
                  {tag}
                </Tag>
              ))}
            </>
          }
        />
      </Card>
    </Link>
  );
}
