---
# Controls where this document shows up in the sidebar
sidebar_position: 1
---
# About These Docs

This documentation serves to act as a knowledgebase for all within 
Argos 1756 (or others) to reference in order to lean about the First Robotics 
Competition (FRC) and it's control system.

This site was built with [Docusaurus](https://docusaurus.io/). To get the best
understanding of what features are available to you, make sure to read the 
[docusaurus docs](https://docusaurus.io/docs/docs-introduction)

Note that docusaurus gives you the option to [create pages using react](https://docusaurus.io/docs/creating-pages#add-a-react-page)
which is very powerful because you can essentially make this documentation site a "normal" website
as well.

## Adding to the Documentation

You can either add files to the `docs/` directory or the `blog/` directory to 
create content on the webpage. In both of these cases, it is recommended to
copy an existing file and use it as a format for your syntax. This is particularly
true for blog posts, as the files are named specifically to contain the date.

Documentation can be written in **Markdown** (.md) or **MDX** (.mdx). 

Additions to both of these directories will populate automatically.

## Controlling Position of Doc Files

You can control the position of the file in the sidebar by adding this
to the top of the file:

```
---
sidebar_position: 1
---
```

This example would make this file the first entry in the sidebar. Note this
also works inside of sub-categories in the sidebar (see `docs/XRP WPILib/index.md`
for an example)

## Hiding the Table of Contents

Add the following to the frontmatter (top of your document) to hide the table
of contents

```
---
hide_table_of_contents: true
---
```

## Organizing Into Folders

If you choose to make a subdirectory under `docs/` to contain images for a specific
documentation entry, make sure to name the file "index.md" to prevent the subdirectory
from becoming a category in the sidebar. (reference XRP robots to see example)

To make a group, add a subdirectory under `docs/`