# Resources

Reference materials for AI agents and developers.

## Structure

```
resources/
├── apis/          # API documentation, OpenAPI specs
├── designs/       # UI designs, screenshots, mockups
├── diagrams/      # Architecture diagrams, flows
└── references/    # External docs, guides
```

## Usage

Add files the agent should reference in prompts:

- Tag with `@docs/resources/[file]` in chat
- Agent can read these for context

## Tips

- Keep files focused and descriptive
- Use markdown for text, images for designs
- Reference in prompts when relevant
