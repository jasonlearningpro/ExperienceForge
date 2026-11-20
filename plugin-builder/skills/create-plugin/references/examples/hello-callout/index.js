// A stage item. It draws text only, with the colors from the course's look, so it stays readable (WCAG 2.1 AA: keep contrast
// at 4.5:1 for normal text; the look's own text and background colors already meet that).
window.kfPlugins = (window.kfPlugins || []).concat([{
  manifest: { id: 'example.hello-callout', name: 'Hello callout', version: '1.0.0', apiVersion: 1, capabilities: ['variables'] },
  activate: function (api) {
    api.stage.addElement({
      type: 'example.callout', label: 'Callout', icon: 'C', idPrefix: 'cal', size: { w: 420, h: 140 },
      settings: [
        { kind: 'text', key: 'heading', label: 'Heading', default: 'Good to know', maxLength: 80 },
        { kind: 'text', key: 'body', label: 'Text', default: 'Type your note here. You can show a variable like {{score}}.', multiline: true, maxLength: 400 },
      ],
      create: function (id) { return { id: id, type: 'example.callout' }; },
      summary: function (el) { return 'Callout'; },
      render: function (el, ctx) {
        var box = ctx.doc.createElement('div');
        box.style.cssText = 'box-sizing:border-box;width:100%;height:100%;padding:16px;border-left:6px solid currentColor;background:rgba(0,0,0,0.06);overflow:hidden';
        var h = ctx.doc.createElement('strong');
        h.textContent = ctx.interpolate(ctx.settings.heading); // text only: never markup
        var p = ctx.doc.createElement('p');
        p.style.margin = '8px 0 0';
        p.textContent = ctx.interpolate(ctx.settings.body);
        box.append(h, p);
        return box;
      }
    });
  }
}]);
