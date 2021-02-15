import { NextSeo } from "next-seo";
import * as date from "date-fns";

export interface ArticleProps {
  children: React.ReactNode;
  meta: ArticleMetadata;
}

export interface ArticleMetadata {
  title: string;
  description: string;
  published: Date;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export interface MDXProps {
  children: React.ReactNode;
}

const Article = ({
  meta: { title, description, published, authors, section, tags },
  children,
}: ArticleProps) => (
  <>
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        type: "article",
        title,
        description,
        article: {
          publishedTime: published.toISOString(),
          authors: authors || ["Raphaël Thériault"],
          section,
          tags,
        },
      }}
    />
    <header className="bg-base2">
      <p className="text-base1 font-body text-lg">
        <a href="/">Raphaël Thériault</a>&nbsp;/&nbsp;<a href="/blog">Blog</a>
        &nbsp;/&nbsp;{date.format(published, "yyyy-MM-dd")}
      </p>
      <h1 className="text-base01 font-display font-medium text-6xl">{title}</h1>
      <p className="text-base01 font-body font-medium text-lg">{description}</p>
    </header>
    <main className="bg-base3 text-base00 font-body text-base">{children}</main>
  </>
);
export default Article;
