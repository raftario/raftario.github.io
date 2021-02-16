import Highlight, {
  defaultProps,
  Language,
  PrismTheme,
} from "prism-react-renderer";
import Prism from "prismjs/components/prism-core";
import tailwind from "../../tailwind.config";

(global as any).Prism = Prism;
require("prismjs/components/prism-rust");

export const InlineCode = (params) => (
  <code className="font-code bg-base2 px-1 py-0.5" {...params} />
);
export const CodeBlock = ({
  children,
  className,
}: {
  children: string;
  className: string;
}) => {
  const language = className.replace("language-", "") as Language;

  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={theme}
      Prism={Prism}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} font-code px-4 py-2 w-max min-w-full`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
export const CodeContainer = (params) => (
  <div className="my-4 mx-2 overflow-x-auto" {...params} />
);

export default { InlineCode, CodeBlock, CodeContainer };

const colors = tailwind.theme.colors;
const theme: PrismTheme = {
  plain: {
    backgroundColor: colors.base03,
    color: colors.base0,
  },
  styles: [
    {
      types: ["punctuation"],
      style: {
        color: colors.base1,
      },
    },
    {
      types: ["namespace"],
      style: {
        color: colors.base00,
      },
    },
    {
      types: ["comment"],
      style: {
        color: colors.base01,
      },
    },
    {
      types: ["keyword"],
      style: {
        color: colors.green,
      },
    },
    {
      types: ["string", "char"],
      style: {
        color: colors.cyan,
      },
    },
    {
      types: ["number"],
      style: {
        color: colors.magenta,
      },
    },
    {
      types: ["boolean"],
      style: {
        color: colors.yellow,
      },
    },
    {
      types: ["class-name"],
      style: {
        color: colors.orange,
      },
    },
    {
      types: ["variable", "function", "constant", "tag"],
      style: {
        color: colors.blue,
      },
    },
    {
      types: ["macro"],
      style: {
        color: colors.violet,
      },
    },
    {
      types: ["deleted"],
      style: {
        color: colors.red,
      },
    },
    {
      types: ["inserted"],
      style: {
        color: colors.cyan,
      },
    },
    {
      types: ["changed"],
      style: {
        backgroundColor: colors.base02,
      },
    },
  ],
};
