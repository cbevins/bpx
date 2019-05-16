const fm124In = {
  configs: {
    fuel: {
      curedHerbFraction: 'estimated',
      moisture: 'individual',
      primary: 'catalog',
    },
  },
  site: {
    moisture: {
      dead: {
        tl1h: 0.05,
        tl10h: 0.07,
        tl100h: 0.09,
      },
      live: {
        herb: 0.5,
        stem: 1.5,
      },
    },
  },
  surface: {
    fuel: {
      primary: {
        model: {
          key: '124',
        },
      },
    },
  },
};

const fm124Out = {
  surface: {
    fuel: {
      primary: {
        bed: {
          depth: 2.1,
          area: 29.062930440771346,
          bulkDensity: 0.27985482530937067,
          ewsLimit: 11679.023599646920,
          flameResidenceTime: 0.23541979977677915,
          heatPreignition: 319.21640437931171 / 0.27985482530937067,
          heatSink: 319.21640437931171,
          packingRatio: 0.0087454632909178334,
          packingRatioOptimum: 0.0078357185983373434,
          packingRatioRatio: 1.1161022669667500,
          hpua: 12976.692888496578 * 0.23541979977677915, // about 3054.970442,
          // phiLimit:
          propagatingFluxRatio: 0.035258653482453904,
          reactionIntensity: 12976.692888496578,
          reactionVelocityExp: 0.38177694461561407,
          reactionVelocityOpt: 14.908876941781589,
          reactionVelocityMax: 14.944549319976806,
          ros0: 1.4333245773924823,
          // rosLimit:
          savr: 1631.1287341340956,
          slopeK: 21.861885612259275,
          windB: 1.3714405772749918,
          windC: 0.0031370920040753444,
          windE: 0.39810163107222579,
          windK: 0.0030028678448152332,
          windI: 333.01498823086911,
          dead: {
            area: 11.030790863177224,
            awtg: 0.37954847277556436,
            // efld:
            efwl: 0.0098866289779641001,
            efmc: 0.050405399380187531,
            // pprc:
            // qign:
            moistureDamping: 0.74884711762612932,
            mois: 0.050100676116867547,
            rxi: 7316.0935560142625,
            heat: 8000,
            mineralDamping: 0.41739692790939131,
            rxiDry: 9769.8093293148086,
            savr: 1682.0151742581315,
            seff: 0.01,
            // swtg: [0.99535641166386157, 0.0, 0.0042533708289000296, 0.0,
            // 0.00039021750723853486, 0.0],
            wnet: (1 - 0.0555) * 0.20777819078484744,
            particle: {
              class1: {
                area: 4.9070247933884286, // 1-h
                awtg: 0.44484795825192963, // 1-h
                load: 1.9 * 2000 / 43560,
                mois: 0.05,
                swtg: 0.99535641166386157,
              },
              class2: {
                area: 0.046918044077134985, // 10-h
                awtg: 0.0042533708289000296, // 10-h
                load: 0.3 * 2000 / 43560,
                mois: 0.07,
                swtg: 0.0042533708289000296,
              },
              class3: {
                area: 0.0043044077134986227, // 100-h
                awtg: 0.00039021750723853486, // 100-h
                load: 0.1 * 2000 / 43560,
                mois: 0.09,
                swtg: 0.00039021750723853486,
              },
              class4: { // cured herb
                area: 6.0725436179981624, // cured herb
                awtg: 0.55050845341193189,
                load: 0.12145087235996324,
                mois: 0.05,
                swtg: 0.99535641166386157,
              },
            },
          }, // dead
          live: {
            area: 18.032139577594119,
            awtg: 0.62045152722443553,
            // efld:
            // efwl:
            // efmc:
            // pprc:
            // qign:
            moistureDamping: 0.33380976126895767,
            mois: 1.4039058919386871,
            rxi: 5660.5993324823157,
            mineralDamping: 0.41739692790939131,
            heat: 8000,
            // herbLoad: 0.034655647382920124,
            mext: 1.6581421656244677,
            mxtk: 2.1558023634049093,
            rxiDry: 16957.560830348066,
            savr: 1600,
            seff: 0.01,
            wnet: (1 - 0.0555) * 0.36064279155188239,
            particle: {
              class1: { // live herb
                area: 1.7327823691460063, // live herb
                awtg: 0.096094108061312897,
                load: 0.034655647382920124,
                mois: 0.5,
                savr: 1600,
                swtg: 1,
              },
              class2: { // live stem
                area: 16.299357208448114, // live stem
                awtg: 0.90390589193868720,
                load: 7.1 * 2000 / 43560,
                mois: 1.5,
                savr: 1600,
                swtg: 1,
              },
            },
          }, // live
        },
        model: {
          key: '124',
          domain: 'behave',
          behave: {
            parms: {
              curedHerbFraction: 0.778,
              depth: 2.1,
              deadMext: 0.4,
              dead1Load: 1.9 * 2000 / 43560,
              dead10Load: 0.3 * 2000 / 43560,
              dead100Load: 0.1 * 2000 / 43560,
              liveStemLoad: 7.1 * 2000 / 43560,
              totalHerbLoad: 3.4 * 2000 / 43560,
              dead1Savr: 1800,
              liveHerbSavr: 1600,
              liveStemSavr: 1600,
              deadHeat: 8000,
              liveHeat: 8000,
            },
          },
        },
      },
    },
  },
};

module.exports = {
  fm124In, fm124Out,
};
