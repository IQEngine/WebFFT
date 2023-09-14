import CodeBlock from "./CodeBlock";

const components = {
  h1: (props: any) => <h1 {...props} className="prose-xl !text-cyber-text-secondary my-4" />,
  h2: (props: any) => <h2 {...props} className="prose-lg !text-cyber-text-secondary my-4" />,
  h3: (props: any) => <h3 {...props} className="prose-lg !text-cyber-text-secondary my-4" />,
  h4: (props: any) => <h4 {...props} className="!text-cyber-text-secondary my-4" />,
  h5: (props: any) => <h5 {...props} className="!text-cyber-text-secondary my-4" />,
  h6: (props: any) => <h6 {...props} className="!text-cyber-text-secondary my-4" />,
  p: (props: any) => <p {...props} className="!text-cyber-text my-4" />,
  ul: (props: any) => <ul {...props} className="!text-cyber-text my-4" />,
  li: (props: any) => <li {...props} className="!text-cyber-text my-4" />,
  blockquote: (props: any) => (
    <blockquote {...props} className="!text-gray-600 italic my-4 border-l-4 border-gray-500 pl-4" />
  ),
  code: ({ className, children }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return <CodeBlock language={match ? match[1] : ""}>{String(children).replace(/\n$/, "")}</CodeBlock>;
  },
};

export default components;
