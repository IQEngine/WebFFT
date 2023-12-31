import React from "react";
import CodeBlock from "./CodeBlock";

interface CustomParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const CustomParagraph: React.FC<CustomParagraphProps> = (props) => {
  const { children } = props;

  const hasCodeElement = React.Children.toArray(children).some((child) => {
    return React.isValidElement(child) && child.type === "code";
  });

  return hasCodeElement ? (
    <div
      {...props}
      className="!font-system text-cyber-text"
      aria-label="Contains Code Element"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === "code") {
          return child; // Simply return the code child without wrapping it again
        }
      })}
    </div>
  ) : (
    <span {...props} className="!font-system text-cyber-text">
      {children}
    </span>
  );
};

const components = {
  h1: (props: any) => (
    <h1 {...props} className="!font-system !text-cyber-text-secondary my-4" />
  ),
  h2: (props: any) => (
    <h2 {...props} className="!font-system !text-cyber-text-secondary my-4" />
  ),
  h3: (props: any) => (
    <h3 {...props} className="!font-system !text-cyber-text-secondary my-4" />
  ),
  h4: (props: any) => (
    <h4 {...props} className="!font-system !text-cyber-text-secondary my-4" />
  ),
  h5: (props: any) => (
    <h5 {...props} className="!font-system !text-cyber-text-secondary my-4" />
  ),
  h6: (props: any) => (
    <h6 {...props} className="!font-system !text-cyber-text-secondary my-4" />
  ),
  ul: (props: any) => (
    <ul {...props} className="!font-system !text-cyber-text my-4" />
  ),
  li: (props: any) => (
    <li {...props} className="!font-system !text-cyber-text my-4" />
  ),
  a: (props: any) => (
    <a {...props} className="!font-system !text-cyber-secondary" />
  ),
  blockquote: (props: any) => (
    <blockquote
      {...props}
      className="!font-system !text-gray-600 italic my-4 border-l-4 border-gray-500 pl-4"
      aria-label="blockquote"
    />
  ),
  code: ({ className, children }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return (
      <CodeBlock
        language={match ? match[1] : ""}
        aria-label="Code Block with Syntax Highlighting"
      >
        {String(children).replace(/\n$/, "")}
      </CodeBlock>
    );
  },
  p: CustomParagraph,
};

export default components;
