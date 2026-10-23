import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  findNearbyWaste,
  findNearbyOfftakers,
  toGeoJSONFeatureCollection,
  GeoJSONFeatureCollection,
} from '@si-mukti/database';
import { GisActiveWasteQueryDto } from './dto/gis-query.dto';

@Injectable()
export class SpatialGisService {
  private readonly logger = new Logger(SpatialGisService.name);

  // Titik koordinat pusat default: Sentra Industri Campurdarat Tulungagung
  private readonly DEFAULT_LAT = -8.1633;
  private readonly DEFAULT_LNG = 111.8594;

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Menghasilkan GeoJSON FeatureCollection titik limbah aktif (Pin Hijau & Oranye)
   * Terfilter menggunakan PostGIS ST_DWithin & ST_Distance
   */
  async getActiveWasteGeoJson(query: GisActiveWasteQueryDto): Promise<GeoJSONFeatureCollection> {
    const targetLat = query.targetLat ?? this.DEFAULT_LAT;
    const targetLng = query.targetLng ?? this.DEFAULT_LNG;
    const radiusKm = query.radiusKm ?? 15.0;

    const nearbyItems = await findNearbyWaste(this.databaseService.db, {
      targetLat,
      targetLng,
      radiusKm,
      wasteType: query.wasteType,
      minCaco3: query.minCaco3,
    });

    this.logger.log(
      `[SpatialGIS] Ditemukan ${nearbyItems.length} titik limbah aktif dalam radius ${radiusKm}km dari (${targetLat}, ${targetLng})`
    );

    return toGeoJSONFeatureCollection(nearbyItems, 'wasteId');
  }

  /**
   * Menghasilkan GeoJSON FeatureCollection fasilitas pabrik offtaker (Pin Ungu)
   */
  async getOfftakersGeoJson(query?: { targetLat?: number; targetLng?: number; radiusKm?: number }): Promise<GeoJSONFeatureCollection> {
    const targetLat = query?.targetLat ?? this.DEFAULT_LAT;
    const targetLng = query?.targetLng ?? this.DEFAULT_LNG;
    const radiusKm = query?.radiusKm ?? 25.0;

    const offtakers = await findNearbyOfftakers(this.databaseService.db, {
      targetLat,
      targetLng,
      radiusKm,
    });

    const items = offtakers.map((o) => ({
      ...o,
      pinColorCategory: 'UNGU_PABRIK',
    }));

    return toGeoJSONFeatureCollection(items, 'offtakerId');
  }

  /**
   * Mengambil data telemetri dampak lingkungan regional Disperindag & Pemkab Tulungagung
   */
  async getEnvironmentalMetrics() {
    const { db, schema } = this.databaseService;

    const metrics = await db.query.regionalEnvironmentalMetrics.findMany();

    const totals = metrics.reduce(
      (acc, item) => {
        acc.totalWasteGeneratedTons += Number(item.totalWasteGeneratedTons);
        acc.totalWasteAbsorbedTons += Number(item.totalWasteAbsorbedTons);
        acc.riverDumpingPreventedTons += Number(item.riverDumpingPreventedTons);
        acc.carbonEmissionsReducedKg += Number(item.carbonEmissionsReducedKg);
        acc.economicSurplusGeneratedIdr += Number(item.economicSurplusGeneratedIdr);
        acc.activeParticipatingWorkshops += item.activeParticipatingWorkshops;
        return acc;
      },
      {
        totalWasteGeneratedTons: 0,
        totalWasteAbsorbedTons: 0,
        riverDumpingPreventedTons: 0,
        carbonEmissionsReducedKg: 0,
        economicSurplusGeneratedIdr: 0,
        activeParticipatingWorkshops: 0,
      }
    );

    return {
      summary: {
        ...totals,
        wasteAbsorptionRatePct: totals.totalWasteGeneratedTons > 0
          ? Math.round((totals.totalWasteAbsorbedTons / totals.totalWasteGeneratedTons) * 1000) / 10
          : 0,
        co2ReductionEquivalentCarsMonth: Math.round(totals.carbonEmissionsReducedKg / 150),
      },
      regions: metrics,
    };
  }
}
