import DagBranch from './DagBranch';
import DagLeafConfig from './DagLeafConfig';

class BpxTreeConfigFuel extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // bp6 #1 Surface > Input Options > Fuel:
    // [key, std, exp, harm, arith, pg, wa, ch]
    // Bpx splits bp6 config #1 into two configs; fuel.primary and fuel.secondary
    new DagLeafConfig(this, 'primary')
      .header('Primary fuels are specified by entering')
      .item('catalog', 'a fuel model catalog key', true)
      .item('behave', 'standard BehavePlus fuel parameters')
      .item('chaparral', 'chaparral dynamic fuel parameters')
      .item('palmettoGallberry', 'palmetto-gallberry dynamic fuel parameters')
      .item('westernAspen', 'western aspen dynamic fuel models');
    // bp6 #1 Surface > Input Options > Fuel:
    // [key, std, exp, harm, arith, pg, wa, ch]
    // Bpx splits bp6 config #1 into two configs; fuel.primary and fuel.secondary
    new DagLeafConfig(this, 'secondary')
      .header('Secondary fuels are specified by entering')
      .item('catalog', 'a fuel model catalog key')
      .item('behave', 'standard BehavePlus fuel parameters')
      .item('chaparral', 'chaparral dynamic fuel parameters')
      .item('palmettoGallberry', 'palmetto-gallberry dynamic fuel parameters')
      .item('westernAspen', 'western aspen dynamic fuel models')
      .item('none', 'there are no secondary fuels', true);
    // bp6 #3 - Surface > Input Options > Moisture > Fuel Moisture:
    // [ind, cat, mixed, scen]
    new DagLeafConfig(this, 'moisture')
      .header('Fuel moistures are specified by entering')
      .item('individual', 'the 3 dead and 2 live fuel moistures', true)
      .item('liveCategory', 'the 3 dead moistures and a singe live category moisture')
      .item('category', 'the dead and live category moistures only')
      .item('catalog', 'a fuel moisture catalog key');
    // bp6 #4 Surface > Input Options > Wind Speed > Entered at:
    // [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
    // Bpx slipts Bp6 config #4 into 2 configs, fuel.waf and wind.speed
    new DagLeafConfig(this, 'waf')
      .header('Midflame wind speed adjustment factor is')
      .item('input', 'entered as input', true)
      .item('estimated', 'estimated from canopy and fuel parameters');
    // bp6 #2 - Surface > Input Options > Moisture > Herb Curing: [est, inp]
    new DagLeafConfig(this, 'curedHerbFraction')
      .header('Behave fuel model cured herb fraction is')
      .item('input', 'entered as input', true)
      .item('estimated', 'estimated from live fuel moisture');
    // bp6 #11 Surface > Input Options > Chaparral > Total load is: [specified, est]
    new DagLeafConfig(this, 'chaparralTotalLoad')
      .header('Chaparral total fuel load is')
      .item('input', 'entered as input', true)
      .item('estimated', 'estimated from Chaparral depth');
  }
  connect(/* tree */) {}
}

class BpxTreeConfigSlope extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // bp6 #7 Surface > Input Options > Slope > Slope is [percent, degrees]
    // bp6 #8 Surface > Input Options > Slope > Slope is [input, map]
    // BPX combined Bp6 configs #7 and #8
    new DagLeafConfig(this, 'steepness')
      .header('Slope steepness is')
      .item('ratio', 'entered as ratio of vertical rise to horizontal reach', true)
      .item('degrees', 'entered as degrees of angle above the horizontal plane')
      .item('map', 'estimated from map measurements');
  }
  connect(/* tree */) {}
}

class BpxTreeConfigWind extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // bp6 #5 Surface > Input Options > Wind Speed > Wind is:
    // [always upslope, specified]
    new DagLeafConfig(this, 'direction')
      .header('Wind direction is')
      .item('sourceFromNorth', 'the direction FROM which the wind is blowing (degrees from NORTH)')
      .item('headingFromUpslope', 'the direcion TOWARDS which the wind is blowing (degrees from UPSLOPE)', true)
      .item('upslope', 'assumed to be blowing upslope');
    // bp6 #4 Surface > Input Options > Wind Speed > Entered at:
    // [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
    // Bpx slipts Bp6 config #4 into 2 configs, fuel.waf and wind.speed
    new DagLeafConfig(this, 'speed')
      .header('Wind speed is entered for')
      .item('at10m', '10-m height')
      .item('at20ft', '20-ft height', true)
      .item('atMidflame', 'midflame height');
  }
  connect(/* tree */) {}
}

