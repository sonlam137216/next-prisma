import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Tin Tức | Gem Store",
  description: "Khám phá những bài viết mới nhất về phong thủy, đá quý và những câu chuyện thú vị từ chúng tôi",
  openGraph: {
    title: "Blog & Tin Tức | Gem Store",
    description: "Khám phá những bài viết mới nhất về phong thủy, đá quý và những câu chuyện thú vị từ chúng tôi",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 