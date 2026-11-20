# Writing an ExperienceForge plugin

A plugin adds something to ExperienceForge: a new kind of item for the stage, a flow step, an animation effect, a question type, a player button, an export step, and more. A plugin is two small files. You do not need to build or bundle anything.

This guide is the one source of truth for plugin authors, whether you write the plugin by hand or ask an AI assistant to write it. The manifest schema is `plugin-manifest.schema.json` (next to this file). Two working examples are in `examples/` (next to this file).

## 1. The two files

Put both files in one folder, or in one zip (the files may sit at the top of the zip or inside one folder):

- `plugin.json` is the manifest (up to 64 KB).
- `index.js` is plain JavaScript (up to 2 MB) that adds the plugin to `window.kfPlugins`.

```js
window.kfPlugins = (window.kfPlugins || []).concat([{
  manifest: { id: 'acme.hello', name: 'Hello', version: '1.0.0', apiVersion: 1 },
  activate: function (api) {
    // register what the plugin adds, using api.stage, api.animation, api.quiz and so on
  }
}]);
```

The `manifest` inside `index.js` must match `plugin.json` (same `id` and `version`).

## 2. The manifest

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Lowercase words joined by dots, such as `acme.fancy-arrows`. It never changes between versions. Ids that start with `core.` are kept for the plugins that come with the app. |
| `name` | yes | What authors see in **Help → Plugins** (up to 80 characters). |
| `version` | yes | `major.minor.patch`, such as `1.0.0`. Courses record the version they were built with. |
| `apiVersion` | yes | The plugin API you wrote for. This version of ExperienceForge is API version `1`. |
| `description` | no | One or two sentences (up to 400 characters). |
| `type` | no | One lowercase word such as `stage` or `export`. Shown to the author only. |
| `capabilities` | no | The sensitive things the plugin needs (section 4). |
| `buildsOn` | no | Ids of plugins this one needs. It is skipped unless they are installed. |
| `downloadUrl` | no | Where to get the plugin: a plain `https` address (up to 300 characters). A course that uses your plugin remembers it, so someone who opens the course without the plugin sees an **Open download page** button in **Help → Plugins…**. |

## 3. The locked room

Your code runs in a locked room. It can use the JavaScript language (`Array`, `Math`, `JSON`, `Date`, `Promise`, `Map` and so on), timers, and the plugin tools the app hands to `activate` and to your functions. It can make new elements with `document.createElement`, `createTextNode` and `createElementNS`.

It cannot see your files, the network, the course page, storage, `window.kf` or anything else in the app. A name that is not allowed is simply `undefined`. It can ask whether the device wants less motion with `matchMedia('(prefers-reduced-motion: reduce)').matches` (that is all `matchMedia` gives back), and animate with `requestAnimationFrame`. It can make a `canvas` element and draw on it, with 2D or WebGL, so a plugin can draw 3D (the `3D model viewer` plugin does); libraries that look for browser names the room hides, such as three.js, do not run unchanged.

Two practical rules follow:

- **Write strict-mode safe code.** Declare every variable with `var`, `let` or `const`. A plugin that sets an undeclared variable fails to start.
- **Draw with the `ctx` you are given.** When your item or panel is drawn, use `ctx.doc` to make elements, and show text with `textContent`, never `innerHTML`. Text from a course is untrusted.

The locked room is not a hard wall. Authors are told to keep only plugins they trust, and you should write as if your code will be read.

## 4. Capabilities

List a capability in `plugin.json` when the plugin needs it. The plugin API refuses a call that needs one you did not list, and says which one to add.

| Capability | Lets the plugin |
| --- | --- |
| `variables` | read and change the course variables |
| `tracking` | send results to the LMS and read the learner record |
| `read-assets` | use the course's images, sounds and files |
| `read-course-text` | read the text of the course |
| `files` | read or write files on this computer (sensitive) |
| `network` | contact other computers on the internet (sensitive) |
| `adds-code-to-exports` | put its own code in published courses (sensitive) |
| `local-storage` | save data in the learner's browser (sensitive) |

Ask for as little as you can. Authors see the list next to your plugin and decide whether to use it.

## 5. What a plugin can add

