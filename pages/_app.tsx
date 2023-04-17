import "@/styles/globals.css";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Nyanbooru - Alternative Danbooru frontend"
        description="Nyanbooru is an alternative frontend for Danbooru, a booru-style imageboard for anime and manga."
        openGraph={{
          title: "Nyanbooru - Alternative Danbooru frontend",
          description:
            "Nyanbooru is an alternative frontend for Danbooru, a booru-style imageboard for anime and manga.",
          images: [
            {
              url: "https://cdn.donmai.us/original/f0/48/f0488be8c1b3e0c2bd93fb7d1d9ef8a5.jpg",
              width: 1091,
              height: 833,
              alt: "Rina Tennouji being cute",
              type: "image/jpeg",
            },
          ],
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
