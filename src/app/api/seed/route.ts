import { SeedDataService } from '@/services/seed-data/SeedDataService';
import { NextResponse } from 'next/server';

export async function POST(): Promise<Response> {
  const drivers = await SeedDataService.genCreateSeedDrivers();
  return NextResponse.json(drivers, { status: 201 });
}

export async function DELETE(): Promise<Response> {
  await SeedDataService.genDeleteSeedDrivers();
  return new Response(null, { status: 204 });
}
