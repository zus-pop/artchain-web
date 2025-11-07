"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  CodeToggle,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef, useEffect } from "react";

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

export const MDXEditorWrapper = forwardRef<
  MDXEditorMethods,
  MDXEditorWrapperProps
>(({ markdown, onChange, placeholder }, ref) => {
  useEffect(() => {
    if (ref && "current" in ref && ref.current && markdown) {
      try {
        // Try to set the markdown content programmatically
        ref.current.setMarkdown(markdown);
      } catch (error) {
        console.log("Could not set markdown programmatically:", error);
      }
    }
  }, [markdown, ref]);

  return (
    <div className="mdx-editor-wrapper border border-[#e6e2da]">
      <MDXEditor
        ref={ref}
        markdown={markdown}
        onChange={onChange}
        placeholder={placeholder}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              txt: "Plain Text",
              tsx: "TypeScript",
              ts: "TypeScript",
              python: "Python",
              java: "Java",
            },
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <CreateLink />
                <InsertImage />
                <Separator />
                <ListsToggle />
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
                <Separator />
                <CodeToggle />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
});

MDXEditorWrapper.displayName = "MDXEditorWrapper";
