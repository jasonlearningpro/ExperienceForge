# ExperienceForge plugin builder for Claude

Helps Claude write, check and package a plugin for [ExperienceForge](https://github.com/jasonlearningpro/ExperienceForge). A plugin is a small add-on that gives the app a new ability, such as a new stage item, an animation effect, a question type, a player button or an export step.

## Install

In Claude Code, add the marketplace once, then install the plugin:

```text
/plugin marketplace add jasonlearningpro/ExperienceForge
/plugin install experienceforge-plugin-builder@experienceforge
```

## Use

Ask Claude for what you want, for example: "Make an ExperienceForge plugin that adds a countdown timer item." Claude reads the plugin guide, asks what it needs, writes `plugin.json` and `index.js`, and zips the plugin. Install the zip in ExperienceForge under **Help → Plugins → Install and safety → Install from a file**.

## What is inside

- `skills/create-plugin/SKILL.md`: the steps Claude follows.
- `skills/create-plugin/references/plugin-authoring.md`: the plugin guide (the API, the manifest, capabilities, the locked room, accessibility).
- `skills/create-plugin/references/plugin-manifest.schema.json`: the manifest rules.
- `skills/create-plugin/references/examples/`: two working plugins.
