# Ripple — Architecture

## What it does-
Ripple watches your GitHub PRs and tells you exactly what will 
break before you merge. It parses your code's structure, maps 
every dependency, and traces the ripple effect of any change.

## Core components-
- Webhook server (Express + Node.js)
- AST parser (@babel/parser)
- Import/Export Registry
- BFS blast radius engine
- Redis job queue (BullMQ)
- RAG pipeline (Chroma + Claude API)
- Next.js dashboard

## Stack decisions
- Babel over Tree-sitter: pure JS, no native deps
- BullMQ over in-memory queue: persistence + auto retry
- Chroma locally, pgvector on deploy