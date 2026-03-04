import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FormSection from '@/models/FormSection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const sections = await FormSection.find();
    
    // Find duplicates based on label
    const unique = new Map();
    const toKeep = [];
    const toDelete = [];
    
    sections.forEach(s => {
      if (!unique.has(s.label)) {
        unique.set(s.label, true);
        toKeep.push(s._id);
      } else {
        toDelete.push(s._id);
      }
    });

    let deletedCount = 0;
    if (toDelete.length > 0) {
      const result = await FormSection.deleteMany({ _id: { $in: toDelete } });
      deletedCount = result.deletedCount;
    }

    const remaining = await FormSection.find().sort({ order: 1 });
    
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      remainingCount: remaining.length,
      remainingLabels: remaining.map(r => r.label)
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
