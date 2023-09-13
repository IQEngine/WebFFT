import React, { ReactNode } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeBlockProps {
  language: string;
  children: ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  let content = "";

  if (typeof children === "string") {
    content = children;
  } else if (Array.isArray(children)) {
    content = children.join("\n");
  } else if (React.isValidElement(children)) {
    content = "React Element, please provide a string";
  }
  return (
    <SyntaxHighlighter language={language} style={docco} className="text-left">
      {content}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
