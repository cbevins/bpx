<?php
/*! \brief Contains the BehavePlus6 input, intermediate, and output variable values
 *  for fire behavior fuel model 124 - GS4.
*/
class Benchmark_gs4
{
    //--------------------------------------------------------------------------
    // INPUTS
    //--------------------------------------------------------------------------

    public function getFuelModelCode() { return 'gs4'; }
    public function getFuelModelNumber() { return 124; }

    public function getAirTemp() { return 95.; }
    public function getAirTemperature() { return 95.; }
    public function getAspect() { return 180.; }
    public function getElapsedMinutes() { return 60.; }
    public function getMoistureDead1() { return 0.05; }
    public function getMoistureDead10() { return 0.07; }
    public function getMoistureDead100() { return 0.09; }
    public function getMoistureLiveHerb() { return 0.50; }
    public function getMoistureLiveStem() { return 1.50; }
    public function getSlope() { return 0.25; }
    public function getSlopeSteepness() { return 0.25; }
    public function getWindHeadingDirectionFromNorth() { return 90.0; }
    public function getWindSourceDirectionFromNorth() { return 270.0; }
    public function getWindSpeed() { return 10.0; }
    public function getWindSpeedAtMidflameHeight() { return 10.0; }

    //--------------------------------------------------------------------------
    // Fuel/Particle properties
    //--------------------------------------------------------------------------

    public function getParticleCount() { return 6; }
    public function getParticleDensity( $idx )
    {
        $data = array( 32., 32., 32., 32., 32. );
        return $data[$idx];
    }
    public function getParticleEffectiveHeatingNumber( $idx )
    {
        $data = array(
            0.92619853500173854,    // 1-h
            0.28194167776446499,    // 10-h
            0.010051835744633586,   // 100-h
            0.91736486133477624,    // live herb
            0.91736486133477624,    // live stem
            0.91736486133477624     // dead herb
        );
        return $data[$idx];
    }
    public function getParticleEffectiveMineralContent( $idx )
    {
        $data = array( 0.01, 0.01, 0.01, 0.01, 0.01 );
        return $data[$idx];
    }
    public function getParticleHeatContent( $idx )
    {
        $data = array( 8000., 8000., 8000., 8000., 8000. );
        return $data[$idx];
    }
    public function getParticleIsLive( $idx )
    {
        $data = array( false, false, false, true, true );
        return $data[$idx];
    }
    public function getParticleLoad( $idx )
    {
        $f = 2000. / 43560.;
        $data = array( 1.9*$f, 0.3*$f, 0.1*$f, 3.4*$f, 7.1*$f );
        return $data[$idx];
    }
    public function getParticleSavr( $idx )
    {
        $data = array( 1800.,  109.,   30., 1600., 1600. );
        return $data[$idx];
    }
    public function getParticleSurfaceArea( $idx )
    {
        $data = array(
            4.9070247933884286,     // 1-h
            0.046918044077134985,   // 10-h
            0.0043044077134986227,  // 100-h
            1.7327823691460063,     // live herb
            16.299357208448114,     // live stem
            6.0725436179981624      // cured herb
        );
        return $data[$idx];
    }
    public function getParticleSurfaceAreaWtg( $idx )
    {
        $data = array(
            0.44484795825192963,    // 1-h
            0.0042533708289000296,  // 10-h
            0.00039021750723853486, // 100-h
            0.096094108061312897,   // live herb
            0.90390589193868720,    // live stem
            0.55050845341193189     // cured herb
        );
        return $data[$idx];
    }
    public function getParticleSizeClassWtg( $idx )      // individual particle swtg
    {
        $data = array(
            0.99535641166386157,
            0.0042533708289000296,
            0.00039021750723853486,
            1.0000000000000000,
            1.0000000000000000,
            0.99535641166386157
        );
        return $data[$idx];
    }
    public function getParticleTotalMineralContent( $idx )
    {
        $data = array( 0.0555, 0.0555, 0.0555, 0.0555, 0.0555 );
        return $data[$idx];
    }

    //--------------------------------------------------------------------------
    // Fuel/Model properties
    //--------------------------------------------------------------------------

    public function getDeadMoistureOfExtinction() { return 0.40; }
    public function getFuelDepth() { return 2.1; }