Everything goes through `api` in `activate`. A plugin's own ids need a dot (`acme.spinner`) so they cannot clash with built-in ones.

| Where | What you add |
| --- | --- |
| `api.stage.addElement` | A new kind of item on a screen. Draws text only. |
| `api.nodes.add` | A new step on the Flow Canvas. |
| `api.animation.addPreset`, `addEasing`, `addProperty` | An effect, an easing curve, or a property that can be keyframed. |
| `api.text.addDecorator` | Marks words in text (a glossary does this). |
| `api.player.addControl`, `addPanel`, `addPreset` | A player button, a side panel, or a player look. |
| `api.quiz.addScoring`, `addResultsLayout`, `addQuestionType` | A way to score, a results look, a kind of question. |
| `api.quiz.addQuestionField` | A field on every question (or some kinds): an objective, a level, a standard. The app draws the control and keeps the value with the question. |
| `api.quiz.addDrawRule` | A way of choosing which questions a quiz asks, with its own settings on the quiz step. |
| `api.data.addList` | A list kept with the course (objectives, standards...) with an editor the app draws, opened from its own button under Build named for the list. |
| `api.audio.addTranscriber`, `addCaptionFormat`, `addCaptionStyle` | Speech to captions, caption file formats, caption looks. |
| `api.assets.addSource`, `addConverter` | A place to find images or sounds, and file converters. |
| `api.theme.addMaster`, `addFont`, `addBackground` | A ready-made master, a font, a screen background. |
| `api.templates.add`, `addQuizPage` | Starting screens and quiz page designs. |
| `api.validation.addRule` | A check in **Check course** and before publishing. |
| `api.triggers.addWhen`, `addAction`, `raise` | Things that start a trigger, and things a trigger can do. |
| `api.interactions.add` | A ready-made interaction recipe. |
| `api.export.addTarget`, `addStep` | A kind of package, or a step that runs on the finished package. |
| `api.events.on` | Watch what the learner does (read-only). |
| `api.shapes.add`, `addToGallery` | Shapes for the shape library. |

The built-in plugins use the same API, so their source in `packages/engine/src/core-plugins/` shows working code for each point.

### Your pages for the user guide

A plugin can carry its own how-to for the **Help → User guide** window. Put these in the plugin's zip or folder next to `plugin.json` and `index.js`:

- `guide.md`: plain Markdown. Each `## Heading` is one page of the guide. Use paragraphs, bullet and numbered lists, tables, **bold**, *italic* and `code`. A `# Title` line is ignored, because the guide shows your plugin's name for you.
- `images/`: PNG pictures. In `guide.md`, put a picture on a line of its own, `![What the picture shows](images/name.png)`, and always say what it shows: the words are the alt text and are searched.

Your pages show after the app's own sections, under *Plugin: your plugin's name*, whenever your plugin is installed. Limits: `guide.md` up to 256 KB, up to 20 pictures of up to 1 MB each, with plain names (letters, digits, dot, dash, underscore). Anything too big, not text, or not a real PNG is left out, and your plugin still loads. Nothing in a guide is ever run: links are shown as their words only, and HTML is shown as text. The **Objectives** plugin in `plugins/objectives` and the **3D model viewer** in `plugins/model-viewer` are examples.

### Fields, lists and draw rules for quizzes

These three go together. The **Objectives** plugin in `plugins/objectives` uses all of them and is the best example.

```js
api.data.addList({
  id: 'acme.objectives', label: 'Objectives', itemLabel: 'Objective',
  fields: [{ kind: 'text', key: 'text', label: 'The objective', default: '' }],
});
api.quiz.addQuestionField({
  id: 'acme.objectives', label: 'This question tests',
  setting: { kind: 'multi', fromList: 'acme.objectives' },   // or options: [{ value, label }]
});
api.quiz.addDrawRule({
  id: 'acme.by-objective', label: 'A set number from each objective',
  settings: [{ kind: 'number', key: 'each', label: 'From each', default: 2, min: 1, max: 20 }],
  draw(ctx) {
    // ctx.pool: [{ id, category, ext }]  ctx.count (0 = all)  ctx.settings  ctx.list(listId)  ctx.random()
    return ctx.pool.map(function (q) { return q.id; }).slice(0, ctx.count || undefined);
  },
});
```

