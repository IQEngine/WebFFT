import React from "react";
import CodeBlock from "./CodeBlock";

const components = {
  h1: (props: any) => <h1 {...props} className="prose prose-xl text-gray-800 my-4" />,
  h2: (props: any) => <h2 {...props} className="prose prose-lg text-gray-700 my-4" />,
  h3: (props: any) => <h3 {...props} className="prose prose-lg text-gray-700 my-4" />,
  h4: (props: any) => <h4 {...props} className="prose text-gray-700 my-4" />,
  h5: (props: any) => <h5 {...props} className="prose text-gray-700 my-4" />,
  h6: (props: any) => <h6 {...props} className="prose text-gray-700 my-4" />,
  p: (props: any) => <p {...props} className="prose text-gray-700 my-4" />,
  blockquote: (props: any) => (
    <blockquote {...props} className="prose text-gray-600 italic my-4 border-l-4 border-gray-500 pl-4" />
  ),
  code: (props: any) => (
    <CodeBlock language={props.className?.replace("language-", "") || ""}>{props.children}</CodeBlock>
  ),
};

export default components;
