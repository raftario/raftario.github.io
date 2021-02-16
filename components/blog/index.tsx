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
    <header className="bg-base2 py-12">
      <div className="max-w-screen-sm mx-auto px-2 sm:px-0">
        <p className="text-base1 font-body text-lg my-4">
          <a href="/" className="hover:text-blue">
            Raphaël Thériault
          </a>
          &nbsp;/&nbsp;
          <a href="/blog" className="hover:text-blue">
            Blog
          </a>
          &nbsp;/&nbsp;
          <span className="text-base00">
            {date.format(published, "yyyy-MM-dd")}
          </span>
        </p>
        <h1 className="text-base01 font-display font-medium text-6xl my-4">
          {title}
        </h1>
        <p className="text-base00 font-body font-medium text-lg my-4">
          {description}
        </p>
      </div>
    </header>
    <main className="max-w-screen-sm mx-auto px-2 sm:px-0 my-12">
      {children}
    </main>
  </>
);
export default Article;
