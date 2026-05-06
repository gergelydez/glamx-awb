import { findParcelId, downloadLabel } from "@/lib/gls";

export async function POST(req) {
  try {
    const { tracking } = await req.json();

    const parcelId = await findParcelId(tracking);
    const pdfBase64 = await downloadLabel(parcelId);

    return Response.json({
      success: true,
      tracking,
      pdf: pdfBase64
    });
  } catch (e) {
    return Response.json({
      success: false,
      error: e.message
    }, { status: 500 });
  }
}