    //--------------------------------------------------------------------------
    // Fuel/Bed properties
    //--------------------------------------------------------------------------

    public function getBedEffectiveHeatingNumber() { return exp( -138. / $this->getBedSavr() ); }
    public function getBedHerbLoad() { return 0.1561065197428833; }
    public function getBedFuelLoad() { return 0.58769513314967847; }
    public function getBedSavr() { return 1631.1287341340956; }
    public function getBedSavr15() { return 65876.779161248720; }
    public function getBedSurfaceArea() { return 29.062930440771346; }
    public function getBulkDensity() { return 0.27985482530937067; }

    public function getDeadEffectiveHeatingNumber() { return 0.19614226054223394; }
    public function getDeadEffectiveMineralContent() { return 0.01000000000000000; }
    public function getDeadHeatContent() { return 8000.000000000000; }
    public function getDeadHerbLoad() { return 0.12145087235996324; }
    public function getDeadLoad() {
        return $this->getParticleLoad(0)    // 1h
            + $this->getParticleLoad(1)     // 10h
            + $this->getParticleLoad(2)     // 100h
            + $this->getDeadHerbLoad();    // dead herb portion of particle[3]
    }
    public function getDeadLoadWtd() { return 0.20777819078484744; }
    public function getDeadMineralDamping() { return 0.41739692790939131; }
    public function getDeadReactionIntensityDry() { return 9769.8093293148086; }
    public function getDeadSavr() { return 1682.0151742581315; }
    public function getDeadSizeClassWtg( $idx )  // Dead fuel load area weights for 6 size classes
    {
        $data = array(
            0.99535641166386157,
            0.0,
            0.0042533708289000296,
            0.0,
            0.00039021750723853486,
            0.0
        );
        return $data[$idx];
    }
    public function getDeadSurfaceArea() { return 11.030790863177224; }
    public function getDeadSurfaceAreaWtg() { return 0.37954847277556436; }
    public function getDeadTotalMineralContent() { return 0.05550000000000000; }

    public function getHerbCuredFraction()
    {
        return $this->getDeadHerbLoad() / ($this->getDeadHerbLoad()+$this->getLiveHerbLoad() );
    }

    public function getLiveEffectiveHeatingNumber() { return 0.26385190276630305; }
    public function getLiveEffectiveMineralContent() { return 0.01000000000000000; }
    public function getLiveMineralDamping() { return 0.41739692790939131; }
    public function getLiveHeatContent() { return 8000.000000000000; }
    public function getLiveHerbLoad() { return 0.034655647382920124; }
    public function getLiveLoad()
    {
        return $this->getParticleLoad(4)    // stem
            + $this->getLiveHerbLoad();     // live herb portion of particle[3]
    }
    public function getLiveLoadWtd() { return 0.36064279155188239; }  // weighted net load
    public function getLiveMoistureOfExtinctionFactor() { return 2.1558023634049093; }
    public function getLiveReactionIntensityDry() { return 16957.560830348066; }
    public function getLiveSavr() { return 1600.0; }
    public function getLiveSizeClassWtg( $idx )  // Live fuel load area weights for 6 size classes
    {
        $data = array( 1.0, 0., 0., 0., 0., 0. );
        return $data[$idx];
    }
    public function getLiveSurfaceArea() { return 18.032139577594119; }
    public function getLiveSurfaceAreaWtg() { return 0.62045152722443553; }
    public function getLiveTotalMineralContent() { return 0.05550000000000000; }

    public function getPackingRatio() { return 0.0087454632909178334; }
    public function getPackingRatioOptimum() { return 0.0078357185983373434; }
    public function getPackingRatioRatio() { return 1.1161022669667500; }
    public function getPropagatingFluxRatio() { return 0.035258653482453904; }
    public function getReactionVelocityExponent() { return 0.38177694461561407; }   // this is 'aa'
    public function getReactionVelocityOptimum() { return 14.908876941781589; }    // gamma
    public function getReactionVelocityMaximum() { return 14.944549319976806; }
    public function getResidenceTime() { return 0.23541979977677915; }
    public function taur() { return 0.23541979977677915; }

