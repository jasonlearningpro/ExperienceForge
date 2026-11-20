---
name: create-plugin
description: Create or change an ExperienceForge plugin (plugin.json, index.js, guide.md, pictures, zip). Use when someone asks to make a plugin for ExperienceForge, or to add a stage item, animation effect, question type, player button, export step or similar through the plugin API.
---

# Creating an ExperienceForge plugin

ExperienceForge is a Windows app for building eLearning courses (cmi5, SCORM 2004, SCORM 1.2 and web). A plugin is a small add-on made of two plain files, with no build step. The person you are helping may not be a programmer, so use plain words and say what each step does.

`references/plugin-authoring.md` is the single source of truth for the plugin API, the manifest, capabilities and the locked room. **Read it first, every time, and do not work from memory.** The manifest rules are in `references/plugin-manifest.schema.json`. Two working examples are in `references/examples/`: `hello-callout` (a stage item with settings) and `gentle-wobble` (an animation effect).

## Steps

1. **Pin down the plugin.** Ask only what the request leaves open: what it adds, where the course author finds it, and what the learner can do with it. Pick the fewest capabilities that work (`read-assets`, `adds-code-to-exports`, `variables`, `tracking` and so on). Never ask for `network`, `files` or `local-storage` unless nothing else works, and never put an API key or password in a plugin.
2. **Make a folder** named for the plugin with these files:
   - `plugin.json`: `id` (such as `acme.spinner`; never starts with `core.`), `name`, `version`, `apiVersion: 1`, `type`, `capabilities` and `description`. Its `id` and `version` must match the `manifest` inside `index.js`.
   - `index.js`: plain JavaScript that does `window.kfPlugins = (window.kfPlugins || []).concat([{ manifest, activate: function (api) { ... } }])`. No imports.
   - `guide.md` (optional but encouraged): the plugin's own user-guide pages. Each `## Heading` becomes a page. Put pictures in `images/` as PNG files.
3. **Write for the locked room.** A plugin runs in a locked room, so it can only use what the guide lists.
   - Declare every variable with `var`, `let` or `const` (strict mode).
   - Use only language built-ins, timers, `requestAnimationFrame`, `performance.now`, `matchMedia` (it returns `{ matches }` only), and `document.createElement`, `createElementNS` and `createTextNode`. There is no `fetch`, `TextDecoder`, `ResizeObserver`, storage or access to the page.
   - Draw only with the `ctx` you are given. Put text in with `textContent`, never `innerHTML`. Get asset files from `ctx.assetUrl(id)` or `ctx.assetBytes(id)`.
   - Describe settings as data (`text`, `number`, `boolean`, `choice`, `variable`, `asset`, `color`) so the app draws accessible controls. Anything that is a proportion is typed by the author as a percent from 0 to 100.
   - Item ids need a dot (`acme.spinner`).
4. **Accessibility is the plugin's job** (section 7 of the guide, aimed at WCAG 2.1 AA): a name and role for anything a learner can use, keyboard operation, enough contrast (use `ctx.look.palette`), alt text, no meaning carried by color alone, and motion that is off by default, can be paused or stopped, and stays still when `matchMedia('(prefers-reduced-motion: reduce)').matches`. Add a `validation.addRule` check when an author could leave out something a learner needs, such as a description.
5. **Treat files as untrusted.** Course data and learner input can contain anything. Show text as text, and check values before using them.
6. **Check it in ExperienceForge.** Zip `plugin.json`, `index.js`, `guide.md` and `images/` with the files at the top of the zip, named `<id>-<version>.zip`. Tell the person to open ExperienceForge, choose **Help → Plugins → Install and safety → Install from a file**, pick the zip, then tick **Use in this course** for the plugin. If they have no way to run the app, say plainly that you could not test it.
7. **Run Check course** on a course that uses it. It lists the plugin's own rules and any code the plugin adds to published courses.
8. **Report in plain words:** what the plugin does, what was checked and how, and what was not checked (a real LMS, large files, a screen reader, a phone).

## Limits

`plugin.json` is up to 64 KB, `index.js` up to 2 MB, `guide.md` up to 256 KB, and a plugin can carry up to 20 PNG pictures of 1 MB each, all with plain file names.

## Pitfalls

- Apostrophes inside scripts written through a shell heredoc break; write the file with a file tool instead.
- The id and version in `plugin.json` and in the `manifest` of `index.js` must be identical, or the plugin is refused.
- Use US spelling and plain words in anything the author or learner reads.
