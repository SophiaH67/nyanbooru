import { cloudflareFetch } from "@/lib/cloudsolverr";
import { Tag } from "@/types/Tag";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  tags: Tag[];
};

async function getTags({ search }: { search: string }): Promise<Tag[]> {
  const tags = await cloudflareFetch<Tag[]>(
    `https://danbooru.donmai.us/autocomplete.json?search[query]=${search}&search[type]=tag_query&version=1&limit=20`
  );

  return tags;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const search = req.query.search as string;
  if (!search) {
    res.status(400).json({ tags: [] });
    return;
  }

  const tags = await getTags({ search });

  res.status(200).json({ tags: tags });
}