- **A list** holds rows of `{ id, values }`. A row's `id` stays the same when the author edits it; refer to a row by it. Columns are text, number, yes/no, choice and color settings.
- **A question field** is one setting. `multi` is "pick several": give it `options`, or `fromList` to use the rows of a list. The value on the question is checked every time it is read, so a deleted row drops out.
- **A draw rule** gets the pool without the wording of the questions and returns the ids to ask. What you return is cleaned (ids in the pool, once each, no more than asked). If your rule throws, or picks nothing, the quiz chooses the usual way.
- **Results and checks:** `addResultsLayout`'s `render(ctx)` also gets `ctx.answers` (each with `id`, `correct`, `points`, `possible` and `ext`, the question's checked field values) and `ctx.list(id)`. `addRule`'s `check(project, ctx)` gets `ctx.questions` and `ctx.list(id)`. Draw charts with native elements and give them a text version.

Every item you add can have a drop shadow, with nothing to do on your side: the author gets **Shadow** in Properties and in the item's tools, and the app draws it on your item's box. If your item draws nothing, set `shadow: false` on its type to hide the controls. If your `render` draws parts of its own that should match (a card inside the item, say), call `ctx.shadowCss({ on: true, x: 2, y: 3, blur: 6, opacity: 0.3 })`. It returns a CSS `drop-shadow(...)` in the course's colors, or `undefined` when the shadow is off or not usable, and you put it in an element's `style.filter`.

Anything an author sets in the Inspector is described as data (`settings`): text, number, yes/no, choice, variable, asset or color. An `asset` setting is for an image, a sound, or a 3D model (`assetKind: 'image'`, `'audio'` or `'model'`). A stage item can draw a picture or sound with `ctx.assetUrl(id)`, and read any asset's bytes with `ctx.assetBytes(id)`, which gives a promise of a `Uint8Array` (or `undefined` if the asset is missing). That is how a 3D viewer reads a `.glb` or `.stl`; a plugin cannot fetch files itself. Describe your settings rather than drawing your own form, so authors get accessible, labeled controls for free.

## 6. Two working examples

- `examples/hello-callout/` adds a stage item with a heading and text. It shows `settings`, `ctx.interpolate` and drawing text safely.
- `examples/gentle-wobble/` adds an animation effect.

To try one: copy its folder into the plugins folder (**Help → Plugins… → Open plugins folder**), choose **Look again**, then tick **Use in this course**. Or zip it and use **Install from a file…**.

## 7. Accessibility is part of the plugin

Anything a learner sees or does must meet WCAG 2.1 AA. The app checks what it can, but a plugin must do the rest:

- **Text and contrast.** Use the colors from `ctx.look` where you can. Normal text needs a 4.5:1 contrast ratio and large text 3:1.
- **Names and roles.** If an item can be used (pressed, dragged, typed in), it needs a name a screen reader can read and must work with the keyboard alone. Items that act as buttons get their role, Tab stop, Enter and Space handling and focus ring from the app. Do not rebuild those.
- **Pictures** need alt text or must be marked decorative.
- **Motion and flashing.** Keep movement small and never flash more than three times a second. Do not start motion that cannot be paused.
- **Do not rely on color alone** to carry meaning.
- **Time limits** must be adjustable or switch-off-able.

## 8. Never put an API key in a plugin

A plugin's code is copied into every course that uses it, and anyone who opens the course can read it. Do not embed API keys, passwords or tokens. If your plugin needs a service, let the author type their own key in a setting and tell them it will be visible to learners, or send requests through a service the author controls.

## 9. What authors see when they publish

Before a course is published, the checks report:

- **VAL-W36:** each community plugin that puts its own code in the course.
- **VAL-W37:** code that mentions web addresses or calls such as `fetch` that can contact other computers. Many learning systems block those.
- **VAL-W18 and VAL-W19:** a plugin the course uses whose code was not supplied, or was left out.
- **VAL-W35:** an item or node that needs a plugin that is not installed.

Opening a course never changes it. If a plugin is missing, its items stay in the course with their settings intact and show **Needs plugin…** until it is installed.
