export const BpxLibFuelRecord = {
  // Example special case dynamic fuel models:
  chamise6: {
    domain: 'chaparral',
    label: '6-ft chamise 50%',
    depth: 6.0,
    totalLoad: 2.0,
    deadFraction: 0.75,
    fuelType: 'chamise',
  },
  pg6: {
    domain: 'palmettoGallberry',
    label: '6-ft pg',
    age: 10.0,
    basal: 30.0,
    cover: 70.0,
    height: 6.0,
  },
  aspenShrub50: {
    domain: 'westernAspen',
    label: 'Aspen-shrub 50%',
    curingLevel: 0.50,
    fuelType: 'aspenShrub',
  },

  // Standard BehavePlus Fuel Models
  '0': { domain: 'behave',
    label: 'No Fuel',
    depth: 0,
    deadMext: 0,
    dead1Load: 0,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 0,
    liveHerbSavr: 0,
    liveStemSavr: 0,
    deadHeat: 0,
    liveHeat: 0 },
  '1': { domain: 'behave',
    label: 'Short grass',
    depth: 1,
    deadMext: 0.12,
    dead1Load: 0.034,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 3500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'2': { domain: 'behave',
    label: 'Timber grass and understory',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.092,
    dead10Load: 0.046,
    dead100Load: 0.023,
    totalHerbLoad: 0.023,
    liveStemLoad: 0,
    dead1Savr: 3000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'3': { domain: 'behave',
    label: 'Tall grass',
    depth: 2.5,
    deadMext: 0.25,
    dead1Load: 0.138,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'4':
  { domain: 'behave',
    label: 'Chaparral',
    depth: 6,
    deadMext: 0.2,
    dead1Load: 0.23,
    dead10Load: 0.184,
    dead100Load: 0.092,
    totalHerbLoad: 0,
    liveStemLoad: 0.23,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'5':
  { domain: 'behave',
    label: 'Brush',
    depth: 2,
    deadMext: 0.2,
    dead1Load: 0.046,
    dead10Load: 0.023,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.092,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'6':
  { domain: 'behave',
    label: 'Dormant brush, hardwood slash',
    depth: 2.5,
    deadMext: 0.25,
    dead1Load: 0.069,
    dead10Load: 0.115,
    dead100Load: 0.092,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1750,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'7':
  { domain: 'behave',
    label: 'Southern rough',
    depth: 2.5,
    deadMext: 0.4,
    dead1Load: 0.052,
    dead10Load: 0.086,
    dead100Load: 0.069,
    totalHerbLoad: 0,
    liveStemLoad: 0.017,
    dead1Savr: 1750,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'8':
  { domain: 'behave',
    label: 'Short needle litter',
    depth: 0.2,
    deadMext: 0.3,
    dead1Load: 0.069,
    dead10Load: 0.046,
    dead100Load: 0.115,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'9':
  { domain: 'behave',
    label: 'Long needle or hardwood litter',
    depth: 0.2,
    deadMext: 0.25,
    dead1Load: 0.134,
    dead10Load: 0.019,
    dead100Load: 0.007,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'10':
  { domain: 'behave',
    label: 'Timber litter & understory',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.138,
    dead10Load: 0.092,
    dead100Load: 0.23,
    totalHerbLoad: 0,
    liveStemLoad: 0.092,
    dead1Savr: 2000,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'11':
  { domain: 'behave',
    label: 'Light logging slash',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.069,
    dead10Load: 0.207,
    dead100Load: 0.253,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'12':
  { domain: 'behave',
    label: 'Medium logging slash',
    depth: 2.3,
    deadMext: 0.2,
    dead1Load: 0.184,
    dead10Load: 0.644,
    dead100Load: 0.759,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'13':
  { domain: 'behave',
    label: 'Heavy logging slash',
    depth: 3,
    deadMext: 0.25,
    dead1Load: 0.322,
    dead10Load: 1.058,
    dead100Load: 1.288,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1500,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'101':
  { domain: 'behave',
    label: 'Short, sparse, dry climate grass',
    depth: 0.4,
    deadMext: 0.15,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.013774104683195591,
    liveStemLoad: 0,
    dead1Savr: 2200,
    liveHerbSavr: 2000,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'102':
  { domain: 'behave',
    label: 'Low load, dry climate grass',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.04591368227731864,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'103':
  { domain: 'behave',
    label: 'Low load, very coarse, humid climate grass',
    depth: 2,
    deadMext: 0.3,
    dead1Load: 0.004591368227731864,
    dead10Load: 0.018365472910927456,
    dead100Load: 0,
    totalHerbLoad: 0.06887052341597796,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1300,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'104':
  { domain: 'behave',
    label: 'Moderate load, dry climate grass',
    depth: 2,
    deadMext: 0.15,
    dead1Load: 0.01147842056932966,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.0872359963269054,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'105':
  { domain: 'behave',
    label: 'Low load, humid climate grass',
    depth: 1.5,
    deadMext: 0.4,
    dead1Load: 0.018365472910927456,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.11478420569329659,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'106':
  { domain: 'behave',
    label: 'Moderate load, humid climate grass',
    depth: 1.5,
    deadMext: 0.4,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.15610651974288337,
    liveStemLoad: 0,
    dead1Savr: 2200,
    liveHerbSavr: 2000,
    liveStemSavr: 1500,
    deadHeat: 9000,
    liveHeat: 9000 },
'107':
  { domain: 'behave',
    label: 'High load, dry climate grass',
    depth: 3,
    deadMext: 0.15,
    dead1Load: 0.04591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.24793388429752067,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'108':
  { domain: 'behave',
    label: 'High load, very coarse, humid climate grass',
    depth: 4,
    deadMext: 0.3,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.0459139,
    dead100Load: 0,
    totalHerbLoad: 0.33516988062442604,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1300,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'109':
  { domain: 'behave',
    label: 'Very high load, humid climate grass',
    depth: 5,
    deadMext: 0.4,
    dead1Load: 0.04591368227731864,
    dead10Load: 0.04591368227731864,
    dead100Load: 0,
    totalHerbLoad: 0.4132231404958677,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'121':
  { domain: 'behave',
    label: 'Low load, dry climate grass-shrub',
    depth: 0.9,
    deadMext: 0.15,
    dead1Load: 0.009182736455463728,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.02295684113865932,
    liveStemLoad: 0.02984403,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1800,
    deadHeat: 8000,
    liveHeat: 8000 },
'122':
  { domain: 'behave',
    label: 'Moderate load, dry climate grass-shrub',
    depth: 1.5,
    deadMext: 0.15,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.02295684113865932,
    dead100Load: 0,
    totalHerbLoad: 0.027548209366391182,
    liveStemLoad: 0.04591368227731864,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1800,
    deadHeat: 8000,
    liveHeat: 8000 },
'123':
  { domain: 'behave',
    label: 'Moderate load, humid climate grass-shrub',
    depth: 1.8,
    deadMext: 0.4,
    dead1Load: 0.013774104683195591,
    dead10Load: 0.01147842056932966,
    dead100Load: 0,
    totalHerbLoad: 0.06657483930211203,
    liveStemLoad: 0.057392102846648294,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'124':
  { domain: 'behave',
    label: 'High load, humid climate grass-shrub',
    depth: 2.1,
    deadMext: 0.4,
    dead1Load: 0.0872359963269054,
    dead10Load: 0.013774104683195591,
    dead100Load: 0.004591368227731864,
    totalHerbLoad: 0.15610651974288337,
    liveStemLoad: 0.3259871441689623,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'141':
  { domain: 'behave',
    label: 'Low load, dry climate shrub',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.01147842056932966,
    dead10Load: 0.01147842056932966,
    dead100Load: 0,
    totalHerbLoad: 0.0068870523415977955,
    liveStemLoad: 0.05968778696051423,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'142':
  { domain: 'behave',
    label: 'Moderate load, dry climate shrub',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.06198347107438017,
    dead10Load: 0.11019283746556473,
    dead100Load: 0.03443526170798898,
    totalHerbLoad: 0,
    liveStemLoad: 0.17676767676767677,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'143':
  { domain: 'behave',
    label: 'Moderate load, humid climate shrub',
    depth: 2.4,
    deadMext: 0.4,
    dead1Load: 0.02066115702479339,
    dead10Load: 0.13774104683195593,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.28466483011937554,
    dead1Savr: 1600,
    liveHerbSavr: 1800,
    liveStemSavr: 1400,
    deadHeat: 8000,
    liveHeat: 8000 },
'144':
  { domain: 'behave',
    label: 'Low load, humid climate timber-shrub',
    depth: 3,
    deadMext: 0.3,
    dead1Load: 0.03902662993572084,
    dead10Load: 0.05280073461891643,
    dead100Load: 0.009182736455463728,
    totalHerbLoad: 0,
    liveStemLoad: 0.11707988980716252,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'145':
  { domain: 'behave',
    label: 'High load, dry climate shrub',
    depth: 6,
    deadMext: 0.15,
    dead1Load: 0.1652892561983471,
    dead10Load: 0.09641873278236915,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.13314967860422405,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'146':
  { domain: 'behave',
    label: 'Low load, humid climate shrub',
    depth: 2,
    deadMext: 0.3,
    dead1Load: 0.13314967860422405,
    dead10Load: 0.06657483930211203,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.06427915518824609,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'147':
  { domain: 'behave',
    label: 'Very high load, dry climate shrub',
    depth: 6,
    deadMext: 0.15,
    dead1Load: 0.16069788797061524,
    dead10Load: 0.24334251606978877,
    dead100Load: 0.10101010101010101,
    totalHerbLoad: 0,
    liveStemLoad: 0.15610651974288337,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'148':
  { domain: 'behave',
    label: 'High load, humid climate shrub',
    depth: 3,
    deadMext: 0.4,
    dead1Load: 0.0941230486685032,
    dead10Load: 0.15610651974288337,
    dead100Load: 0.03902662993572084,
    totalHerbLoad: 0,
    liveStemLoad: 0.19972451790633605,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'149':
  { domain: 'behave',
    label: 'Very high load, humid climate shrub',
    depth: 4.4,
    deadMext: 0.4,
    dead1Load: 0.20661157024793386,
    dead10Load: 0.11248852157943066,
    dead100Load: 0,
    totalHerbLoad: 0.07116620752984389,
    liveStemLoad: 0.3213957759412305,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
'161':
  { domain: 'behave',
    label: 'Light load, dry climate timber-grass-shrub',
    depth: 0.6,
    deadMext: 0.2,
    dead1Load: 0.009182736455463728,
    dead10Load: 0.04132231404958678,
    dead100Load: 0.06887052341597796,
    totalHerbLoad: 0.009182736455463728,
    liveStemLoad: 0.04132231404958678,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'162':
  { domain: 'behave',
    label: 'Moderate load, humid climate timber-shrub',
    depth: 1,
    deadMext: 0.3,
    dead1Load: 0.0436179981634527,
    dead10Load: 0.08264462809917356,
    dead100Load: 0.057392102846648294,
    totalHerbLoad: 0,
    liveStemLoad: 0.009182736455463728,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'163':
  { domain: 'behave',
    label: 'Moderate load, humid climate timber-grass-shrub',
    depth: 1.3,
    deadMext: 0.3,
    dead1Load: 0.050505050505050504,
    dead10Load: 0.0068870523415977955,
    dead100Load: 0.01147842056932966,
    totalHerbLoad: 0.029843893480257115,
    liveStemLoad: 0.050505050505050504,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1400,
    deadHeat: 8000,
    liveHeat: 8000 },
'164':
  { domain: 'behave',
    label: 'Dwarf conifer understory',
    depth: 0.5,
    deadMext: 0.12,
    dead1Load: 0.20661157024793386,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.09182736455463728,
    dead1Savr: 2300,
    liveHerbSavr: 1800,
    liveStemSavr: 2000,
    deadHeat: 8000,
    liveHeat: 8000 },
'165':
  { domain: 'behave',
    label: 'Very high load, dry climate timber-shrub',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.18365472910927455,
    dead10Load: 0.18365472910927455,
    dead100Load: 0.13774104683195593,
    totalHerbLoad: 0,
    liveStemLoad: 0.13774104683195593,
    dead1Savr: 1500,
    liveHerbSavr: 1800,
    liveStemSavr: 750,
    deadHeat: 8000,
    liveHeat: 8000 },
'181':
  { domain: 'behave',
    label: 'Low load, compact conifer litter',
    depth: 0.2,
    deadMext: 0.3,
    dead1Load: 0.04591368227731864,
    dead10Load: 0.10101010101010101,
    dead100Load: 0.1652892561983471,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'182':
  { domain: 'behave',
    label: 'Low load broadleaf litter',
    depth: 0.2,
    deadMext: 0.25,
    dead1Load: 0.06427915518824609,
    dead10Load: 0.10560146923783285,
    dead100Load: 0.10101010101010101,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'183':
  { domain: 'behave',
    label: 'Moderate load conifer litter',
    depth: 0.3,
    deadMext: 0.2,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.10101010101010101,
    dead100Load: 0.12855831037649218,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'184':
  { domain: 'behave',
    label: 'Small downed logs',
    depth: 0.4,
    deadMext: 0.25,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.06887052341597796,
    dead100Load: 0.1928374655647383,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'185':
  { domain: 'behave',
    label: 'High load conifer litter',
    depth: 0.6,
    deadMext: 0.25,
    dead1Load: 0.05280073461891643,
    dead10Load: 0.11478420569329659,
    dead100Load: 0.20202020202020202,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'186':
  { domain: 'behave',
    label: 'High load broadleaf litter',
    depth: 0.3,
    deadMext: 0.25,
    dead1Load: 0.11019283746556473,
    dead10Load: 0.055096418732782364,
    dead100Load: 0.055096418732782364,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'187':
  { domain: 'behave',
    label: 'Large downed logs',
    depth: 0.4,
    deadMext: 0.25,
    dead1Load: 0.013774104683195591,
    dead10Load: 0.06427915518824609,
    dead100Load: 0.371900826446281,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'188':
  { domain: 'behave',
    label: 'Long-needle litter',
    depth: 0.3,
    deadMext: 0.35,
    dead1Load: 0.2662993572084481,
    dead10Load: 0.06427915518824609,
    dead100Load: 0.050505050505050504,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'189':
  { domain: 'behave',
    label: 'Very high load broadleaf litter',
    depth: 0.6,
    deadMext: 0.35,
    dead1Load: 0.305325987144169,
    dead10Load: 0.1515151515151515,
    dead100Load: 0.19054178145087236,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'201':
  { domain: 'behave',
    label: 'Low load activity fuel',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.06887052341597796,
    dead10Load: 0.13774104683195593,
    dead100Load: 0.505050505050505,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'202':
  { domain: 'behave',
    label: 'Moderate load activity or low load blowdown',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.20661157024793386,
    dead10Load: 0.1951331496786042,
    dead100Load: 0.18365472910927455,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'203':
  { domain: 'behave',
    label: 'High load activity fuel or moderate load blowdown',
    depth: 1.2,
    deadMext: 0.25,
    dead1Load: 0.2525252525252525,
    dead10Load: 0.12626262626262624,
    dead100Load: 0.13774104683195593,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
'204':
  { domain: 'behave',
    label: 'High load blowdown',
    depth: 2.7,
    deadMext: 0.25,
    dead1Load: 0.24104683195592286,
    dead10Load: 0.16069788797061524,
    dead100Load: 0.24104683195592286,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
gr1:
  { domain: 'behave',
    label: 'Short, sparse, dry climate grass',
    depth: 0.4,
    deadMext: 0.15,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.013774104683195591,
    liveStemLoad: 0,
    dead1Savr: 2200,
    liveHerbSavr: 2000,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr2:
  { domain: 'behave',
    label: 'Low load, dry climate grass',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.04591368227731864,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr3:
  { domain: 'behave',
    label: 'Low load, very coarse, humid climate grass',
    depth: 2,
    deadMext: 0.3,
    dead1Load: 0.004591368227731864,
    dead10Load: 0.018365472910927456,
    dead100Load: 0,
    totalHerbLoad: 0.06887052341597796,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1300,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr4:
  { domain: 'behave',
    label: 'Moderate load, dry climate grass',
    depth: 2,
    deadMext: 0.15,
    dead1Load: 0.01147842056932966,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.0872359963269054,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr5:
  { domain: 'behave',
    label: 'Low load, humid climate grass',
    depth: 1.5,
    deadMext: 0.4,
    dead1Load: 0.018365472910927456,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.11478420569329659,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr6:
  { domain: 'behave',
    label: 'Moderate load, humid climate grass',
    depth: 1.5,
    deadMext: 0.4,
    dead1Load: 0.004591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.15610651974288337,
    liveStemLoad: 0,
    dead1Savr: 2200,
    liveHerbSavr: 2000,
    liveStemSavr: 1500,
    deadHeat: 9000,
    liveHeat: 9000 },
gr7:
  { domain: 'behave',
    label: 'High load, dry climate grass',
    depth: 3,
    deadMext: 0.15,
    dead1Load: 0.04591368227731864,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.24793388429752067,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr8:
  { domain: 'behave',
    label: 'High load, very coarse, humid climate grass',
    depth: 4,
    deadMext: 0.3,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.0459139,
    dead100Load: 0,
    totalHerbLoad: 0.33516988062442604,
    liveStemLoad: 0,
    dead1Savr: 1500,
    liveHerbSavr: 1300,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gr9:
  { domain: 'behave',
    label: 'Very high load, humid climate grass',
    depth: 5,
    deadMext: 0.4,
    dead1Load: 0.04591368227731864,
    dead10Load: 0.04591368227731864,
    dead100Load: 0,
    totalHerbLoad: 0.4132231404958677,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
gs1:
  { domain: 'behave',
    label: 'Low load, dry climate grass-shrub',
    depth: 0.9,
    deadMext: 0.15,
    dead1Load: 0.009182736455463728,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0.02295684113865932,
    liveStemLoad: 0.02984403,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1800,
    deadHeat: 8000,
    liveHeat: 8000 },
gs2:
  { domain: 'behave',
    label: 'Moderate load, dry climate grass-shrub',
    depth: 1.5,
    deadMext: 0.15,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.02295684113865932,
    dead100Load: 0,
    totalHerbLoad: 0.027548209366391182,
    liveStemLoad: 0.04591368227731864,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1800,
    deadHeat: 8000,
    liveHeat: 8000 },
gs3:
  { domain: 'behave',
    label: 'Moderate load, humid climate grass-shrub',
    depth: 1.8,
    deadMext: 0.4,
    dead1Load: 0.013774104683195591,
    dead10Load: 0.01147842056932966,
    dead100Load: 0,
    totalHerbLoad: 0.06657483930211203,
    liveStemLoad: 0.057392102846648294,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
gs4:
  { domain: 'behave',
    label: 'High load, humid climate grass-shrub',
    depth: 2.1,
    deadMext: 0.4,
    dead1Load: 0.0872359963269054,
    dead10Load: 0.013774104683195591,
    dead100Load: 0.004591368227731864,
    totalHerbLoad: 0.15610651974288337,
    liveStemLoad: 0.3259871441689623,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh1:
  { domain: 'behave',
    label: 'Low load, dry climate shrub',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.01147842056932966,
    dead10Load: 0.01147842056932966,
    dead100Load: 0,
    totalHerbLoad: 0.0068870523415977955,
    liveStemLoad: 0.05968778696051423,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh2:
  { domain: 'behave',
    label: 'Moderate load, dry climate shrub',
    depth: 1,
    deadMext: 0.15,
    dead1Load: 0.06198347107438017,
    dead10Load: 0.11019283746556473,
    dead100Load: 0.03443526170798898,
    totalHerbLoad: 0,
    liveStemLoad: 0.17676767676767677,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh3:
  { domain: 'behave',
    label: 'Moderate load, humid climate shrub',
    depth: 2.4,
    deadMext: 0.4,
    dead1Load: 0.02066115702479339,
    dead10Load: 0.13774104683195593,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.28466483011937554,
    dead1Savr: 1600,
    liveHerbSavr: 1800,
    liveStemSavr: 1400,
    deadHeat: 8000,
    liveHeat: 8000 },
sh4:
  { domain: 'behave',
    label: 'Low load, humid climate timber-shrub',
    depth: 3,
    deadMext: 0.3,
    dead1Load: 0.03902662993572084,
    dead10Load: 0.05280073461891643,
    dead100Load: 0.009182736455463728,
    totalHerbLoad: 0,
    liveStemLoad: 0.11707988980716252,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh5:
  { domain: 'behave',
    label: 'High load, dry climate shrub',
    depth: 6,
    deadMext: 0.15,
    dead1Load: 0.1652892561983471,
    dead10Load: 0.09641873278236915,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.13314967860422405,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh6:
  { domain: 'behave',
    label: 'Low load, humid climate shrub',
    depth: 2,
    deadMext: 0.3,
    dead1Load: 0.13314967860422405,
    dead10Load: 0.06657483930211203,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.06427915518824609,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh7:
  { domain: 'behave',
    label: 'Very high load, dry climate shrub',
    depth: 6,
    deadMext: 0.15,
    dead1Load: 0.16069788797061524,
    dead10Load: 0.24334251606978877,
    dead100Load: 0.10101010101010101,
    totalHerbLoad: 0,
    liveStemLoad: 0.15610651974288337,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh8:
  { domain: 'behave',
    label: 'High load, humid climate shrub',
    depth: 3,
    deadMext: 0.4,
    dead1Load: 0.0941230486685032,
    dead10Load: 0.15610651974288337,
    dead100Load: 0.03902662993572084,
    totalHerbLoad: 0,
    liveStemLoad: 0.19972451790633605,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
sh9:
  { domain: 'behave',
    label: 'Very high load, humid climate shrub',
    depth: 4.4,
    deadMext: 0.4,
    dead1Load: 0.20661157024793386,
    dead10Load: 0.11248852157943066,
    dead100Load: 0,
    totalHerbLoad: 0.07116620752984389,
    liveStemLoad: 0.3213957759412305,
    dead1Savr: 750,
    liveHerbSavr: 1800,
    liveStemSavr: 1500,
    deadHeat: 8000,
    liveHeat: 8000 },
tu1:
  { domain: 'behave',
    label: 'Light load, dry climate timber-grass-shrub',
    depth: 0.6,
    deadMext: 0.2,
    dead1Load: 0.009182736455463728,
    dead10Load: 0.04132231404958678,
    dead100Load: 0.06887052341597796,
    totalHerbLoad: 0.009182736455463728,
    liveStemLoad: 0.04132231404958678,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
tu2:
  { domain: 'behave',
    label: 'Moderate load, humid climate timber-shrub',
    depth: 1,
    deadMext: 0.3,
    dead1Load: 0.0436179981634527,
    dead10Load: 0.08264462809917356,
    dead100Load: 0.057392102846648294,
    totalHerbLoad: 0,
    liveStemLoad: 0.009182736455463728,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
tu3:
  { domain: 'behave',
    label: 'Moderate load, humid climate timber-grass-shrub',
    depth: 1.3,
    deadMext: 0.3,
    dead1Load: 0.050505050505050504,
    dead10Load: 0.0068870523415977955,
    dead100Load: 0.01147842056932966,
    totalHerbLoad: 0.029843893480257115,
    liveStemLoad: 0.050505050505050504,
    dead1Savr: 1800,
    liveHerbSavr: 1600,
    liveStemSavr: 1400,
    deadHeat: 8000,
    liveHeat: 8000 },
tu4:
  { domain: 'behave',
    label: 'Dwarf conifer understory',
    depth: 0.5,
    deadMext: 0.12,
    dead1Load: 0.20661157024793386,
    dead10Load: 0,
    dead100Load: 0,
    totalHerbLoad: 0,
    liveStemLoad: 0.09182736455463728,
    dead1Savr: 2300,
    liveHerbSavr: 1800,
    liveStemSavr: 2000,
    deadHeat: 8000,
    liveHeat: 8000 },
tu5:
  { domain: 'behave',
    label: 'Very high load, dry climate timber-shrub',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.18365472910927455,
    dead10Load: 0.18365472910927455,
    dead100Load: 0.13774104683195593,
    totalHerbLoad: 0,
    liveStemLoad: 0.13774104683195593,
    dead1Savr: 1500,
    liveHerbSavr: 1800,
    liveStemSavr: 750,
    deadHeat: 8000,
    liveHeat: 8000 },
tl1:
  { domain: 'behave',
    label: 'Low load, compact conifer litter',
    depth: 0.2,
    deadMext: 0.3,
    dead1Load: 0.04591368227731864,
    dead10Load: 0.10101010101010101,
    dead100Load: 0.1652892561983471,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
tl2:
  { domain: 'behave',
    label: 'Low load broadleaf litter',
    depth: 0.2,
    deadMext: 0.25,
    dead1Load: 0.06427915518824609,
    dead10Load: 0.10560146923783285,
    dead100Load: 0.10101010101010101,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl3: { domain: 'behave',
    label: 'Moderate load conifer litter',
    depth: 0.3,
    deadMext: 0.2,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.10101010101010101,
    dead100Load: 0.12855831037649218,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl4: { domain: 'behave',
    label: 'Small downed logs',
    depth: 0.4,
    deadMext: 0.25,
    dead1Load: 0.02295684113865932,
    dead10Load: 0.06887052341597796,
    dead100Load: 0.1928374655647383,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl5: { domain: 'behave',
    label: 'High load conifer litter',
    depth: 0.6,
    deadMext: 0.25,
    dead1Load: 0.05280073461891643,
    dead10Load: 0.11478420569329659,
    dead100Load: 0.20202020202020202,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl6: { domain: 'behave',
    label: 'High load broadleaf litter',
    depth: 0.3,
    deadMext: 0.25,
    dead1Load: 0.11019283746556473,
    dead10Load: 0.055096418732782364,
    dead100Load: 0.055096418732782364,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl7: { domain: 'behave',
    label: 'Large downed logs',
    depth: 0.4,
    deadMext: 0.25,
    dead1Load: 0.013774104683195591,
    dead10Load: 0.06427915518824609,
    dead100Load: 0.371900826446281,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl8: { domain: 'behave',
    label: 'Long-needle litter',
    depth: 0.3,
    deadMext: 0.35,
    dead1Load: 0.2662993572084481,
    dead10Load: 0.06427915518824609,
    dead100Load: 0.050505050505050504,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  tl9: { domain: 'behave',
    label: 'Very high load broadleaf litter',
    depth: 0.6,
    deadMext: 0.35,
    dead1Load: 0.305325987144169,
    dead10Load: 0.1515151515151515,
    dead100Load: 0.19054178145087236,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 1800,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  sb1: { domain: 'behave',
    label: 'Low load activity fuel',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.06887052341597796,
    dead10Load: 0.13774104683195593,
    dead100Load: 0.505050505050505,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  sb2: { domain: 'behave',
    label: 'Moderate load activity or low load blowdown',
    depth: 1,
    deadMext: 0.25,
    dead1Load: 0.20661157024793386,
    dead10Load: 0.1951331496786042,
    dead100Load: 0.18365472910927455,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  sb3: { domain: 'behave',
    label: 'High load activity fuel or moderate load blowdown',
    depth: 1.2,
    deadMext: 0.25,
    dead1Load: 0.2525252525252525,
    dead10Load: 0.12626262626262624,
    dead100Load: 0.13774104683195593,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 },
  sb4: { domain: 'behave',
    label: 'High load blowdown',
    depth: 2.7,
    deadMext: 0.25,
    dead1Load: 0.24104683195592286,
    dead10Load: 0.16069788797061524,
    dead100Load: 0.24104683195592286,
    totalHerbLoad: 0,
    liveStemLoad: 0,
    dead1Savr: 2000,
    liveHerbSavr: 1800,
    liveStemSavr: 1600,
    deadHeat: 8000,
    liveHeat: 8000 }
};
