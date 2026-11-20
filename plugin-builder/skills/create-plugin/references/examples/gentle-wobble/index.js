// An animation effect. `apply` is given how far through the effect we are (0 to 1) and returns how far to move, turn, scale and fade.
// Keep movement small: the course checks flag effects that flash or move a lot (WCAG 2.1 AA, 2.3.1 and 2.2.2).
window.kfPlugins = (window.kfPlugins || []).concat([{
  manifest: { id: 'example.gentle-wobble', name: 'Gentle wobble', version: '1.0.0', apiVersion: 1 },
  activate: function (api) {
    api.animation.addPreset({
      id: 'example.wobble', label: 'Gentle wobble', phase: 'emphasis', duration: 1,
      apply: function (eased) { return { rot: Math.sin(eased * Math.PI * 2) * 4 }; }
    });
  }
}]);
