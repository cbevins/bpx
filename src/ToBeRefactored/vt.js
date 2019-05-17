// Every Node has a Vtype that defines its variant type,
// label, default value, filters, validators, and decorators
// Many Nodes may share the same vtype; for example,
// all fuel loads share the vt.fuel.load vtype
function Vtype ( label, dfltValue, validators ) {
  this.lb = label
  this.dv = dfltValue
  this.vl = validators
}

var vt = {
  boolean: new Vtype( 'Boolean', false, [] ),
  factor: new Vtype( 'Factor', 1.0, [] ),
  fraction: new Vtype( 'Fraction', 0.0, [] ),
  int: new Vtype( 'Integer', 0., [] ),
  ratio: new Vtype( 'Ratio', 0.0, [] ),
  string: new Vtype( 'String', '', [] ),
  air: {
    tmp: new Vtype( 'Ambient Temperature', 77., [] ),
  },
  az: {
    hd: new Vtype( 'Azimuth from Fire Head', 0.0, [] ),
    no: new Vtype( 'Azimuth from North', 0.0, [] ),
    up: new Vtype( 'Azimuth from Upslope', 0.0, [] ),
  },
  cpy: {
    bd: new Vtype( 'Bulk Density', 0.0, [] ),
    bh: new Vtype( 'Base Height', 0.0, [] ),
    cr: new Vtype( 'Crown Ratio', 0.0, [] ),
    cv: new Vtype( 'Cover', 0.0, [] ),
    fl: new Vtype( 'Crown Fill', 0.0, [] ),
    ht: new Vtype( 'Height', 0.0, [] ),
    mc: new Vtype( 'Foliar Moisture', 0.0, [] ),
    sf: new Vtype( 'Shelters Fuel', 0.0, [] ),
  },
  doc: {
    tl: new Vtype( 'Title', '', [] ),
    un: new Vtype( 'User', '', [] ),
  },
  fire: {
    cidx: new Vtype( 'Crowning Index', 0.0, [] ),
    comp: new Vtype( 'Component', 0.0, [] ),
    dist: new Vtype( 'Spread Distance', 0.0, [] ),
    earea: new Vtype( 'Ellipse Area', 0.0, [] ),
    ecc: new Vtype( 'Ellipse Eccentricity', 0.0, [] ),
    eleng: new Vtype( 'Ellipse Length', 0.0, [] ),
    elwr: new Vtype( 'Ellipse Length-to-Width Ratio', 1.0, [] ),
    eper: new Vtype( 'Ellipse Perimeter', 0.0, [] ),
    etig: new Vtype( 'Elapsed Since Ignition', 0.0, [] ),
    ewid: new Vtype( 'Ellipse Width', 0.0, [] ),
    ewsx: new Vtype( 'Effective Wind Speed Limit Exceeded?', false, [] ),
    fl: new Vtype( 'Flame Length', 0.0, [] ),
    fli: new Vtype( 'Fireline Intensity', 0.0, [] ),
    hdno: new Vtype( 'Heading Direction from North', 0.0, [] ),
    hdup: new Vtype( 'Heading Direction from Upslope', 0.0, [] ),
    hpua: new Vtype( 'Heat per Unit Area', 0.0, [] ),
    marea: new Vtype( 'Ellipse Map Area', 0.0, [] ),
    mdist: new Vtype( 'Map Spread Distance', 0.0, [] ),
    mlen: new Vtype( 'Ellipse Map Length', 0.0, [] ),
    mper: new Vtype( 'Ellipse Map Perimeter', 0.0, [] ),
    mwid: new Vtype( 'Ellipse Map Width', 0.0, [] ),
    phiew: new Vtype( 'Effective Wind Coefficient', 0.0, [] ),
    phis: new Vtype( 'Slope Coefficient', 0.0, [] ),
    phiw: new Vtype( 'Wind Coefficient', 0.0, [] ),
    pow: new Vtype( 'Power', 0.0, [] ),
    ros: new Vtype( 'Spread Rate', 0.0, [] ),
    rosx: new Vtype( 'Spread Rate Exceeds Effective Wind Speed?', false, [] ),
    rxi: new Vtype( 'Reaction Intensity', 0.0, [] ),
    scht: new Vtype( 'Scorch Height', 0.0, [] ),
    vdhd: new Vtype( 'Vector Direction from Fire Head', 0.0, [] ),
    vdno: new Vtype( 'Vector Direction from North', 0.0, [] ),
    vdup: new Vtype( 'Vector Direction from Upslope', 0.0, [] ),
  },
  fuel: {
    area: new Vtype( 'Surface Area', 0.0, [] ),
    awtg: new Vtype( 'Surface Area Weighting Factor', 0.0, [] ),
    beta: new Vtype( 'Packing Ratio', 0.0, [] ),
    beto: new Vtype( 'Optimum Packing Ratio', 0.0, [] ),
    betr: new Vtype( 'Packing Ratio / Optimum', 0.0, [] ),
    bulk: new Vtype( 'Bulk Density', 0.0, [] ),
    chag: new Vtype( 'Chaparral Age', 0.0, [] ),          // Chaparral only
    chdf: new Vtype( 'Dead Load Fraction', 0.0, [] ),     // Chaparral only
    chty: new Vtype( 'Chaparral Type', 'chamise', [] ),   // Chaparral only
    dens: new Vtype( 'Fiber Density', 32.0, [] ),
    depth: new Vtype( 'Depth', 0.01, [] ),
    desc: new Vtype( 'Description', '', [] ),
    diam: new Vtype( 'Cylindrical Diameter', 0.0, [] ),
    efhn: new Vtype( 'Effective Fuel Heating Number', 0.0, [] ),
    efld: new Vtype( 'Effective Fuel Load', 0.0, [] ),
    efmc: new Vtype( 'Effective Fuel Moisture Content', 9.0, [] ),
    efwl: new Vtype( 'Effective Fuel Water Load', 0.0, [] ),
    etam: new Vtype( 'Moisture Damping Coefficient', 0.0, [] ),
    etas: new Vtype( 'Mineral Damping Coefficient', 0.0, [] ),
    ewsl: new Vtype( 'Effective Wind Speed Limit', 0.0, [] ),
    ewsp: new Vtype( 'Effective Wind Speed', 0.0, [] ),
    fmcv: new Vtype( 'Fuel Model Cover', 1.0, [] ),
    form: new Vtype( 'Form Category', 'branchwood', [] ),
    hcf: new Vtype( 'Herb Cured Fraction', 0.0, [] ),     // Standard only
    heat: new Vtype( 'Heat of Combustion', 8000.0, [] ),
    key: new Vtype( 'Catalog Key', 'fm10', [] ),
    leng: new Vtype( 'Cylindrical Length', 0.0, [] ),
    life: new Vtype( 'Life Category', 'dead', [] ),
    load: new Vtype( 'Ovendry Load', 0.0, [] ),
    mext: new Vtype( 'Extinction Moisture Content', 0.01, [] ),
    mxtk: new Vtype( 'Extinction Moisture Content Factor', 1.0, [] ),
    mois: new Vtype( 'Moisture Content', 9.0, [] ),
    mrat: new Vtype( 'Moisture Content-to-Extinction Ratio', 9.0, [] ),
    mwaf: new Vtype( 'Midflame Wind Speed Adjustment Factor', 1.0, [] ),
    mwsp: new Vtype( 'Midflame Wind Speed', 0.0, [] ),
    pgag: new Vtype( 'Age of Rough', 0.0, [] ),           // PG only
    pgba: new Vtype( 'Overstory Basal Area', 0.0, [] ),   // PG only
    pgcv: new Vtype( 'Palmetto Coverage', 0.0, [] ),      // PG only
    pght: new Vtype( 'Height of Understory', 0.0, [] ),   // PG only
    pflx: new Vtype( 'Propagating Flux Ratio', 0.0, [] ),
    phil: new Vtype( 'Wind-Slope Coefficient Upper Limit', 0.0, [] ),
    pprc: new Vtype( 'Packing Ratio Contribution', 0.0, [] ),
    qign: new Vtype( 'Heat of Pre-Ignition', 0.0, [] ),
    ros0: new Vtype( 'No-Wind, No-Slope Spread Rate', 0.0, [] ),
    rosl: new Vtype( 'Spread Rate Upper Limit', 0.0, [] ),
    rxid: new Vtype( 'Dry Reaction Intensity', 0.0, [] ),
    rxva: new Vtype( 'Reaction Velocity Exponent', 0.0, [] ),
    rxvm: new Vtype( 'Maximum Reaction Velocity', 0.0, [] ),
    rxvo: new Vtype( 'Optimum Reaction Velocity', 0.0, [] ),
    savr: new Vtype( 'Surface Area-to-Volume Ratio', 1.0, [] ),
    sv15: new Vtype( 'Surface Area-to-Volume Ratio Factor', 1.0, [] ),
    seff: new Vtype( 'Effective Mineral Content', 0.01, [] ),
    sidx: new Vtype( 'Size Class Index', 0, [] ),
    sink: new Vtype( 'Heat Sink', 0.0, [] ),
    size: new Vtype( 'Size Class', 5, [] ),
    slpf: new Vtype( 'Slope Factor', 0.0, [] ),
    stot: new Vtype( 'Total Mineral Content', 0.0555, [] ),
    swtg: new Vtype( 'Size Class Weighting Factor', 0.0, [] ),
    taur: new Vtype( 'Flame Residence Time', 0.0, [] ),
    type: new Vtype( 'Type', 'std', [] ),
    volm: new Vtype( 'Cylindrical Volume', 0.0, [] ),
    wacl: new Vtype( 'Curing Level', 0.0, [] ),           // Western Aspen only
    waty: new Vtype( 'Aspen Type', '', [] ),             // Western Aspen only
    wndb: new Vtype( 'Wind Factor B', 0.0, [] ),
    wndc: new Vtype( 'Wind Factor C', 0.0, [] ),
    wnde: new Vtype( 'Wind Factor E', 0.0, [] ),
    wndk: new Vtype( 'Wind Factor K', 0.0, [] ),
    wndi: new Vtype( 'Wind Factor K Inverse', 0.0, [] ),
    wnet: new Vtype( 'Net Ovendry Load', 0.0, [] )
  },
  map: {
    scl: new Vtype( 'Scale', 1.0, [] ),
    cint: new Vtype( 'Contour Interval', 100., [] ),
    cont: new Vtype( 'Contours Crossed', 0, [] ),
    dist: new Vtype( 'Map Distance Measured', 0.0, [] ),
  },
  mois: {
    key: new Vtype( 'Scenario Key', '', [] )
  },
  slp: {
    asp: new Vtype( 'Aspect Azimuth from North', 0.0, [] ),
    deg: new Vtype( 'Degrees', 0.0, [] ),
    rat: new Vtype( 'Ratio of Rise-to-Reach', 0.0, [] ),
    up: new Vtype( 'Upslope Azimuth from North', 0.0, [] ),
  },
  wind: {
    hdgNo: new Vtype( 'Heading from North', 0.0, [] ),
    hdgUp: new Vtype( 'Heading from Upslope', 0.0, [] ),
    srcNo: new Vtype( 'Source from North', 0.0, [] ),
    srcUp: new Vtype( 'Source from Upslope', 0.0, [] ),
    spd: new Vtype( 'Speed', 0.0, [] ),
  }
}

module.exports = {
  vt: vt,
  Vtype: Vtype,
}