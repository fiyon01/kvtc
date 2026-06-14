import { NextResponse } from 'next/server';
import { getTopCourses } from '@/lib/analytics';

export async function GET() {
  try {
    const topCourses = await getTopCourses(5);
    
    // Add artificial delay in dev to test loading states
    // await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: topCourses
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