class BpxTreeConfigFire extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // bp6 #6 Surface > Input Options > Wind Speed > Impose max wind speed limit?
    new DagLeafConfig(this,'ewsLimit')
      .header('The effective wind speed limit is')
      .item('applied', 'applied', true)
      .item('ignored', 'ignored');
    // New to BPX
    new DagLeafConfig(this, 'maxRos')
      .header('Maximum fire spread rate of 2 surface fuel types is based on')
      .item('arithmetic', 'arithmetic mean spread rate')
      .item('expected', 'expected value spread rate')
      .item('harmonic', 'harmonic mean spread rate', true);
    // bp6 #10 Surface > Input Options > Directions > Wind & Fire Dir:
    // [wrt upslope, wrt north]
    new DagLeafConfig(this, 'vector')
      .header('Fire vector direction inputs are')
      .item('fromFireHead', 'degrees clockwise from direction of maximum spread', true)
      .item('fromUpslope', 'degrees clockwise from upslope')
      .item('fromNorth', 'degrees clockwise from north');
    // bp6 #9 Surface > Input Options > Directions > Spread is [head, back, flank, psi, beta]
    // BPX implements all spread direction options at any time
  }
  connect(/* tree */) {}
}

class BpxTreeConfigCrown extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    // bp6 #12 - Crown > Input Options > Use [roth, s&r]
    // BPX - May not be necessary: S&R is applied only if passive ouputs requested
    // new DagLeafConfig(this, 'method')
    //   .header('Crown fire is estimated via')
    //   .item('rothermel', 'Rothermel')
    //   .item('scottReinhardt', 'Scott and Reinhardt (wind must blow upslope)', true);

    // bp6 #13 - Crown > Input Options > FLI [fl, fli]
    // BPX- Required only in STANDALONE mode
    // new DagLeafConfig(this, 'crownFli')
    //   .header('The Crown Module is')
    //   .item('surface', 'linked to the Surface Module', true)
    //   .item('flameLength', 'run stand-alone using flame length input')
    //   .item('firelineIntensity', 'run stand-alone using fireline intensity input');

    // bp6 # 14 - Contain > Input Options > resources [single, multiple]
    // new DagLeafConfig(this, 'resources')
    //   .header('Contain module allows')
    //   .item('single', 'a single firefighting resource')
    //   .item('multiple', 'multiple firefighting resources', true);

    // This should replace Size, Scorch, and Crown fli/fl configurations
    // new DagLeafConfig(this, 'sizeFli')
    //   .header('The Size Module is')
    //   .item('surface', 'linked to the Surface Module', true)
    //   .item('flameLength', 'run stand-alone using flame length input')
    //   .item('firelineIntensity', 'run stand-alone using fireline intensity input');

    // #15 - Scorch > Input Options > FLI [fl, fli]
    // bp7 #16 - stand alone only
    // new DagLeafConfig(this, 'scorchFli')
    //   .header('The Scorch Module is')
    //   .item('surface', 'linked to the Surface Module', true)
    //   .item('flameLength', 'run stand-alone using flame length input')
    //   .item('firelineIntensity', 'run stand-alone using fireline intensity input');

    // new DagLeafConfig(this, 'crownRatio')
    //   .header('The canopy crown ratio is')
    //   .item('estimated', 'estimated from canopy ht and crown base ht', true)
    //   .item('input', 'entered as input');
  }
  connect(/* tree */) {}
}

export default class BpxTreeConfigs extends DagBranch {
  constructor(parent, name) {
    super(parent, name);
    new BpxTreeConfigFuel(this, 'fuel');
    new BpxTreeConfigSlope(this, 'slope');
    new BpxTreeConfigWind(this, 'wind');
    new BpxTreeConfigFire(this, 'fire');
    new BpxTreeConfigCrown(this, 'crown');
  }
  connect(/* tree */) {}
}
