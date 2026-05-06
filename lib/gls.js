import axios from "axios";
import crypto from "crypto";

const BASE_URL = "https://api.mygls.ro/ParcelService.svc/json";

function hashPassword(password) {
  const hash = crypto.createHash("sha512").update(password).digest();
  return Array.from(hash);
}

function auth() {
  return {
    Username: process.env.MYGLS_USERNAME,
    Password: hashPassword(process.env.MYGLS_PASSWORD)
  };
}

export async function findParcelId(tracking) {
  const today = new Date();
  const from = new Date();
  from.setDate(today.getDate() - 30);

  const res = await axios.post(`${BASE_URL}/GetParcelList`, {
    ...auth(),
    PrintDateFrom: from.toISOString(),
    PrintDateTo: today.toISOString()
  });

  const list = res.data.PrintDataInfoList || [];
  const parcel = list.find(
    p => String(p.ParcelNumber) === String(tracking) ||
         String(p.ParcelNumberWithCheckdigit) === String(tracking)
  );

  if (!parcel) throw new Error("Tracking not found");
  return parcel.ParcelId;
}

export async function downloadLabel(parcelId) {
  const res = await axios.post(`${BASE_URL}/GetPrintedLabels`, {
    ...auth(),
    ParcelIdList: [parcelId],
    PrintPosition: 1,
    ShowPrintDialog: false,
    TypeOfPrinter: "A4_4x1"
  });

  if (!res.data.Labels) throw new Error("No PDF returned");
  return res.data.Labels;
}