    public function getSlopeFactor() { return 21.861885612259275; }
    public function slopeK()         { return 21.861885612259275; }
    public function getWindFactorB() { return 1.3714405772749918; }         // BP m_windB
    public function windB()          { return 1.3714405772749918; }         // BP m_windB
    public function getWindFactorC() { return 0.0031370920040753444; }      // BP c
    public function windC()          { return 0.0031370920040753444; }      // BP c
    public function getWindFactorE() { return 0.39810163107222579; }        // BP e
    public function windE()          { return 0.39810163107222579; }        // BP e
    public function getWindFactorK() { return 0.0030028678448152332; }      // BP m_windK
    public function windK()          { return 0.0030028678448152332; }      // BP m_windK
    public function getWindFactorI() { return 333.01498823086911; }         // BP m_windE
    public function windI()          { return 333.01498823086911; }         // BP m_windE

    //--------------------------------------------------------------------------
    // Fuel/Complex properties
    //--------------------------------------------------------------------------

    public function getDeadMoistureDamping() { return 0.74884711762612932; }
    public function getDeadMoistureContent() { return 0.050100676116867547; }
    public function getDeadReactionIntensity() { return 7316.0935560142625; }
    public function getHeatOfPreIgnition() { return $this->getHeatSink() / $this->getBulkDensity(); } // Qig
    public function getHeatPerUnitArea() { return 3054.970442; }
    public function hpua() { return 3054.970442; }
    public function getHeatSink() { return 319.21640437931171; }  // rbQig
    public function getLiveMoistureDamping() { return 0.33380976126895767; }
    public function getLiveMoistureOfExtinction() { return 1.6581421656244677; }
    public function getLiveMoistureContent() { return 1.4039058919386871; }
    public function getLiveReactionIntensity() { return 5660.5993324823157; }
    public function getReactionIntensity() { return 12976.692888496578; }
    public function rxInt() { return 12976.692888496578; }
    public function getSpreadRateNoWindNoSlope() { return 1.4333245773924823; }
    public function ros0() { return 1.4333245773924823; }
    public function getWaterMass() { return 0.0098866289779641001; }    // wfmd
    public function getWaterRatio() { return 0.050405399380187531; } // fdmois

    //--------------------------------------------------------------------------
    // SurfaceFire\Spread properties
    //--------------------------------------------------------------------------

    public function getEffectiveWindSpeed() { return 880.55684333220040; }
    public function effWind() { return 880.55684333220040; }
    public function getEllipseLengthToWidthRatio() { return 3.501582; }
    public function getEffectiveWindCoefficient() { return 32.816782854703028; }    // phiEw
    public function phiEw() { return 32.816782854703028; }    // phiEw
    public function getEffectiveWindSpeedExceedsLimit() { return false; }
    public function getEffectiveWindSpeedLimit() { return 11679.023599646920; }
    public function windSpeedLimit() { return 11679.023599646920; }
    public function getFirelineIntensityAtHead() { return 2467.928645; }
    public function fliAtHead() { return 2467.928645; }
    public function getFlameLengthAtHead() { return 16.356317; }
    public function flameAtHead() { return 16.356317; }
    public function getHeadingDirectionFromNorth() { return 87.613728665173383; }
    public function getHeadingDirectionFromUpslope() { return 87.613728665173383; }
    public function dirMaxRos() { return 87.613728665173383; }
    public function getSpreadRateAtHead() { return 48.470425993990560; }
    public function rosMax() { return 48.470425993990560; }
    public function getSlopeCoefficient() { return 1.3663678507662047; }    // phiS
    public function phiS() { return 1.3663678507662047; }    // phiS
    public function getWindCoefficient() { return 32.788325298000515; }     // phiS
    public function phiW() { return 32.788325298000515; }     // phiS

    public function getSpreadDistanceAtHead() { return 2908.225560; }
    public function getSpreadDistanceAtFlank() { return 424.104367; }
    public function getSpreadDistanceAtBack() { return 61.846824; }

    public function getFireLength() { return 2970.072383; }
    public function getFireWidth() { return 848.208733; }
    public function getFireArea() { return 1978607.419499; }
    public function getFirePerimeter() { return 6469.728229; }

    public function getScorchHeightAtHead() { return 215.682771; }
    public function scorchAtHead() { return 215.682771; }

    public function getWindAdjustmentfactor() { return 1.000000; }
}
