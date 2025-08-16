/* This is a script to create a new post directory with index.md file */

import fs from "fs";
import path from "path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No directory name argument provided
Usage: npm run new-post -- <directory-name>`);
	process.exit(1);
}

const dirName = args[0];
const targetDir = "./src/content/posts/";
const postDir = path.join(targetDir, dirName);
const indexPath = path.join(postDir, "index.md");

// Check if directory already exists
if (fs.existsSync(postDir)) {
	console.error(`Error: Directory ${postDir} already exists`);
	process.exit(1);
}

// Create the post directory
fs.mkdirSync(postDir, { recursive: true });

const content = `---
title: ${dirName}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---
`;

// Create index.md file in the post directory
fs.writeFileSync(indexPath, content);

console.log(`Post directory ${postDir} created with index.md`);
