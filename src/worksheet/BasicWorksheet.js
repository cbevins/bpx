
export default function basicWorksheet(dag) {
  const { tree } = dag;
  const { configs, site, surface } = tree;
  dag.setSelected([
    surface.fire.ellipse.head.ros,
    surface.fire.ellipse.head.flameLength,
    surface.fire.ellipse.head.scorchHt,
  ]);
  dag.setValues([
    [configs.fire.ewsLimit, 'applied'],
    [configs.fire.fli, 'flameLength'],
    [configs.fire.lwr, 'lengthToWidthRatio'],
    [configs.fire.weightingMethod, 'harmonic'],
    [configs.fire.vector, 'fromNorth'],
    [configs.fuel.primary, 'catalog'],
    [configs.fuel.secondary, 'none'],
    [configs.fuel.moisture, 'individual'],
    [configs.fuel.waf, 'input'],
    [configs.fuel.curedHerbFraction, 'estimated'],
    [configs.fuel.chaparralTotalLoad, 'input'],
    [configs.slope.steepness, 'ratio'],
    [configs.wind.direction, 'sourceFromNorth'],
    [configs.wind.speed, 'atMidflame'],
  ]);
  dag.setBatchInputs([
    [site.fire.airTemp, [95]],
    [site.fire.sinceIgnition, [60]],
    [site.fire.vector.fromNorth, [45]],
    [site.map.scale, [24000]],
    [site.moisture.dead.tl1h, [0.05]],
    [site.moisture.dead.tl10h, [0.07]],
    [site.moisture.dead.tl100h, [0.09]],
    [site.moisture.live.herb, [0.5]],
    [site.moisture.live.stem, [1.5]],
    [site.slope.direction.aspect, [180]],
    [site.slope.steepness.ratio, [0.25]],
    [site.wind.direction.sourceFromNorth, [270]],
    [site.wind.speed.atMidflame, [880]],
    [surface.fuel.primary.model.key, ['10']],
  ]);
}
