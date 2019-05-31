<?php
require_once 'bootstrap.php';
require_once "Benchmark_fm10.php";
require_once "Benchmark_gs4.php";

/**
 * Spread test case.
 */
class CrownFireSpreadTest extends PHPUnit_Framework_TestCase
{
    private $app = null;
    private $catalog = null;

    /**
     * Prepares the environment before running a test.
     */
    protected function setUp()
    {
        parent::setUp();
        $this->app = new \Sem\Behave\Application\BehaveApp();
        $this->catalog = $this->app->getFuelCatalog();
    }

    /**
     * Cleans up the environment after running a test.
     */
    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Constructs the test case.
     */
    public function __construct()
    {}

    /**
     * Tests benchmark active crown fire against Benchmark_gs4.
     */
    public function test__activeCrownFireBenchmarkGs4()
    {
        $d1 = 1.0e-1;
        $d5 = 1.0e-5;
        $d6 = 1.0e-6;
        $d7 = 1.0e-7;
        $d8 = 1.0e-8;
        $d9 = 1.0e-9;

        $bm = new Benchmark_gs4();
        $this->assertEquals( true, $this->catalog->has( '124' ), __LINE__ );
        $crown = $this->catalog->getCrownFireSpread( '124', array( 'herbMoisture'=>$bm->getMoistureLiveHerb() ) );

        // The Fuel\Bed, Fuel\Complex, and SurfaceFire\Spread all gets updated on creation
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        $crown->setMoistureContents(
            $bm->getMoistureDead1(),
            $bm->getMoistureDead10(),
            $bm->getMoistureDead100(),
            $bm->getMoistureLiveHerb(),
            $bm->getMoistureLiveStem() );
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        $crown->setWindSpeedAtMidflameHeight( $bm->getWindSpeedAtMidflameHeight() * 88. );
        $this->assertEquals( $bm->getWindSpeedAtMidflameHeight() * 88., $crown->getWindSpeedAtMidflameHeight(), __LINE__ );

        $crown->setWindSourceDirectionFromNorth( $bm->getWindSourceDirectionFromNorth() );
        $this->assertEquals( $crown->getWindSourceDirectionFromNorth(), $bm->getWindSourceDirectionFromNorth(), __LINE__ );

        $crown->setSlopeSteepness( $bm->getSlopeSteepness() );
        $this->assertEquals( $crown->getSlopeSteepness(), $bm->getSlopeSteepness(), __LINE__ );

        $crown->setAspect( $bm->getAspect() );
        $this->assertEquals( $crown->getAspect(), $bm->getAspect(), __LINE__ );

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertTrue( $crown->getEnvironmentChanged(), __LINE__ );
        $this->assertTrue( $crown->getCanopyChanged(), __LINE__ );

        $crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        // Fuel/Model properties
        $this->assertEquals( "Standard gs4 (124) herbMoisture 0.5", $crown->getDescription(), __LINE__ );
        $this->assertEquals( $bm->getParticleCount(), $crown->getParticleCount(), __LINE__ );
        $this->assertEquals( $bm->getFuelDepth(), $crown->getFuelDepth(), __LINE__ );
        $this->assertEquals( $bm->getDeadMoistureOfExtinction(), $crown->getDeadMoistureOfExtinction(), __LINE__ );

        // Fuel/Bed properties
        $this->assertEquals( $bm->getBedEffectiveHeatingNumber(), $crown->getBedEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getBedFuelLoad(), $crown->getBedFuelLoad(), __LINE__ );
        $this->assertEquals( $bm->getBedSavr(), $crown->getBedSavr(), __LINE__ );
        $this->assertEquals( $bm->getBedSavr15(), $crown->getBedSavr15(), __LINE__ );
        $this->assertEquals( $bm->getBedSurfaceArea(), $crown->getBedSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getBulkDensity(), $crown->getBulkDensity(), __LINE__ );

        $this->assertEquals( $bm->getDeadEffectiveHeatingNumber(), $crown->getDeadEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getDeadEffectiveMineralContent(), $crown->getDeadEffectiveMineralContent(), __LINE__ );
        $this->assertEquals( $bm->getDeadHeatContent(), $crown->getDeadHeatContent(), __LINE__ );
        $this->assertEquals( $bm->getDeadLoad(), $crown->getDeadLoad(), __LINE__ );
        $this->assertEquals( $bm->getDeadLoadWtd(), $crown->getDeadLoadWtd(), __LINE__ );
        $this->assertEquals( $bm->getDeadMineralDamping(), $crown->getDeadMineralDamping(), __LINE__ );
        $this->assertEquals( $bm->getDeadReactionIntensityDry(), $crown->getDeadReactionIntensityDry(), __LINE__ );
        $this->assertEquals( $bm->getDeadSavr(), $crown->getDeadSavr(), __LINE__ );
        $this->assertEquals( $bm->getDeadSizeClassWtg(0), $crown->getDeadSizeClassWtg(0), __LINE__ );
        $this->assertEquals( $bm->getDeadSurfaceArea(), $crown->getDeadSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getDeadSurfaceAreaWtg(), $crown->getDeadSurfaceAreaWtg(), __LINE__ );
        $this->assertEquals( $bm->getDeadTotalMineralContent(), $crown->getDeadTotalMineralContent(), __LINE__ );

        $this->assertEquals( $bm->getLiveEffectiveHeatingNumber(), $crown->getLiveEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getLiveEffectiveMineralContent(), $crown->getLiveEffectiveMineralContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveHeatContent(), $crown->getLiveHeatContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveLoad(), $crown->getLiveLoad(), __LINE__ );
        $this->assertEquals( $bm->getLiveLoadWtd(), $crown->getLiveLoadWtd(), __LINE__ );
        $this->assertEquals( $bm->getLiveMineralDamping(), $crown->getLiveMineralDamping(), __LINE__ );
        $this->assertEquals( $bm->getLiveReactionIntensityDry(), $crown->getLiveReactionIntensityDry(), __LINE__ );
        $this->assertEquals( $bm->getLiveSavr(), $crown->getLiveSavr(), __LINE__ );
        $this->assertEquals( $bm->getLiveSizeClassWtg(0), $crown->getLiveSizeClassWtg(0), __LINE__ );
        $this->assertEquals( $bm->getLiveSurfaceArea(), $crown->getLiveSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getLiveSurfaceAreaWtg(), $crown->getLiveSurfaceAreaWtg(), __LINE__ );
        $this->assertEquals( $bm->getLiveTotalMineralContent(), $crown->getLiveTotalMineralContent(), __LINE__ );

        $this->assertEquals( $bm->getLiveMoistureOfExtinctionFactor(), $crown->getLiveMoistureOfExtinctionFactor(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatio(), $crown->getPackingRatio(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatioOptimum(), $crown->getPackingRatioOptimum(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatioRatio(), $crown->getPackingRatioRatio(), __LINE__ );
        $this->assertEquals( $bm->getPropagatingFluxRatio(), $crown->getPropagatingFluxRatio(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityExponent(), $crown->getReactionVelocityExponent(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityMaximum(), $crown->getReactionVelocityMaximum(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityOptimum(), $crown->getReactionVelocityOptimum(), __LINE__ );
        $this->assertEquals( $bm->getResidenceTime(), $crown->getResidenceTime(), __LINE__ );

        $this->assertEquals( $bm->getSlopeFactor(), $crown->getSlopeFactor(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorB(), $crown->getWindFactorB(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorE(), $crown->getWindFactorE(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorK(), $crown->getWindFactorK(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorKInverse(), $crown->getWindFactorKInverse(), __LINE__ );

        // Fuel/Complex properties
        $this->assertEquals( $bm->getDeadMoistureContent(), $crown->getDeadMoistureContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveMoistureContent(), $crown->getLiveMoistureContent(), __LINE__ );

        $this->assertEquals( $bm->getDeadMoistureDamping(), $crown->getDeadMoistureDamping(), __LINE__ );
        $this->assertEquals( $bm->getLiveMoistureDamping(), $crown->getLiveMoistureDamping(), __LINE__ );

        $this->assertEquals( $bm->getWaterMass(), $crown->getWaterMass(), __LINE__ );
        $this->assertEquals( $bm->getWaterRatio(), $crown->getWaterRatio(), __LINE__ );
        $this->assertEquals( $bm->getLiveMoistureOfExtinction(), $crown->getLiveMoistureOfExtinction(), __LINE__ );

        $this->assertEquals( $bm->getHeatOfPreIgnition(), $crown->getHeatOfPreIgnition(), __LINE__ );
        $this->assertEquals( $bm->getHeatSink(), $crown->getHeatSink(), __LINE__ );

        $this->assertEquals( $bm->getDeadReactionIntensity(), $crown->getDeadReactionIntensity(), __LINE__ );
        $this->assertEquals( $bm->getLiveReactionIntensity(), $crown->getLiveReactionIntensity(), __LINE__ );
        $this->assertEquals( $bm->getReactionIntensity(), $crown->getReactionIntensity(), __LINE__ );
        $this->assertEquals( $bm->getHeatPerUnitArea(), $crown->getHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( $bm->getSpreadRateNoWindNoSlope(), $crown->getSpreadRateNoWindNoSlope(), __LINE__, $d7 );

        // SurfaceFire\Spread properties
        $this->assertEquals( $bm->getSlopeCoefficient(), $crown->getSlopeCoefficient(), __LINE__ );
        $this->assertEquals( $bm->getWindCoefficient(), $crown->getWindCoefficient(), __LINE__ );
        $this->assertEquals( $bm->getEffectiveWindSpeedLimit(), $crown->getEffectiveWindSpeedLimit(), __LINE__ );
        $this->assertEquals( $bm->getEffectiveWindSpeed(), $crown->getEffectiveWindSpeed(), __LINE__, $d8 );
        $this->assertEquals( $bm->getEffectiveWindSpeedExceedsLimit(), $crown->getEffectiveWindSpeedExceedsLimit(), __LINE__ );
        $this->assertEquals( $bm->getSpreadRateAtHead(), $crown->getSpreadRateAtHead(), __LINE__, $d7 );
        $this->assertEquals( $bm->getHeadingDirectionFromUpslope(), $crown->getHeadingDirectionFromUpslope(), __LINE__, $d7 );
        $this->assertEquals( $bm->getEllipseLengthToWidthRatio(), $crown->getEllipseLengthToWidthRatio(), __LINE__, $d6 );
        //$this->assertEquals( $bm->getEffectiveWindCoefficient(), $crown->getEffectiveWindCoefficient(), __LINE__ );

        $elapsed = $bm->getElapsedMinutes();
        $this->assertEquals( $bm->getSpreadDistanceAtHead(), $crown->getSpreadDistanceAtHead( $elapsed ), __LINE__, $d6 );
        $this->assertEquals( $bm->getSpreadDistanceAtBack(), $crown->getSpreadDistanceAtBack( $elapsed ), __LINE__, $d6 );
        $this->assertEquals( $bm->getSpreadDistanceAtFlank(), $crown->getSpreadDistanceAtFlank( $elapsed ), __LINE__, $d6 );
        $this->assertEquals( $bm->getFireLength(), $crown->getFireLength( $elapsed ), __LINE__, $d6 );
        $this->assertEquals( $bm->getFireWidth(), $crown->getFireWidth( $elapsed ), __LINE__, $d6 );
        $this->assertEquals( $bm->getFirePerimeter(), $crown->getFirePerimeter( $elapsed ), __LINE__, $d5 );
        $this->assertEquals( $bm->getFireArea(), $crown->getFireArea( $elapsed ), __LINE__, $d1 );

        $airTemp = $bm->getAirTemperature();
        $this->assertEquals( $bm->getScorchHeightAtHead(), $crown->getScorchHeightAtHead( $airTemp ), __LINE__, $d1 );

        // CrownFire\Spread properties
        $canopyHeight = 100.;
        $crown->setCanopyHeight( $canopyHeight );
        $this->assertEquals( $canopyHeight, $crown->getCanopyHeight(), __LINE__ );

        $canopyBaseHeight = 10.;
        $crown->setCanopyBaseHeight( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );
        $this->assertEquals( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );

        $canopyBulkDensity = 0.02;
        $crown->setCanopyBulkDensity( $canopyBulkDensity );
        $this->assertEquals( $canopyBulkDensity, $crown->getCanopyBulkDensity(), __LINE__ );

        $canopyHeatContent = 8000.;
        $crown->setCanopyHeatContent( $canopyHeatContent );
        $this->assertEquals( $canopyHeatContent, $crown->getCanopyHeatContent(), __LINE__ );

        $canopyFoliarMoistureContent = 0.5;
        $crown->setCanopyFoliarMoistureContent( $canopyFoliarMoistureContent );
        $this->assertEquals( $canopyFoliarMoistureContent, $crown->getCanopyFoliarMoistureContent(), __LINE__ );

        $windSpeedAt20Ft = 25. * 88.;   // must be FtPerMinute
        $crown->setWindSpeedAt20Ft( $windSpeedAt20Ft );
        $this->assertEquals( $windSpeedAt20Ft, $crown->getWindSpeedAt20Ft(), __LINE__ );

        $crown->updateCrownFireSpread();

        // Set by CrownFire\Spread->updateCrownFireSpread()
        $this->assertEquals( 61.909081476126, $crown->getActiveCrownFireSpreadRateAtHead(), __LINE__ );
        // Set by CrownFire\Spread->updateCanopyDependents()
        $this->assertEquals( 4.125000, $crown->getCrownFireLengthToWidthRatio(), __LINE__ );
        $this->assertEquals( 1.80000000000, $crown->getCanopyFuelLoad(), __LINE__ );
        $this->assertEquals( 14400.0000000, $crown->getCanopyHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 112.938700503, $crown->getCriticalSurfaceFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 3.95840471719, $crown->getCriticalSurfaceFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 30.7223522801, $crown->getCriticalCrownFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 2.015115278658, $crown->getActiveCrownFireRatio(), __LINE__ );
        $this->assertEquals( 47.96568165233, $crown->getPowerOfTheWind(), __LINE__ );
        // Set by CrownFire\Spread->updateSurfaceFireDependents()
        $this->assertEquals( 17454.97044157461, $crown->getActiveCrownFireHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 18010.35312051372, $crown->getActiveCrownFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 137.418376789506, $crown->getActiveCrownFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 3714.544888567592, $crown->getActiveCrownFireLength( 60. ), __LINE__ );
        $this->assertEquals( 900.495730561840, $crown->getActiveCrownFireWidth( 60. ), __LINE__ );
        $this->assertEquals( 7938.77291469162, $crown->getActiveCrownFirePerimeter( 60. ), __LINE__ );
        $this->assertEquals( 2627103.30, $crown->getActiveCrownFireArea( 60. ), __LINE__, 0.01 );
        $this->assertEquals( 2467.92864505662, $crown->getFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 21.851930596532, $crown->getCrownFireTransitionRatio(), __LINE__ );
        $this->assertEquals( 3, $crown->getFinalFireType(), __LINE__ );
        $this->assertTrue( $crown->getIsCrownFire(), __LINE__ );
        $this->assertTrue( $crown->getIsActiveCrownFire(), __LINE__ );
        $this->assertFalse( $crown->getIsPassiveCrownFire(), __LINE__ );
        $this->assertFalse( $crown->getIsSurfaceFire(), __LINE__ );
        $this->assertEquals( 139.615140469098, $crown->getPowerOfTheFire(), __LINE__ );
        $ratio = 139.615140469098 / 47.96568165233;
        $this->assertEquals( 2.9107298314046, $crown->getPowerRatio(), __LINE__ );
        $this->assertTrue( $crown->getIsPlumeDominated(), __LINE__ );
        $this->assertFalse( $crown->getIsWindDriven(), __LINE__ );
        $this->assertEquals( 2.21813014553, $crown->getCriticalSurfaceFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 1472.7891731058, $crown->getFullCrownFireU20(), __LINE__ );
        $this->assertEquals( 28.608788181, $crown->getFullCrownFireSpreadRateAtHead(), __LINE__, $d9 );
        $this->assertEquals( 1.000000000, $crown->getCrownFractionBurned(), __LINE__ );
        $this->assertEquals( 61.909081476126, $crown->getPassiveCrownFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 17454.97044157461, $crown->getPassiveCrownFireHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 18010.35312051372, $crown->getPassiveCrownFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 137.418376789506, $crown->getPassiveCrownFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 61.909081476126, $crown->getFinalFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 17454.97044157461, $crown->getFinalFireHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 18010.35312051372, $crown->getFinalFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 137.418376789506, $crown->getFinalFireFlameLengthAtHead(), __LINE__ );

        $this->assertEquals( "Crown Canopy (Rothermel 1991)", $crown->getCanopyFuelModel()->getDescription(), __LINE__ );
    }

    /**
     * Tests active crown fire against BehavePlus6 run.
     */
    public function test__activeCrownFireBenchmarkBp6()
    {
        $d1 = 1.0e-1;
        $d4 = 1.0e-4;
        $d5 = 1.0e-5;
        $d6 = 1.0e-6;
        $d7 = 1.0e-7;
        $d8 = 1.0e-8;
        $d9 = 1.0e-9;

        // Define all the input parameter values
        $fuelModel = '124';
        $mcDead1 = 0.05;
        $mcDead10 = 0.07;
        $mcDead100 = 0.09;
        $mcHerb = 0.50;
        $mcStem = 1.50;
        $windSpeedAtMidflameHeightMph = 10.0;
        $windSpeedAtMidflameHeightFpm = 88. * $windSpeedAtMidflameHeightMph;
        $windSourceDirectionFromNorth = 270.;
        $windHeadingDirectionFromNorth = $windSourceDirectionFromNorth - 180.;
        $slopeSteepness = 0.25;
        $aspect = 180.;

        $canopyHeight = 100.;
        $canopyBaseHeight = 10.;
        $canopyBulkDensity = 0.02;
        $canopyHeatContent = 8000.;
        $canopyFoliarMoistureContent = 0.50;
        $windSpeedAt20FtMph = 25.;
        $windSpeedAt20FtFpm = 88. * $windSpeedAt20FtMph;

        $airTemp = 77.;
        $elapsedMinutes = 60.;

        // Create the model
        $bm = new Benchmark_gs4();

        $this->assertEquals( true, $this->catalog->has( $fuelModel ), __LINE__ );
        $crown = $this->catalog->getCrownFireSpread( $fuelModel, array( 'herbMoisture'=>$mcHerb ) );

        // The Fuel\Bed, Fuel\Complex, and SurfaceFire\Spread all gets updated on creation
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );
        $this->assertTrue( $crown->getCanopyChanged(), __LINE__ );

        $crown->resetInputs();
        $crown->resetOutputs();
        $this->assertTrue( $crown->getCanopyChanged(), __LINE__ );

        // Set and test the surface fire input parameter values
        $crown->setMoistureContents( $mcDead1, $mcDead10, $mcDead100, $mcHerb, $mcStem );
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        $crown->setWindSpeedAtMidflameHeight( $windSpeedAtMidflameHeightFpm );
        $this->assertEquals( $windSpeedAtMidflameHeightFpm, $crown->getWindSpeedAtMidflameHeight(), __LINE__ );

        $crown->setWindSourceDirectionFromNorth( $windSourceDirectionFromNorth );
        $this->assertEquals( $windSourceDirectionFromNorth, $crown->getWindSourceDirectionFromNorth(), __LINE__ );

        $crown->setSlopeSteepness( $slopeSteepness );
        $this->assertEquals( $slopeSteepness, $crown->getSlopeSteepness(), __LINE__ );

        $crown->setAspect( $aspect );
        $this->assertEquals( $aspect, $crown->getAspect(), __LINE__ );

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertTrue( $crown->getEnvironmentChanged(), __LINE__ );

        // Perform one (or more) updates
        $crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        // Fuel/Model properties
        $this->assertEquals( "Standard gs4 (124) herbMoisture 0.5", $crown->getDescription(), __LINE__ );
        $this->assertEquals( 6, $crown->getParticleCount(), __LINE__ );
        $this->assertEquals( 2.1, $crown->getFuelDepth(), __LINE__ );
        $this->assertEquals( 0.40, $crown->getDeadMoistureOfExtinction(), __LINE__ );

        // BehavePlus6 Outputs
        $this->assertEquals( 48.470426, $crown->getSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3054.970442, $crown->getHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 2467.92864505662, $crown->getFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 16.356317, $crown->getFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 12976.692888, $crown->getReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 87.613728665173383, $crown->getHeadingDirectionFromNorth(), __LINE__, $d8 );
        $this->assertEquals( 2908.225560, $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 880.556843, $crown->getEffectiveWindSpeed(), __LINE__, $d4 );
        $this->assertEquals( 11679.023600, $crown->getEffectiveWindSpeedLimit(), __LINE__, $d4 );
        $this->assertEquals( .05010068, $crown->getDeadMoistureContent(), __LINE__, $d8 );
        $this->assertEquals( 1.40390589, $crown->getLiveMoistureContent(), __LINE__, $d8 );
        $this->assertEquals( 1.65814217, $crown->getLiveMoistureOfExtinction(), __LINE__, $d8 );
        $this->assertEquals( 1631.128734, $crown->getBedSavr(), __LINE__, $d6 );
        $this->assertEquals( 0.279855, $crown->getBulkDensity(), __LINE__, $d6 );
        $this->assertEquals( 0.008745, $crown->getPackingRatio(), __LINE__, $d6 );
        $this->assertEquals( 1.116102, $crown->getPackingRatioRatio(), __LINE__, $d6 );
        $this->assertEquals( 7316.093556, $crown->getDeadReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 5660.599332, $crown->getLiveReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 32.788325, $crown->getWindCoefficient(), __LINE__, $d6 );
        $this->assertEquals( 1.366368, $crown->getSlopeCoefficient(), __LINE__, $d6 );
        $this->assertEquals( 15472.555105, $crown->getHeatSource(), __LINE__, $d6 );
        $this->assertEquals( 319.216404, $crown->getHeatSink(), __LINE__, $d6 );
        $this->assertEquals( 0.235420, $crown->getResidenceTime(), __LINE__, $d6 );
        $this->assertEquals( 3.501582, $crown->getEllipseLengthToWidthRatio(), __LINE__, $d6 );
        //$this->assertEquals( 0.778, $crown->getHerbCured(), __LINE__, $d6 );
        $this->assertEquals( 1978607.419499, $crown->getFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 6469.728229, $crown->getFirePerimeter( $elapsedMinutes ), __LINE__, $d4 );
        $this->assertEquals( 2908.225560, $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 424.104367, $crown->getSpreadDistanceAtFlank( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 61.846824, $crown->getSpreadDistanceAtBack( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 2970.072383, $crown->getFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 848.208733, $crown->getFireWidth( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 154.059122, $crown->getScorchHeightAtHead( $airTemp ), __LINE__, $d1 );

        // These are still good benchmark values
        $this->assertEquals( $bm->getBedEffectiveHeatingNumber(), $crown->getBedEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getBedFuelLoad(), $crown->getBedFuelLoad(), __LINE__ );
        $this->assertEquals( $bm->getBedSavr15(), $crown->getBedSavr15(), __LINE__ );
        $this->assertEquals( $bm->getBedSurfaceArea(), $crown->getBedSurfaceArea(), __LINE__ );

        $this->assertEquals( $bm->getDeadEffectiveHeatingNumber(), $crown->getDeadEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getDeadEffectiveMineralContent(), $crown->getDeadEffectiveMineralContent(), __LINE__ );
        $this->assertEquals( $bm->getDeadHeatContent(), $crown->getDeadHeatContent(), __LINE__ );
        $this->assertEquals( $bm->getDeadLoad(), $crown->getDeadLoad(), __LINE__ );
        $this->assertEquals( $bm->getDeadLoadWtd(), $crown->getDeadLoadWtd(), __LINE__ );
        $this->assertEquals( $bm->getDeadMineralDamping(), $crown->getDeadMineralDamping(), __LINE__ );
        $this->assertEquals( $bm->getDeadReactionIntensityDry(), $crown->getDeadReactionIntensityDry(), __LINE__ );
        $this->assertEquals( $bm->getDeadSavr(), $crown->getDeadSavr(), __LINE__ );
        $this->assertEquals( $bm->getDeadSizeClassWtg(0), $crown->getDeadSizeClassWtg(0), __LINE__ );
        $this->assertEquals( $bm->getDeadSurfaceArea(), $crown->getDeadSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getDeadSurfaceAreaWtg(), $crown->getDeadSurfaceAreaWtg(), __LINE__ );
        $this->assertEquals( $bm->getDeadTotalMineralContent(), $crown->getDeadTotalMineralContent(), __LINE__ );

        $this->assertEquals( $bm->getLiveEffectiveHeatingNumber(), $crown->getLiveEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getLiveEffectiveMineralContent(), $crown->getLiveEffectiveMineralContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveHeatContent(), $crown->getLiveHeatContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveLoad(), $crown->getLiveLoad(), __LINE__ );
        $this->assertEquals( $bm->getLiveLoadWtd(), $crown->getLiveLoadWtd(), __LINE__ );
        $this->assertEquals( $bm->getLiveMineralDamping(), $crown->getLiveMineralDamping(), __LINE__ );
        $this->assertEquals( $bm->getLiveReactionIntensityDry(), $crown->getLiveReactionIntensityDry(), __LINE__ );
        $this->assertEquals( $bm->getLiveSavr(), $crown->getLiveSavr(), __LINE__ );
        $this->assertEquals( $bm->getLiveSizeClassWtg(0), $crown->getLiveSizeClassWtg(0), __LINE__ );
        $this->assertEquals( $bm->getLiveSurfaceArea(), $crown->getLiveSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getLiveSurfaceAreaWtg(), $crown->getLiveSurfaceAreaWtg(), __LINE__ );
        $this->assertEquals( $bm->getLiveTotalMineralContent(), $crown->getLiveTotalMineralContent(), __LINE__ );

        $this->assertEquals( $bm->getLiveMoistureOfExtinctionFactor(), $crown->getLiveMoistureOfExtinctionFactor(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatioOptimum(), $crown->getPackingRatioOptimum(), __LINE__ );
        $this->assertEquals( $bm->getPropagatingFluxRatio(), $crown->getPropagatingFluxRatio(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityExponent(), $crown->getReactionVelocityExponent(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityMaximum(), $crown->getReactionVelocityMaximum(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityOptimum(), $crown->getReactionVelocityOptimum(), __LINE__ );

        $this->assertEquals( $bm->getSlopeFactor(), $crown->getSlopeFactor(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorB(), $crown->getWindFactorB(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorE(), $crown->getWindFactorE(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorK(), $crown->getWindFactorK(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorKInverse(), $crown->getWindFactorKInverse(), __LINE__ );

        // Fuel/Complex properties
        $this->assertEquals( $bm->getDeadMoistureDamping(), $crown->getDeadMoistureDamping(), __LINE__ );
        $this->assertEquals( $bm->getLiveMoistureDamping(), $crown->getLiveMoistureDamping(), __LINE__ );
        $this->assertEquals( $bm->getWaterMass(), $crown->getWaterMass(), __LINE__ );
        $this->assertEquals( $bm->getWaterRatio(), $crown->getWaterRatio(), __LINE__ );
        $this->assertEquals( $bm->getHeatOfPreIgnition(), $crown->getHeatOfPreIgnition(), __LINE__ );
        $this->assertEquals( $bm->getSpreadRateNoWindNoSlope(), $crown->getSpreadRateNoWindNoSlope(), __LINE__, $d7 );

        // SurfaceFire\Spread properties
        $this->assertEquals( $bm->getEffectiveWindSpeedExceedsLimit(), $crown->getEffectiveWindSpeedExceedsLimit(), __LINE__ );
        $this->assertEquals( $bm->getEffectiveWindCoefficient(), $crown->getEffectiveWindCoefficient(), __LINE__, $d8 );

        // Set and test the CrownFire\Spread properties
        $crown->setCanopyHeight( $canopyHeight );
        $this->assertEquals( $canopyHeight, $crown->getCanopyHeight(), __LINE__ );

        $crown->setCanopyBaseHeight( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );
        $this->assertEquals( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );

        $crown->setCanopyBulkDensity( $canopyBulkDensity );
        $this->assertEquals( $canopyBulkDensity, $crown->getCanopyBulkDensity(), __LINE__ );

        $crown->setCanopyHeatContent( $canopyHeatContent );
        $this->assertEquals( $canopyHeatContent, $crown->getCanopyHeatContent(), __LINE__ );

        $crown->setCanopyFoliarMoistureContent( $canopyFoliarMoistureContent );
        $this->assertEquals( $canopyFoliarMoistureContent, $crown->getCanopyFoliarMoistureContent(), __LINE__ );

        $crown->setWindSpeedAt20Ft( $windSpeedAt20FtFpm );
        $this->assertEquals( $windSpeedAt20FtFpm, $crown->getWindSpeedAt20Ft(), __LINE__ );

        $crown->updateCrownFireSpread();

        // Set by CrownFire\Spread->updateCrownFireSpread()
        // BehavePlus6 output order
        $this->assertEquals( 112.938700503, $crown->getCriticalSurfaceFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 3.95840471719, $crown->getCriticalSurfaceFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 21.851930596532, $crown->getCrownFireTransitionRatio(), __LINE__ );
        $this->assertTrue( $crown->getIsCrownFire(), __LINE__ );
        $this->assertEquals( 30.7223522801, $crown->getCriticalCrownFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 2.015115278658, $crown->getActiveCrownFireRatio(), __LINE__ );
        $this->assertTrue( $crown->getIsActiveCrownFire(), __LINE__ );
        $this->assertEquals( 3, $crown->getFinalFireType(), __LINE__ );
        $this->assertEquals( 2.21813014553, $crown->getCriticalSurfaceFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 4.125000, $crown->getCrownFireLengthToWidthRatio(), __LINE__ );
        $this->assertEquals( 1472.7891731058, $crown->getFullCrownFireU20(), __LINE__ );
        $this->assertEquals( 61.909081476126, $crown->getActiveCrownFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 17454.97044157461, $crown->getActiveCrownFireHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 18010.35312051372, $crown->getActiveCrownFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 137.418376789506, $crown->getActiveCrownFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 3714.544888567592, $crown->getActiveCrownFireLength( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 2627103.303069, $crown->getActiveCrownFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 7938.77291469162, $crown->getActiveCrownFirePerimeter( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 61.909081476126, $crown->getPassiveCrownFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 17454.97044157461, $crown->getPassiveCrownFireHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 18010.35312051372, $crown->getPassiveCrownFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 137.418376789506, $crown->getPassiveCrownFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 3714.544888567592, $crown->getPassiveCrownFireLength( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 2627103.303069, $crown->getPassiveCrownFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 7938.77291469162, $crown->getPassiveCrownFirePerimeter( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 1.80000000000, $crown->getCanopyFuelLoad(), __LINE__ );
        $this->assertEquals( 14400.0000000, $crown->getCanopyHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 1.000000000, $crown->getCrownFractionBurned(), __LINE__ );
        $this->assertEquals( 139.615140469098, $crown->getPowerOfTheFire(), __LINE__ );
        $this->assertEquals( 47.96568165233, $crown->getPowerOfTheWind(), __LINE__ );
        $this->assertEquals( 2.9107298314046, $crown->getPowerRatio(), __LINE__ );
        $this->assertFalse( $crown->getIsWindDriven(), __LINE__ );

        // Other results not shown by BehavePlus6
        $this->assertFalse( $crown->getIsPassiveCrownFire(), __LINE__ );
        $this->assertFalse( $crown->getIsSurfaceFire(), __LINE__ );
        $this->assertTrue( $crown->getIsPlumeDominated(), __LINE__ );
        $this->assertEquals( 900.495730561840, $crown->getActiveCrownFireWidth( $elapsedMinutes ), __LINE__ );

        $this->assertEquals( 28.608788181, $crown->getFullCrownFireSpreadRateAtHead(), __LINE__, $d9 );
        $this->assertEquals( 61.909081476126, $crown->getFinalFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 17454.97044157461, $crown->getFinalFireHeatPerUnitArea(), __LINE__ );
        $this->assertEquals( 18010.35312051372, $crown->getFinalFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 137.418376789506, $crown->getFinalFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 3714.544888567592, $crown->getFinalFireLength( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 900.495730561840, $crown->getFinalFireWidth( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 7938.77291469162, $crown->getFinalFirePerimeter( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 2627103.303069, $crown->getFinalFireArea( $elapsedMinutes ), __LINE__, $d1 );

        $sc = $crown->getSpreadCalculator();
        $sc->update( $crown,
            $crown->getwindSpeedAtMidflameHeight(),
            $crown->getWindHeadingDirectionFromUpslope(),
            $crown->getSlopeSteepness(),
            $crown->getApplyEffectiveWindSpeedLimit(),
            $crown->getApplySpreadRateLimit() );
        $rosMax = $sc->getSpreadRateAtHead();
        $this->assertEquals( $rosMax, $crown->getSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 48.470426, $crown->getSpreadRateAtHead(), __LINE__, $d6 );

        $crown->setCanopyFuelLoad( 0.1 );
        $this->assertEquals( 0.1, $crown->getCanopyFuelLoad(), __LINE__, $d6 );
    }

    /**
     * Tests passive crown fire against BehavePlus6 run.
     * The active crown fire becomes passive by changing the crown bulk density from 0.02 to 0.005
     */
    public function test__passiveCrownFireBenchmarkBp6()
    {
        $d1 = 1.0e-1;
        $d4 = 1.0e-4;
        $d5 = 1.0e-5;
        $d6 = 1.0e-6;
        $d7 = 1.0e-7;
        $d8 = 1.0e-8;
        $d9 = 1.0e-9;

        // Define all the input parameter values
        $fuelModel = '124';
        $mcDead1 = 0.05;
        $mcDead10 = 0.07;
        $mcDead100 = 0.09;
        $mcHerb = 0.50;
        $mcStem = 1.50;
        $windSpeedAtMidflameHeightMph = 10.0;
        $windSpeedAtMidflameHeightFpm = 88. * $windSpeedAtMidflameHeightMph;
        $windSourceDirectionFromNorth = 270.;
        $windHeadingDirectionFromNorth = $windSourceDirectionFromNorth - 180.;
        $slopeSteepness = 0.25;
        $aspect = 180.;

        $canopyHeight = 100.;
        $canopyBaseHeight = 10.;
        $canopyBulkDensity = 0.005;
        $canopyHeatContent = 8000.;
        $canopyFoliarMoistureContent = 0.50;
        $windSpeedAt20FtMph = 25.;
        $windSpeedAt20FtFpm = 88. * $windSpeedAt20FtMph;

        $airTemp = 77.;
        $elapsedMinutes = 60.;

        // Create the model
        $bm = new Benchmark_gs4();

        $this->assertEquals( true, $this->catalog->has( $fuelModel ), __LINE__ );
        $crown = $this->catalog->getCrownFireSpread( $fuelModel, array( 'herbMoisture'=>$mcHerb ) );

        // The Fuel\Bed, Fuel\Complex, and SurfaceFire\Spread all gets updated on creation
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        // Set and test the surface fire input parameter values
        $crown->setMoistureContents( $mcDead1, $mcDead10, $mcDead100, $mcHerb, $mcStem );
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        $crown->setWindSpeedAtMidflameHeight( $windSpeedAtMidflameHeightFpm );
        $this->assertEquals( $windSpeedAtMidflameHeightFpm, $crown->getWindSpeedAtMidflameHeight(), __LINE__ );

        $crown->setWindSourceDirectionFromNorth( $windSourceDirectionFromNorth );
        $this->assertEquals( $windSourceDirectionFromNorth, $crown->getWindSourceDirectionFromNorth(), __LINE__ );

        $crown->setWindHeadingDirectionFromNorth( $windHeadingDirectionFromNorth );
        $this->assertEquals( $windHeadingDirectionFromNorth, $crown->getWindHeadingDirectionFromNorth(), __LINE__ );

        $crown->setSlopeSteepness( $slopeSteepness );
        $this->assertEquals( $slopeSteepness, $crown->getSlopeSteepness(), __LINE__ );

        $crown->setAspect( $aspect );
        $this->assertEquals( $aspect, $crown->getAspect(), __LINE__ );

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertTrue( $crown->getEnvironmentChanged(), __LINE__ );

        // Perform one (or more) updates
        $crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        // Fuel/Model properties
        $this->assertEquals( "Standard gs4 (124) herbMoisture 0.5", $crown->getDescription(), __LINE__ );
        $this->assertEquals( 6, $crown->getParticleCount(), __LINE__ );
        $this->assertEquals( 2.1, $crown->getFuelDepth(), __LINE__ );
        $this->assertEquals( 0.40, $crown->getDeadMoistureOfExtinction(), __LINE__ );

        // BehavePlus6 Outputs
        $this->assertEquals( 48.470426, $crown->getSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3054.970442, $crown->getHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 2467.92864505662, $crown->getFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 16.356317, $crown->getFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 12976.692888, $crown->getReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 87.613728665173383, $crown->getHeadingDirectionFromNorth(), __LINE__, $d8 );
        $this->assertEquals( 2908.225560, $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 880.556843, $crown->getEffectiveWindSpeed(), __LINE__, $d4 );
        $this->assertEquals( 11679.023600, $crown->getEffectiveWindSpeedLimit(), __LINE__, $d4 );
        $this->assertEquals( .05010068, $crown->getDeadMoistureContent(), __LINE__, $d8 );
        $this->assertEquals( 1.40390589, $crown->getLiveMoistureContent(), __LINE__, $d8 );
        $this->assertEquals( 1.65814217, $crown->getLiveMoistureOfExtinction(), __LINE__, $d8 );
        $this->assertEquals( 1631.128734, $crown->getBedSavr(), __LINE__, $d6 );
        $this->assertEquals( 0.279855, $crown->getBulkDensity(), __LINE__, $d6 );
        $this->assertEquals( 0.008745, $crown->getPackingRatio(), __LINE__, $d6 );
        $this->assertEquals( 1.116102, $crown->getPackingRatioRatio(), __LINE__, $d6 );
        $this->assertEquals( 7316.093556, $crown->getDeadReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 5660.599332, $crown->getLiveReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 32.788325, $crown->getWindCoefficient(), __LINE__, $d6 );
        $this->assertEquals( 1.366368, $crown->getSlopeCoefficient(), __LINE__, $d6 );
        $this->assertEquals( 15472.555105, $crown->getHeatSource(), __LINE__, $d6 );
        $this->assertEquals( 319.216404, $crown->getHeatSink(), __LINE__, $d6 );
        $this->assertEquals( 0.235420, $crown->getResidenceTime(), __LINE__, $d6 );
        $this->assertEquals( 3.501582, $crown->getEllipseLengthToWidthRatio(), __LINE__, $d6 );
        //$this->assertEquals( 0.778, $crown->getHerbCured(), __LINE__, $d6 );
        $this->assertEquals( 1978607.419499, $crown->getFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 6469.728229, $crown->getFirePerimeter( $elapsedMinutes ), __LINE__, $d4 );
        $this->assertEquals( 2908.225560, $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 424.104367, $crown->getSpreadDistanceAtFlank( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 61.846824, $crown->getSpreadDistanceAtBack( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 2970.072383, $crown->getFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 848.208733, $crown->getFireWidth( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 154.059122, $crown->getScorchHeightAtHead( $airTemp ), __LINE__, $d1 );

        // These are still good benchmark values
        $this->assertEquals( $bm->getBedEffectiveHeatingNumber(), $crown->getBedEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getBedFuelLoad(), $crown->getBedFuelLoad(), __LINE__ );
        $this->assertEquals( $bm->getBedSavr15(), $crown->getBedSavr15(), __LINE__ );
        $this->assertEquals( $bm->getBedSurfaceArea(), $crown->getBedSurfaceArea(), __LINE__ );

        $this->assertEquals( $bm->getDeadEffectiveHeatingNumber(), $crown->getDeadEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getDeadEffectiveMineralContent(), $crown->getDeadEffectiveMineralContent(), __LINE__ );
        $this->assertEquals( $bm->getDeadHeatContent(), $crown->getDeadHeatContent(), __LINE__ );
        $this->assertEquals( $bm->getDeadLoad(), $crown->getDeadLoad(), __LINE__ );
        $this->assertEquals( $bm->getDeadLoadWtd(), $crown->getDeadLoadWtd(), __LINE__ );
        $this->assertEquals( $bm->getDeadMineralDamping(), $crown->getDeadMineralDamping(), __LINE__ );
        $this->assertEquals( $bm->getDeadReactionIntensityDry(), $crown->getDeadReactionIntensityDry(), __LINE__ );
        $this->assertEquals( $bm->getDeadSavr(), $crown->getDeadSavr(), __LINE__ );
        $this->assertEquals( $bm->getDeadSizeClassWtg(0), $crown->getDeadSizeClassWtg(0), __LINE__ );
        $this->assertEquals( $bm->getDeadSurfaceArea(), $crown->getDeadSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getDeadSurfaceAreaWtg(), $crown->getDeadSurfaceAreaWtg(), __LINE__ );
        $this->assertEquals( $bm->getDeadTotalMineralContent(), $crown->getDeadTotalMineralContent(), __LINE__ );

        $this->assertEquals( $bm->getLiveEffectiveHeatingNumber(), $crown->getLiveEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getLiveEffectiveMineralContent(), $crown->getLiveEffectiveMineralContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveHeatContent(), $crown->getLiveHeatContent(), __LINE__ );
        $this->assertEquals( $bm->getLiveLoad(), $crown->getLiveLoad(), __LINE__ );
        $this->assertEquals( $bm->getLiveLoadWtd(), $crown->getLiveLoadWtd(), __LINE__ );
        $this->assertEquals( $bm->getLiveMineralDamping(), $crown->getLiveMineralDamping(), __LINE__ );
        $this->assertEquals( $bm->getLiveReactionIntensityDry(), $crown->getLiveReactionIntensityDry(), __LINE__ );
        $this->assertEquals( $bm->getLiveSavr(), $crown->getLiveSavr(), __LINE__ );
        $this->assertEquals( $bm->getLiveSizeClassWtg(0), $crown->getLiveSizeClassWtg(0), __LINE__ );
        $this->assertEquals( $bm->getLiveSurfaceArea(), $crown->getLiveSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getLiveSurfaceAreaWtg(), $crown->getLiveSurfaceAreaWtg(), __LINE__ );
        $this->assertEquals( $bm->getLiveTotalMineralContent(), $crown->getLiveTotalMineralContent(), __LINE__ );

        $this->assertEquals( $bm->getLiveMoistureOfExtinctionFactor(), $crown->getLiveMoistureOfExtinctionFactor(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatioOptimum(), $crown->getPackingRatioOptimum(), __LINE__ );
        $this->assertEquals( $bm->getPropagatingFluxRatio(), $crown->getPropagatingFluxRatio(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityExponent(), $crown->getReactionVelocityExponent(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityMaximum(), $crown->getReactionVelocityMaximum(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityOptimum(), $crown->getReactionVelocityOptimum(), __LINE__ );

        $this->assertEquals( $bm->getSlopeFactor(), $crown->getSlopeFactor(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorB(), $crown->getWindFactorB(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorE(), $crown->getWindFactorE(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorK(), $crown->getWindFactorK(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorKInverse(), $crown->getWindFactorKInverse(), __LINE__ );

        // Fuel/Complex properties
        $this->assertEquals( $bm->getDeadMoistureDamping(), $crown->getDeadMoistureDamping(), __LINE__ );
        $this->assertEquals( $bm->getLiveMoistureDamping(), $crown->getLiveMoistureDamping(), __LINE__ );
        $this->assertEquals( $bm->getWaterMass(), $crown->getWaterMass(), __LINE__ );
        $this->assertEquals( $bm->getWaterRatio(), $crown->getWaterRatio(), __LINE__ );
        $this->assertEquals( $bm->getHeatOfPreIgnition(), $crown->getHeatOfPreIgnition(), __LINE__ );
        $this->assertEquals( $bm->getSpreadRateNoWindNoSlope(), $crown->getSpreadRateNoWindNoSlope(), __LINE__, $d7 );

        // SurfaceFire\Spread properties
        $this->assertEquals( $bm->getEffectiveWindSpeedExceedsLimit(), $crown->getEffectiveWindSpeedExceedsLimit(), __LINE__ );
        $this->assertEquals( $bm->getEffectiveWindCoefficient(), $crown->getEffectiveWindCoefficient(), __LINE__, $d8 );

        // Set and test the CrownFire\Spread properties
        $crown->setCanopyHeight( $canopyHeight );
        $this->assertEquals( $canopyHeight, $crown->getCanopyHeight(), __LINE__ );

        $crown->setCanopyBaseHeight( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );
        $this->assertEquals( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );

        $crown->setCanopyBulkDensity( $canopyBulkDensity );
        $this->assertEquals( $canopyBulkDensity, $crown->getCanopyBulkDensity(), __LINE__ );

        $crown->setCanopyHeatContent( $canopyHeatContent );
        $this->assertEquals( $canopyHeatContent, $crown->getCanopyHeatContent(), __LINE__ );

        $crown->setCanopyFoliarMoistureContent( $canopyFoliarMoistureContent );
        $this->assertEquals( $canopyFoliarMoistureContent, $crown->getCanopyFoliarMoistureContent(), __LINE__ );

        $crown->setWindSpeedAt20Ft( $windSpeedAt20FtFpm );
        $this->assertEquals( $windSpeedAt20FtFpm, $crown->getWindSpeedAt20Ft(), __LINE__ );

        $crown->updateCrownFireSpread();

        // Set by CrownFire\Spread->updateCrownFireSpread()
        // BehavePlus6 output order
        $this->assertEquals( 112.938700503, $crown->getCriticalSurfaceFirelineIntensityAtHead(), __LINE__ );
        $this->assertEquals( 3.95840471719, $crown->getCriticalSurfaceFireFlameLengthAtHead(), __LINE__ );
        $this->assertEquals( 21.851930596532, $crown->getCrownFireTransitionRatio(), __LINE__ );
        $this->assertTrue( $crown->getIsCrownFire(), __LINE__ );
        $this->assertEquals( 122.889409, $crown->getCriticalCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 0.503779, $crown->getActiveCrownFireRatio(), __LINE__, $d6 );
        $this->assertFalse( $crown->getIsActiveCrownFire(), __LINE__ );
        $this->assertEquals( 1, $crown->getFinalFireType(), __LINE__ );
        $this->assertEquals( 2.21813014553, $crown->getCriticalSurfaceFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 4.125000, $crown->getCrownFireLengthToWidthRatio(), __LINE__ );
        $this->assertEquals( 3889.220675, $crown->getFullCrownFireU20(), __LINE__, $d6 );
        $this->assertEquals( 61.909081476126, $crown->getActiveCrownFireSpreadRateAtHead(), __LINE__ );
        $this->assertEquals( 6654.970442, $crown->getActiveCrownFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 6866.718455, $crown->getActiveCrownFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 72.254154, $crown->getActiveCrownFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3714.544889, $crown->getActiveCrownFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 2627103.303069, $crown->getActiveCrownFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 7938.77291469162, $crown->getActiveCrownFirePerimeter( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 54.570419, $crown->getPassiveCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4689.060505, $crown->getPassiveCrownFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 4264.733243, $crown->getPassiveCrownFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 52.596629, $crown->getPassiveCrownFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3274.225116, $crown->getPassiveCrownFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 2041187.968166, $crown->getPassiveCrownFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 6997.715858, $crown->getPassiveCrownFirePerimeter( $elapsedMinutes ), __LINE__, $d5 );
        $this->assertEquals( 0.45000000000, $crown->getCanopyFuelLoad(), __LINE__, $d6 );
        $this->assertEquals( 3600.0000000, $crown->getCanopyHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 0.453914, $crown->getCrownFractionBurned(), __LINE__, $d6 );
        $this->assertEquals( 53.230376, $crown->getPowerOfTheFire(), __LINE__, $d6 );
        $this->assertEquals( 47.965682, $crown->getPowerOfTheWind(), __LINE__, $d6 );
        $this->assertEquals( 1.109760, $crown->getPowerRatio(), __LINE__, $d6 );
        $this->assertFalse( $crown->getIsWindDriven(), __LINE__ );

        // Other results not shown by BehavePlus6
        $this->assertTrue( $crown->getIsPassiveCrownFire(), __LINE__ );
        $this->assertFalse( $crown->getIsSurfaceFire(), __LINE__ );
        $this->assertTrue( $crown->getIsPlumeDominated(), __LINE__ );
        $this->assertEquals( 900.495730561840, $crown->getActiveCrownFireWidth( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 793.7515432946, $crown->getPassiveCrownFireWidth( $elapsedMinutes ), __LINE__ );

        $this->assertEquals( 54.570419, $crown->getFinalFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4689.060505, $crown->getFinalFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 4264.733243, $crown->getFinalFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 52.596629, $crown->getFinalFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3274.225116, $crown->getFinalFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 793.7515432946, $crown->getFinalFireWidth( $elapsedMinutes ), __LINE__ );
        $this->assertEquals( 2041187.968166, $crown->getFinalFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 6997.715858, $crown->getFinalFirePerimeter( $elapsedMinutes ), __LINE__, $d5 );

        //$this->assertEquals( 28.608788181, $crown->getFullCrownFireSpreadRateAtHead(), __LINE__, $d9 );
    }

    /**
     * Tests Catalog->__construct()
     */
    public function test__passiveCrownFireBenchmarkBp6Run2()

    {
        $d1 = 1.0e-1;
        $d5 = 1.0e-5;
        $d6 = 1.0e-6;
        $d7 = 1.0e-7;
        $d8 = 1.0e-8;
        $d9 = 1.0e-9;
        $bm = new Benchmark_gs4();

        $fuelModel = '124';
        $mcDead1 = 0.05;
        $mcDead10 = 0.07;
        $mcDead100 = 0.09;
        $mcHerb = 1.10;
        $mcStem = 1.10;
        $windSpeedAtMidflameHeightMph = 10.0;
        $windSpeedAtMidflameHeightFpm = 88. * $windSpeedAtMidflameHeightMph;
        $windSourceDirectionFromNorth = 270.;
        $windHeadingDirectionFromNorth = $windSourceDirectionFromNorth - 180.;
        $slopeSteepness = 0.25;
        $aspect = 180.;

        $canopyHeight = 90.;
        $canopyBaseHeight = 10.;
        $canopyBulkDensity = 0.005;
        $canopyHeatContent = 8000.;
        $canopyFoliarMoistureContent = 0.70;
        $windSpeedAt20FtMph = 25.;
        $windSpeedAt20FtFpm = 88. * $windSpeedAt20FtMph;

        $airTemp = 77.;
        $elapsedMinutes = 60.;

        $this->assertEquals( true, $this->catalog->has( $fuelModel ), __LINE__ );
        $crown = $this->catalog->getCrownFireSpread( $fuelModel, array( 'herbMoisture'=>$mcHerb ) );

        $crown->setMoistureContents( $mcDead1, $mcDead10, $mcDead100, $mcHerb, $mcStem );
        $crown->setWindSpeedAtMidflameHeight( $windSpeedAtMidflameHeightFpm );
        $crown->setWindHeadingDirectionFromNorth( $windHeadingDirectionFromNorth );
        $crown->setSlopeSteepness( $slopeSteepness );
        $crown->setAspect( $aspect );
        $crown->setCanopyHeight( $canopyHeight );
        $crown->setCanopyBaseHeight( $canopyBaseHeight );
        $crown->setCanopyBulkDensity( $canopyBulkDensity );
        $crown->setCanopyFoliarMoistureContent( $canopyFoliarMoistureContent );
        $crown->setCanopyHeatContent( $canopyHeatContent );
        $crown->setWindSpeedAt20Ft( $windSpeedAt20FtFpm );

        $this->assertEquals( $mcDead1, $crown->getMoistureContentDead1Hour(), __LINE__ );
        $this->assertEquals( $mcDead10, $crown->getMoistureContentDead10Hour(), __LINE__ );
        $this->assertEquals( $mcDead100, $crown->getMoistureContentDead100Hour(), __LINE__ );
        $this->assertEquals( $mcHerb, $crown->getMoistureContentLiveHerb(), __LINE__ );
        $this->assertEquals( $mcStem, $crown->getMoistureContentLiveStem(), __LINE__ );
        $this->assertEquals( $windSpeedAtMidflameHeightFpm, $crown->getWindSpeedAtMidflameHeight(), __LINE__ );
        $this->assertEquals( $windHeadingDirectionFromNorth, $crown->getWindHeadingDirectionFromNorth(), __LINE__ );
        $this->assertEquals( $windSourceDirectionFromNorth, $crown->getWindSourceDirectionFromNorth(), __LINE__ );
        $this->assertEquals( $slopeSteepness, $crown->getSlopeSteepness(), __LINE__ );
        $this->assertEquals( $aspect, $crown->getAspect(), __LINE__ );
        $this->assertEquals( $canopyHeight, $crown->getCanopyHeight(), __LINE__ );
        $this->assertEquals( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );
        $this->assertEquals( $canopyBulkDensity, $crown->getCanopyBulkDensity(), __LINE__ );
        $this->assertEquals( $canopyHeatContent, $crown->getCanopyHeatContent(), __LINE__ );
        $this->assertEquals( $canopyFoliarMoistureContent, $crown->getCanopyFoliarMoistureContent(), __LINE__ );
        $this->assertEquals( $windSpeedAt20FtFpm, $crown->getWindSpeedAt20Ft(), __LINE__ );

        $crown->updateCrownFireSpread();

        // Fuel/Model properties
        $this->assertEquals( "Standard gs4 (124) herbMoisture 1.1", $crown->getDescription(), __LINE__ );
        $this->assertEquals( $bm->getParticleCount(), $crown->getParticleCount(), __LINE__ );
        $this->assertEquals( $bm->getFuelDepth(), $crown->getFuelDepth(), __LINE__ );
        $this->assertEquals( $bm->getDeadMoistureOfExtinction(), $crown->getDeadMoistureOfExtinction(), __LINE__ );

        // Fuel/Bed properties
        $this->assertEquals( $bm->getBedEffectiveHeatingNumber(), $crown->getBedEffectiveHeatingNumber(), __LINE__ );
        $this->assertEquals( $bm->getBedFuelLoad(), $crown->getBedFuelLoad(), __LINE__ );
        $this->assertEquals( $bm->getBedSavr(), $crown->getBedSavr(), __LINE__ );
        $this->assertEquals( $bm->getBedSavr15(), $crown->getBedSavr15(), __LINE__ );
        $this->assertEquals( $bm->getBedSurfaceArea(), $crown->getBedSurfaceArea(), __LINE__ );
        $this->assertEquals( $bm->getBulkDensity(), $crown->getBulkDensity(), __LINE__ );

//         $this->assertEquals( $bm->getDeadEffectiveHeatingNumber(), $crown->getDeadEffectiveHeatingNumber(), __LINE__ );
//         $this->assertEquals( $bm->getDeadEffectiveMineralContent(), $crown->getDeadEffectiveMineralContent(), __LINE__ );
//         $this->assertEquals( $bm->getDeadHeatContent(), $crown->getDeadHeatContent(), __LINE__ );
//         $this->assertEquals( $bm->getDeadLoad(), $crown->getDeadLoad(), __LINE__ );
//         $this->assertEquals( $bm->getDeadLoadWtd(), $crown->getDeadLoadWtd(), __LINE__ );
//         $this->assertEquals( $bm->getDeadMineralDamping(), $crown->getDeadMineralDamping(), __LINE__ );
//         $this->assertEquals( $bm->getDeadReactionIntensityDry(), $crown->getDeadReactionIntensityDry(), __LINE__ );
//         $this->assertEquals( $bm->getDeadSavr(), $crown->getDeadSavr(), __LINE__ );
//         $this->assertEquals( $bm->getDeadSizeClassWtg(0), $crown->getDeadSizeClassWtg(0), __LINE__ );
//         $this->assertEquals( $bm->getDeadSurfaceArea(), $crown->getDeadSurfaceArea(), __LINE__ );
//         $this->assertEquals( $bm->getDeadSurfaceAreaWtg(), $crown->getDeadSurfaceAreaWtg(), __LINE__ );
//         $this->assertEquals( $bm->getDeadTotalMineralContent(), $crown->getDeadTotalMineralContent(), __LINE__ );

//         $this->assertEquals( $bm->getLiveEffectiveHeatingNumber(), $crown->getLiveEffectiveHeatingNumber(), __LINE__ );
//         $this->assertEquals( $bm->getLiveEffectiveMineralContent(), $crown->getLiveEffectiveMineralContent(), __LINE__ );
//         $this->assertEquals( $bm->getLiveHeatContent(), $crown->getLiveHeatContent(), __LINE__ );
//         $this->assertEquals( $bm->getLiveLoad(), $crown->getLiveLoad(), __LINE__ );
//         $this->assertEquals( $bm->getLiveLoadWtd(), $crown->getLiveLoadWtd(), __LINE__ );
//         $this->assertEquals( $bm->getLiveMineralDamping(), $crown->getLiveMineralDamping(), __LINE__ );
//         $this->assertEquals( $bm->getLiveReactionIntensityDry(), $crown->getLiveReactionIntensityDry(), __LINE__ );
//         $this->assertEquals( $bm->getLiveSavr(), $crown->getLiveSavr(), __LINE__ );
//         $this->assertEquals( $bm->getLiveSizeClassWtg(0), $crown->getLiveSizeClassWtg(0), __LINE__ );
//         $this->assertEquals( $bm->getLiveSurfaceArea(), $crown->getLiveSurfaceArea(), __LINE__ );
//         $this->assertEquals( $bm->getLiveSurfaceAreaWtg(), $crown->getLiveSurfaceAreaWtg(), __LINE__ );
//         $this->assertEquals( $bm->getLiveTotalMineralContent(), $crown->getLiveTotalMineralContent(), __LINE__ );

//        $this->assertEquals( $bm->getLiveMoistureOfExtinctionFactor(), $crown->getLiveMoistureOfExtinctionFactor(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatio(), $crown->getPackingRatio(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatioOptimum(), $crown->getPackingRatioOptimum(), __LINE__ );
        $this->assertEquals( $bm->getPackingRatioRatio(), $crown->getPackingRatioRatio(), __LINE__ );
        $this->assertEquals( $bm->getPropagatingFluxRatio(), $crown->getPropagatingFluxRatio(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityExponent(), $crown->getReactionVelocityExponent(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityMaximum(), $crown->getReactionVelocityMaximum(), __LINE__ );
        $this->assertEquals( $bm->getReactionVelocityOptimum(), $crown->getReactionVelocityOptimum(), __LINE__ );
        $this->assertEquals( $bm->getResidenceTime(), $crown->getResidenceTime(), __LINE__ );

        $this->assertEquals( $bm->getSlopeFactor(), $crown->getSlopeFactor(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorB(), $crown->getWindFactorB(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorE(), $crown->getWindFactorE(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorK(), $crown->getWindFactorK(), __LINE__ );
        $this->assertEquals( $bm->getWindFactorKInverse(), $crown->getWindFactorKInverse(), __LINE__ );

        // Fuel/Complex properties
//         $this->assertEquals( $bm->getDeadMoistureContent(), $crown->getDeadMoistureContent(), __LINE__ );
//         $this->assertEquals( $bm->getLiveMoistureContent(), $crown->getLiveMoistureContent(), __LINE__ );

//         $this->assertEquals( $bm->getDeadMoistureDamping(), $crown->getDeadMoistureDamping(), __LINE__ );
//         $this->assertEquals( $bm->getLiveMoistureDamping(), $crown->getLiveMoistureDamping(), __LINE__ );

//         $this->assertEquals( $bm->getWaterMass(), $crown->getWaterMass(), __LINE__ );
//         $this->assertEquals( $bm->getWaterRatio(), $crown->getWaterRatio(), __LINE__ );
//         $this->assertEquals( $bm->getLiveMoistureOfExtinction(), $crown->getLiveMoistureOfExtinction(), __LINE__ );

//         $this->assertEquals( $bm->getHeatOfPreIgnition(), $crown->getHeatOfPreIgnition(), __LINE__ );
//         $this->assertEquals( $bm->getHeatSink(), $crown->getHeatSink(), __LINE__ );

//         $this->assertEquals( $bm->getDeadReactionIntensity(), $crown->getDeadReactionIntensity(), __LINE__ );
//         $this->assertEquals( $bm->getLiveReactionIntensity(), $crown->getLiveReactionIntensity(), __LINE__ );
//         $this->assertEquals( $bm->getReactionIntensity(), $crown->getReactionIntensity(), __LINE__ );
//         $this->assertEquals( $bm->getHeatPerUnitArea(), $crown->getHeatPerUnitArea(), __LINE__, $d6 );
//         $this->assertEquals( $bm->getSpreadRateNoWindNoSlope(), $crown->getSpreadRateNoWindNoSlope(), __LINE__, $d7 );

        // SurfaceFire\Spread properties
//         $this->assertEquals( $bm->getSlopeCoefficient(), $crown->getSlopeCoefficient(), __LINE__ );
//         $this->assertEquals( $bm->getWindCoefficient(), $crown->getWindCoefficient(), __LINE__ );
//         $this->assertEquals( $bm->getEffectiveWindSpeedLimit(), $crown->getEffectiveWindSpeedLimit(), __LINE__ );
//         $this->assertEquals( $bm->getEffectiveWindSpeed(), $crown->getEffectiveWindSpeed(), __LINE__, $d8 );
//         $this->assertEquals( $bm->getEffectiveWindSpeedExceedsLimit(), $crown->getEffectiveWindSpeedExceedsLimit(), __LINE__ );
         $this->assertEquals( 13.670005, $crown->getSpreadRateAtHead(), __LINE__, $d6 );
//         $this->assertEquals( $bm->getHeadingDirectionFromUpslope(), $crown->getHeadingDirectionFromUpslope(), __LINE__, $d7 );
//         $this->assertEquals( $bm->getEllipseLengthToWidthRatio(), $crown->getEllipseLengthToWidthRatio(), __LINE__, $d6 );
//         $this->assertEquals( $bm->getEffectiveWindCoefficient(), $crown->getEffectiveWindCoefficient(), __LINE__ );

//         $this->assertEquals( $bm->getSpreadDistanceAtHead(), $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
//         $this->assertEquals( $bm->getSpreadDistanceAtBack(), $crown->getSpreadDistanceAtBack( $elapsedMinutes ), __LINE__, $d6 );
//         $this->assertEquals( $bm->getSpreadDistanceAtFlank(), $crown->getSpreadDistanceAtFlank( $elapsedMinutes ), __LINE__, $d6 );
//         $this->assertEquals( $bm->getFireLength(), $crown->getFireLength( $elapsedMinutes ), __LINE__, $d6 );
//         $this->assertEquals( $bm->getFireWidth(), $crown->getFireWidth( $elapsedMinutesd ), __LINE__, $d6 );
//         $this->assertEquals( $bm->getFirePerimeter(), $crown->getFirePerimeter( $elapsedMinutes ), __LINE__, $d5 );
//         $this->assertEquals( $bm->getFireArea(), $crown->getFireArea( $elapsedMinutes ), __LINE__, $d1 );

//         $airTemp = $bm->getAirTemperature();
//         $this->assertEquals( $bm->getScorchHeightAtHead(), $crown->getScorchHeightAtHead( $airTemp ), __LINE__, $d1 );


        // Set by CrownFire\Spread->updateCrownFireSpread()
        $this->assertEquals( 77.562013, $crown->getActiveCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        // Set by CrownFire\Spread->updateCanopyDependents()
        $this->assertEquals( 4.125000, $crown->getCrownFireLengthToWidthRatio(), __LINE__, $d6 );
        $this->assertEquals( 0.4000000000, $crown->getCanopyFuelLoad(), __LINE__, $d6 );
        $this->assertEquals( 3200.0000000, $crown->getCanopyHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 166.466274, $crown->getCriticalSurfaceFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4.731759, $crown->getCriticalSurfaceFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 122.889409, $crown->getCriticalCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 0.631153, $crown->getActiveCrownFireRatio(), __LINE__, $d6 );
        $this->assertEquals( 46.919907, $crown->getPowerOfTheWind(), __LINE__, $d6 );
        // Set by CrownFire\Spread->updateSurfaceFireDependents()
        $this->assertEquals( 4061.006133, $crown->getActiveCrownFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 5249.663528, $crown->getActiveCrownFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 60.411225, $crown->getActiveCrownFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4653.720797, $crown->getActiveCrownFireLength( 60. ), __LINE__, $d6 );
        //$this->assertEquals( , $crown->getActiveCrownFireWidth( 60. ), __LINE__ );
        $this->assertEquals( 9945.991698, $crown->getActiveCrownFirePerimeter( 60. ), __LINE__, $d5 );
        $this->assertEquals( 4123505.48, $crown->getActiveCrownFireArea( 60. ), __LINE__, 0.01 );
        $this->assertEquals( 196.165969, $crown->getFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 1.178413, $crown->getCrownFireTransitionRatio(), __LINE__, $d6 );
        $this->assertEquals( 1, $crown->getFinalFireType(), __LINE__, $d6 );
        $this->assertTrue( $crown->getIsCrownFire(), __LINE__ );
        $this->assertFalse( $crown->getIsActiveCrownFire(), __LINE__ );
        $this->assertTrue( $crown->getIsPassiveCrownFire(), __LINE__ );
        $this->assertFalse( $crown->getIsSurfaceFire(), __LINE__ );
        $this->assertEquals( 40.695066, $crown->getPowerOfTheFire(), __LINE__, $d6 );
        $this->assertEquals( 0.867330, $crown->getPowerRatio(), __LINE__, $d6 );
        $this->assertFalse( $crown->getIsPlumeDominated(), __LINE__ );
        $this->assertTrue( $crown->getIsWindDriven(), __LINE__ );
        $this->assertEquals( 11.600355, $crown->getCriticalSurfaceFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3321.335120, $crown->getFullCrownFireU20(), __LINE__, $d6 );
        //$this->assertEquals( 28.608788181, $crown->getFullCrownFireSpreadRateAtHead(), __LINE__, $d9 );
        $this->assertEquals( 0.170644, $crown->getCrownFractionBurned(), __LINE__, $d6 );
        $this->assertEquals( 24.572769, $crown->getPassiveCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 1407.065713, $crown->getPassiveCrownFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 576.258334, $crown->getPassiveCrownFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 13.849735, $crown->getPassiveCrownFireFlameLengthAtHead(), __LINE__, $d6 );

        $this->assertEquals( 24.572769, $crown->getFinalFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 1407.065713, $crown->getFinalFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 576.258334, $crown->getFinalFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 13.849735, $crown->getFinalFireFlameLengthAtHead(), __LINE__, $d6 );
    }

    /**
     * Tests active crown fire against BehavePlus6 run.
     */
    public function test__nonCrownFireBenchmarkBp6()
    {
        $d1 = 1.0e-1;
        $d4 = 1.0e-4;
        $d5 = 1.0e-5;
        $d6 = 1.0e-6;
        $d7 = 1.0e-7;
        $d8 = 1.0e-8;
        $d9 = 1.0e-9;

        // Define all the input parameter values
        $fuelModel = '124';
        $mcDead1 = 0.05;
        $mcDead10 = 0.07;
        $mcDead100 = 0.09;
        $mcHerb = 1.50;
        $mcStem = 1.50;
        $windSpeedAtMidflameHeightMph = 10.0;
        $windSpeedAtMidflameHeightFpm = 88. * $windSpeedAtMidflameHeightMph;
        $windSourceDirectionFromNorth = 270.;
        $windHeadingDirectionFromNorth = $windSourceDirectionFromNorth - 180.;
        $slopeSteepness = 0.25;
        $aspect = 180.;

        $canopyHeight = 90.;
        $canopyBaseHeight = 10.;
        $canopyBulkDensity = 0.005;
        $canopyHeatContent = 8000.;
        $canopyFoliarMoistureContent = 0.70;
        $windSpeedAt20FtMph = 25.;
        $windSpeedAt20FtFpm = 88. * $windSpeedAt20FtMph;

        $airTemp = 77.;
        $elapsedMinutes = 60.;

        // Create the model
        $bm = new Benchmark_gs4();

        $this->assertEquals( true, $this->catalog->has( $fuelModel ), __LINE__ );
        $crown = $this->catalog->getCrownFireSpread( $fuelModel, array( 'herbMoisture'=>$mcHerb ) );

        // The Fuel\Bed, Fuel\Complex, and SurfaceFire\Spread all gets updated on creation
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        // Set and test the surface fire input parameter values
        $crown->setMoistureContents( $mcDead1, $mcDead10, $mcDead100, $mcHerb, $mcStem );
        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        $crown->setWindSpeedAtMidflameHeight( $windSpeedAtMidflameHeightFpm );
        $this->assertEquals( $windSpeedAtMidflameHeightFpm, $crown->getWindSpeedAtMidflameHeight(), __LINE__ );

        $crown->setWindSourceDirectionFromNorth( $windSourceDirectionFromNorth );
        $this->assertEquals( $windSourceDirectionFromNorth, $crown->getWindSourceDirectionFromNorth(), __LINE__ );

        $crown->setSlopeSteepness( $slopeSteepness );
        $this->assertEquals( $slopeSteepness, $crown->getSlopeSteepness(), __LINE__ );

        $crown->setAspect( $aspect );
        $this->assertEquals( $aspect, $crown->getAspect(), __LINE__ );

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertTrue( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertTrue( $crown->getEnvironmentChanged(), __LINE__ );

        // Perform one (or more) updates
        $crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();
        //$crown->updateCrownFireSpread();

        $this->assertFalse( $crown->getFuelModelChanged(), __LINE__ );
        $this->assertFalse( $crown->getFuelMoistureChanged(), __LINE__ );
        $this->assertFalse( $crown->getEnvironmentChanged(), __LINE__ );

        // Fuel/Model properties
        $this->assertEquals( "Standard gs4 (124) herbMoisture 1.5", $crown->getDescription(), __LINE__ );
        $this->assertEquals( 5, $crown->getParticleCount(), __LINE__ );
        $this->assertEquals( 2.1, $crown->getFuelDepth(), __LINE__ );
        $this->assertEquals( 0.40, $crown->getDeadMoistureOfExtinction(), __LINE__ );

        // BehavePlus6 Outputs
        $this->assertEquals( 8.574903, $crown->getSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 716.340633, $crown->getHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 102.375854, $crown->getFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3.783584, $crown->getFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3042.822367, $crown->getReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 87.613728665173383, $crown->getHeadingDirectionFromNorth(), __LINE__, $d8 );
        $this->assertEquals( 514.494166, $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 880.556843, $crown->getEffectiveWindSpeed(), __LINE__, $d6 );
        $this->assertEquals( 2738.540131, $crown->getEffectiveWindSpeedLimit(), __LINE__, $d6 );
        $this->assertEquals( .050224, $crown->getDeadMoistureContent(), __LINE__, $d6 );
        $this->assertEquals( 1.50000, $crown->getLiveMoistureContent(), __LINE__, $d6 );
        $this->assertEquals( 0.400000, $crown->getLiveMoistureOfExtinction(), __LINE__, $d8 );
        $this->assertEquals( 1631.128734, $crown->getBedSavr(), __LINE__, $d6 );
        $this->assertEquals( 0.279855, $crown->getBulkDensity(), __LINE__, $d6 );
        $this->assertEquals( 0.008745, $crown->getPackingRatio(), __LINE__, $d6 );
        $this->assertEquals( 1.116102, $crown->getPackingRatioRatio(), __LINE__, $d6 );
        $this->assertEquals( 3042.822367, $crown->getDeadReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 0.000000, $crown->getLiveReactionIntensity(), __LINE__, $d6 );
        $this->assertEquals( 32.788325, $crown->getWindCoefficient(), __LINE__, $d6 );
        $this->assertEquals( 1.366368, $crown->getSlopeCoefficient(), __LINE__, $d6 );
        $this->assertEquals( 3628.061260, $crown->getHeatSource(), __LINE__, $d6 );
        $this->assertEquals( 423.102321, $crown->getHeatSink(), __LINE__, $d6 );
        $this->assertEquals( 0.235420, $crown->getResidenceTime(), __LINE__, $d6 );
        $this->assertEquals( 3.501582, $crown->getEllipseLengthToWidthRatio(), __LINE__, $d6 );
        //$this->assertEquals( 0.778, $crown->getHerbCured(), __LINE__, $d6 );
        $this->assertEquals( 61924.765091, $crown->getFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 1144.559581, $crown->getFirePerimeter( $elapsedMinutes ), __LINE__, $d4 );
        $this->assertEquals( 514.494166, $crown->getSpreadDistanceAtHead( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 75.028301, $crown->getSpreadDistanceAtFlank( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 10.941321, $crown->getSpreadDistanceAtBack( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 525.435487, $crown->getFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 150.056602, $crown->getFireWidth( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 6.669086, $crown->getScorchHeightAtHead( $airTemp ), __LINE__, $d1 );

        // Set and test the CrownFire\Spread properties
        $crown->setCanopyHeight( $canopyHeight );
        $this->assertEquals( $canopyHeight, $crown->getCanopyHeight(), __LINE__ );

        $crown->setCanopyBaseHeight( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );
        $this->assertEquals( $canopyBaseHeight, $crown->getCanopyBaseHeight(), __LINE__ );

        $crown->setCanopyBulkDensity( $canopyBulkDensity );
        $this->assertEquals( $canopyBulkDensity, $crown->getCanopyBulkDensity(), __LINE__ );

        $crown->setCanopyHeatContent( $canopyHeatContent );
        $this->assertEquals( $canopyHeatContent, $crown->getCanopyHeatContent(), __LINE__ );

        $crown->setCanopyFoliarMoistureContent( $canopyFoliarMoistureContent );
        $this->assertEquals( $canopyFoliarMoistureContent, $crown->getCanopyFoliarMoistureContent(), __LINE__ );

        $crown->setWindSpeedAt20Ft( $windSpeedAt20FtFpm );
        $this->assertEquals( $windSpeedAt20FtFpm, $crown->getWindSpeedAt20Ft(), __LINE__ );

        $crown->updateCrownFireSpread();

        // Set by CrownFire\Spread->updateCrownFireSpread()
        // BehavePlus6 output order
        $this->assertEquals( 166.466274, $crown->getCriticalSurfaceFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4.731759, $crown->getCriticalSurfaceFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 0.614995, $crown->getCrownFireTransitionRatio(), __LINE__, $d6 );
        $this->assertFalse( $crown->getIsCrownFire(), __LINE__ );
        $this->assertEquals( 122.889409, $crown->getCriticalCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 0.503779, $crown->getActiveCrownFireRatio(), __LINE__, $d6 );
        $this->assertFalse( $crown->getIsActiveCrownFire(), __LINE__ );
        $this->assertEquals( 0, $crown->getFinalFireType(), __LINE__, $d6 );

        $this->assertEquals( 13.943054, $crown->getCriticalSurfaceFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4.125000, $crown->getCrownFireLengthToWidthRatio(), __LINE__, $d6 );
        $this->assertEquals( 3889.220675, $crown->getFullCrownFireU20(), __LINE__, $d6 );
        $this->assertEquals( 61.909081476126, $crown->getActiveCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3916.340633, $crown->getActiveCrownFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 4040.950855, $crown->getActiveCrownFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 50.740223, $crown->getActiveCrownFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3714.544889, $crown->getActiveCrownFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 2627103.303069, $crown->getActiveCrownFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 7938.77291469162, $crown->getActiveCrownFirePerimeter( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 8.574903, $crown->getPassiveCrownFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 716.340633, $crown->getPassiveCrownFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 102.375854, $crown->getPassiveCrownFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 4.376850, $crown->getPassiveCrownFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 514.494166, $crown->getPassiveCrownFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 50399.570690, $crown->getPassiveCrownFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 1099.583521, $crown->getPassiveCrownFirePerimeter( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 0.40000000000, $crown->getCanopyFuelLoad(), __LINE__, $d6 );
        $this->assertEquals( 3200.0000000, $crown->getCanopyHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 0.000000000, $crown->getCrownFractionBurned(), __LINE__, $d6 );
        $this->assertEquals( 31.325200, $crown->getPowerOfTheFire(), __LINE__, $d6 );
        $this->assertEquals( 47.96568165233, $crown->getPowerOfTheWind(), __LINE__, $d6 );
        $this->assertEquals( 0.653075, $crown->getPowerRatio(), __LINE__, $d6 );
        $this->assertTrue( $crown->getIsWindDriven(), __LINE__ );

        // Other results not shown by BehavePlus6
        $this->assertFalse( $crown->getIsPassiveCrownFire(), __LINE__ );
        $this->assertTrue( $crown->getIsSurfaceFire(), __LINE__ );
        $this->assertFalse( $crown->getIsPlumeDominated(), __LINE__ );
        $this->assertEquals( 900.495730561840, $crown->getActiveCrownFireWidth( 60. ), __LINE__ );
        $this->assertEquals( 18.418940975, $crown->getFullCrownFireSpreadRateAtHead(), __LINE__, $d9 );

        $this->assertEquals( 8.574903, $crown->getFinalFireSpreadRateAtHead(), __LINE__, $d6 );
        $this->assertEquals( 716.340633, $crown->getFinalFireHeatPerUnitArea(), __LINE__, $d6 );
        $this->assertEquals( 102.375854, $crown->getFinalFirelineIntensityAtHead(), __LINE__, $d6 );
        $this->assertEquals( 3.783584, $crown->getFinalFireFlameLengthAtHead(), __LINE__, $d6 );
        $this->assertEquals( 61924.765091, $crown->getFinalFireArea( $elapsedMinutes ), __LINE__, $d1 );
        $this->assertEquals( 1144.559581, $crown->getFinalFirePerimeter( $elapsedMinutes ), __LINE__, $d4 );
        $this->assertEquals( 525.435487, $crown->getFinalFireLength( $elapsedMinutes ), __LINE__, $d6 );
        $this->assertEquals( 150.056602, $crown->getFinalFireWidth( $elapsedMinutes ), __LINE__, $d6 );
    }
}
